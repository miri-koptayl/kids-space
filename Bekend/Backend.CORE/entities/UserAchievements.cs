using Backend.CORE.entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace Backend.CORE.Entities
{
    public class UserAchievement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int AchievementId { get; set; }

        public int? ActivityId { get; set; }

        public string? Notes { get; set; }

        [Required]
        public DateTime EarnedDate { get; set; }

        // ניווטים (Navigation Properties)
        public virtual Users? User { get; set; }
        public virtual Achievements? Achievement { get; set; }
        public virtual Activities? Activities { get; set; }
    }
}
