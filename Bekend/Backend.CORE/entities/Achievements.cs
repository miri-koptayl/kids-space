namespace Backend.CORE.entities
{
    public class Achievements
    {
       
        public int Id { get; set; }
        public string ?Name { get; set; }
        public string? Description { get; set; }
        public int RequiredPoints { get; set; }
        public AgeGroup Agegroup { get; set; }  
    }
}