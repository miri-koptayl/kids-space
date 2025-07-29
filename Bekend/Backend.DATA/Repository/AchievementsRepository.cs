using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.IRepositories;
using Backend.DATA;
using System.Collections.Generic;
using System.Linq;

namespace Backend.DATA.Repository
{
    public class AchievementsRepository : IAchievementsRepository
    {
        private readonly DataContext _context;

        public AchievementsRepository(DataContext context)
        {
            _context = context;
        }

        public List<Achievements> GetAll()
        {
            return _context.Achievements.ToList();
        }

        public Achievements? GetById(int id)
        {
            return _context.Achievements.FirstOrDefault(a => a.Id == id);
        }

        public Achievements? UpdateAchievement(int id, AchievementDTO dto)
        {
            var existing = _context.Achievements.FirstOrDefault(a => a.Id == id);
            if (existing == null)
                return null;

            existing.Agegroup = dto.Agegroup;  // שימוש ישיר ב- AgeGroup
            existing.RequiredPoints = dto.RequiredPoints;
            existing.Description = dto.Description;
            existing.Name = dto.Name;

            _context.SaveChanges();
            return existing;
        }

        public Achievements? DeleteAchievement(int id)
        {
            var achievement = _context.Achievements.FirstOrDefault(a => a.Id == id);
            if (achievement == null)
                return null;

            _context.Achievements.Remove(achievement);
            _context.SaveChanges();
            return achievement;
        }

        public Achievements? CreateAchievement(AchievementDTO dto)
        {
            var achievement = new Achievements
            {
                Agegroup = dto.Agegroup,  
                RequiredPoints = dto.RequiredPoints,
                Description = dto.Description,
                Name = dto.Name,
            };

            _context.Achievements.Add(achievement);
            _context.SaveChanges();
            return achievement;
        }
    }
}
