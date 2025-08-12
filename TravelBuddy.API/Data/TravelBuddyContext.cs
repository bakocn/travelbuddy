using Microsoft.EntityFrameworkCore;
using TravelBuddy.Api.Models;

namespace TravelBuddy.Api.Data
{
    public class TravelBuddyContext : DbContext
    {
        public TravelBuddyContext(DbContextOptions<TravelBuddyContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }
    }
}
