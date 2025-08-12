using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace TravelBuddy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public SearchController(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _http = httpClientFactory.CreateClient();
        }

        [HttpGet]
        public async Task<IActionResult> Search(
            [FromQuery] string origin,
            [FromQuery] string destination,
            [FromQuery] string outbound_date,
            [FromQuery] int stay_days)
        {
            if (string.IsNullOrEmpty(origin) || string.IsNullOrEmpty(destination) || string.IsNullOrEmpty(outbound_date))
                return BadRequest("origin, destination and outbound_date are required.");

            if (stay_days <= 0)
                return BadRequest("stay_days must be a positive integer.");

            if (!DateTime.TryParse(outbound_date, out var outboundDateParsed))
                return BadRequest("Invalid outbound_date format, expected YYYY-MM-DD.");

            var returnDateParsed = outboundDateParsed.AddDays(stay_days);
            var return_date = returnDateParsed.ToString("yyyy-MM-dd");

            var flights = await SearchFlightsRoundTrip(origin, destination, outbound_date, return_date);

            return Ok(new { flights });
        }

        private async Task<object> SearchFlightsRoundTrip(string origin, string destination, string outboundDate, string returnDate)
        {
            var host = _config["RapidAPI:FlightsHost"];
            var key = _config["RapidAPI:FlightsKey"];

            var url = $"https://{host}/api/v1/searchFlights?departure_id={origin}&arrival_id={destination}&travel_class=ECONOMY&adults=1&show_hidden=1&currency=USD&language_code=en-US&country_code=US&search_type=best&outbound_date={outboundDate}&return_date={returnDate}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("x-rapidapi-key", key);
            request.Headers.Add("x-rapidapi-host", host);

            var response = await _http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return new { status = false, message = error };
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine(json);

            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("data", out var dataElement))
                return new { status = false, message = "No flight data found" };

            if (!dataElement.TryGetProperty("itineraries", out var itinerariesElement))
                return new { status = false, message = "No itineraries found" };

            if (!itinerariesElement.TryGetProperty("topFlights", out var topFlightsElement))
                return new { status = false, message = "No topFlights found" };

            if (topFlightsElement.ValueKind != JsonValueKind.Array)
                return new { status = false, message = "topFlights is not an array" };

            var flights = topFlightsElement.EnumerateArray()
                .Select(flightItem =>
                {
                    string departureTime = flightItem.GetProperty("departure_time").GetString();
                    string arrivalTime = flightItem.GetProperty("arrival_time").GetString();
                    decimal price = flightItem.GetProperty("price").GetDecimal();

                    var segments = flightItem.GetProperty("flights").EnumerateArray()
                        .Select(segment =>
                        {
                            string airline = segment.GetProperty("airline").GetString();
                            string flightNumber = segment.GetProperty("flight_number").GetString();
                            string departureAirportCode = segment.GetProperty("departure_airport").GetProperty("airport_code").GetString();
                            string arrivalAirportCode = segment.GetProperty("arrival_airport").GetProperty("airport_code").GetString();

                            return new
                            {
                                Airline = airline,
                                FlightNumber = flightNumber,
                                DepartureAirportCode = departureAirportCode,
                                ArrivalAirportCode = arrivalAirportCode
                            };
                        }).ToList();

                    return new
                    {
                        DepartureTime = departureTime,
                        ArrivalTime = arrivalTime,
                        Price = price,
                        Segments = segments
                    };
                }).ToList();

            return flights;
        }
    }
}
