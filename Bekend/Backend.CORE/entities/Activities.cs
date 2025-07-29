using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.CORE.entities
{
  
    public class Activities
    {
        public Activities() { }
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public string? ContentUrl { get; set; }
        public int PointsValue { get; set; }
        //public int AgeGroupId { get; set; }
        public  AgeGroup Agegroup { get; set; }
        public bool IsApproved { get; set; } = false;
        public int? ApprovedBy { get; set; }
    }
}
