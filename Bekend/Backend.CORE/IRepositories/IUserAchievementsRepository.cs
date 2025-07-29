using Backend.CORE.entities;
using Backend.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.CORE.IRepositories
{
    public interface IUserAchievementsRepository
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
