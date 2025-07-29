using Backend.CORE.entities;

namespace Backend.CORE.DTO
{
    public class ActivitiesDTO
    {
      
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string ContentUrl { get; set; } = string.Empty;
        public int PointsValue { get; set; }
        //public int AgeGroupId { get; set; }
        public AgeGroup Agegroup { get; set; } 
        public class ActivitiesUpdateDTO : ActivitiesDTO
        {
            public bool IsApproved { get; set; }
        }
    }
}
