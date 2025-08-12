using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelBuddy.Api.Data;
using TravelBuddy.Api.Models;
using TravelBuddy.Api.Dtos;
using System.Security.Claims; // <- dodaj ovo

namespace TravelBuddy.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly TravelBuddyContext _context;

        public TripsController(TravelBuddyContext context)
        {
            _context = context;
        }

        // GET: api/trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips.Include(t => t.User).ToListAsync();
        }

        // GET: api/trips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips.Include(t => t.User)
                                           .FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null) return NotFound();
            return trip;
        }

        // POST: api/trips
         [HttpPost]
    public async Task<ActionResult<Trip>> PostTrip(CreateTripDto dto)
    {
        // uzimamo userId iz JWT tokena (claims)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var currentUserId))
        {
            return Unauthorized();
        }

        var trip = new Trip
        {
            Destination = dto.Destination,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Price = dto.Price,
            UserId = currentUserId // koristimo ID iz tokena
        };

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
    }

        // PUT: api/trips/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrip(int id, CreateTripDto dto)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();

            trip.Destination = dto.Destination;
            trip.StartDate = dto.StartDate;
            trip.EndDate = dto.EndDate;
            trip.Price = dto.Price;
            trip.UserId = dto.UserId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/trips/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
