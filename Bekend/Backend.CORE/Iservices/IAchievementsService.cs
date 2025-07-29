using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.CORE.DTO; // ← הוספת using
using Backend.CORE.entities;

namespace Backend.CORE.Iservices
{
    public interface IAchievementsService
    {
        List<Achievements> GetAll();
        Achievements GetById(int id);
        Achievements? UpdateAchievement(int id, AchievementDTO dto);
        Achievements? DeleteAchievement(int id);
        Achievements? CreateAchievement(AchievementDTO dto);         
    }
}
