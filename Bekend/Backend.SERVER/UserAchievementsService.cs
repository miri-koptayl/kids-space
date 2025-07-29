using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Entities;
using Backend.CORE.IRepositories;
using Backend.CORE.Iservices;
using System;
using System.Collections.Generic;

namespace Backend.SERVER
{
    public class UserAchievementsService : IUserAchievementsService
    {
        private readonly IUserAchievementsRepository _userAchievementsRepository;

        public UserAchievementsService(IUserAchievementsRepository userAchievementsRepository)
        {
            _userAchievementsRepository = userAchievementsRepository;
        }

        public List<UserAchievement> GetAllUserAchievement()
        {
            return _userAchievementsRepository.GetAllUserAchievement();
        }

        public UserAchievement? CreateUserAchievement(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate)
        {
            return _userAchievementsRepository.CreateUserAchievement(
                userId, achievementId,  notes, earnedDate);
        }

        public UserAchievement? UpdateAchievementsUser(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate)
        {
            return _userAchievementsRepository.UpdateAchievementsUser(
                userId, achievementId, notes, earnedDate);
        }

        public UserAchievement? RemoveUserAchievement(int id)
        {
            return _userAchievementsRepository.RemoveUserAchievement(id);
        }

        public List<Achievements> GetAchievementsByUserId(int userId)
        {
            return _userAchievementsRepository.GetAchievementsByUserId(userId);
        }
    }
}
