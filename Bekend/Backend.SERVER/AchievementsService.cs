using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.IRepositories;
using Backend.CORE.Iservices;
using System.Collections.Generic;

namespace Backend.SERVER
{
    public class AchievementsService : IAchievementsService
    {
        private readonly IAchievementsRepository _AchievementsRepository;

        public AchievementsService(IAchievementsRepository achievementsRepository)
        {
            _AchievementsRepository = achievementsRepository;
        }

        public List<Achievements> GetAll()
        {
            return _AchievementsRepository.GetAll();
        }

        public Achievements? GetById(int id)
        {
            return _AchievementsRepository.GetById(id);
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

            return _AchievementsRepository.CreateAchievement(dto);
        }

        public Achievements? DeleteAchievement(int id)
        {
            return _AchievementsRepository.DeleteAchievement(id);
        }

        public Achievements? UpdateAchievement(int id, AchievementDTO dto)
        {
            return _AchievementsRepository.UpdateAchievement(id, dto);
        }
    }
}
