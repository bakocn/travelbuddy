using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelBuddy.Api.Data;
using TravelBuddy.Api.Models;
using TravelBuddy.Api.Dtos;
using System.Security.Claims; 

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

     
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips.Include(t => t.User).ToListAsync();
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips.Include(t => t.User)
                                           .FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null) return NotFound();
            return trip;
        }

     
         [HttpPost]
    public async Task<ActionResult<Trip>> PostTrip(CreateTripDto dto)
    {
      
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
            UserId = currentUserId
        };

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
    }

   
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
