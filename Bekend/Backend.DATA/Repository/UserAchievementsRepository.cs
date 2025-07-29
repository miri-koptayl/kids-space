using Backend.CORE.entities;
using Backend.CORE.Entities;
using Backend.CORE.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.DATA.Repository
{
    public class UserAchievementsRepository : IUserAchievementsRepository
    {
        private readonly DataContext _context;

        public UserAchievementsRepository(DataContext context)
        {
            _context = context;
        }

        public List<UserAchievement> GetAllUserAchievement()
        {
            return _context.UserAchievements
                .Include(ua => ua.User)
                .Include(ua => ua.Achievement)
                .ToList();
        }

        public UserAchievement? CreateUserAchievement(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate)
        {
            var userAchievement = new UserAchievement
            {
                UserId = userId,
                AchievementId = achievementId,
                Notes = notes,
                EarnedDate = earnedDate
            };

            _context.UserAchievements.Add(userAchievement);
            _context.SaveChanges();
            return userAchievement;
        }

        public UserAchievement? UpdateAchievementsUser(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate)
        {
            var existing = _context.UserAchievements.FirstOrDefault(ua =>
                ua.UserId == userId && ua.AchievementId == achievementId );

            if (existing == null)
                return null;

            existing.Notes = notes;
            existing.EarnedDate = earnedDate;
            _context.SaveChanges();
            return existing;
        }

        public UserAchievement? RemoveUserAchievement(int id)
        {
            var userAchievement = _context.UserAchievements.FirstOrDefault(ua => ua.Id == id);
            if (userAchievement == null)
                return null;

            _context.UserAchievements.Remove(userAchievement);
            _context.SaveChanges();
            return userAchievement;
        }

        public List<Achievements> GetAchievementsByUserId(int userId)
        {
            return _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Include(ua => ua.Achievement)
                .Select(ua => ua.Achievement)
                .ToList();
        }
    }
}
