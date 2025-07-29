using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.CORE.DTO
{
    public class UserAchievementsDTO
    {
        public int UserId { get; set; } 
        public int AchievementId { get; set; } 

        public int? ActivityId { get; set; } 

        public string? Notes { get; set; } 


        public DateTime EarnedDate { get; set; } 
    }
}
