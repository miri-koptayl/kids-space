using Backend.CORE.entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.CORE.DTO
{


    public class AchievementDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int RequiredPoints { get; set; }
        public AgeGroup Agegroup { get; set; }
    }
}
