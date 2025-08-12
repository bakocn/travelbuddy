namespace TravelBuddy.Api.Dtos
{
    public class CreateTripDto
    {
        public string Destination { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int UserId { get; set; }
    }
}
