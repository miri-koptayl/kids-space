using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Entities;
using System;
using System.Collections.Generic;

namespace Backend.CORE.Iservices
{
    public interface IUserAchievementsService
    {
        List<UserAchievement> GetAllUserAchievement();

        UserAchievement? CreateUserAchievement(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate);

        UserAchievement? UpdateAchievementsUser(
            int userId,
            int achievementId,
            string? notes,
            DateTime earnedDate);

        UserAchievement? RemoveUserAchievement(int id);

        List<Achievements> GetAchievementsByUserId(int userId);
    }
}
