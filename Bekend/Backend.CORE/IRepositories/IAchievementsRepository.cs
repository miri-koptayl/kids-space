using Backend.CORE.DTO;
using Backend.CORE.entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Backend.CORE.IRepositories
{
    public interface IAchievementsRepository
    {
        List<Achievements> GetAll();
        Achievements GetById(int id);
        Achievements? UpdateAchievement(int id, AchievementDTO dto);
        Achievements? DeleteAchievement(int id);
        Achievements? CreateAchievement(AchievementDTO dto);
    }
}
