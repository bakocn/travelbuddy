namespace TravelBuddy.Api.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string Destination { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
