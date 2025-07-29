using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Entities;
using Backend.CORE.Iservices;
using Backend.SERVER;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAchievementsController : ControllerBase
    {
        private readonly IUserAchievementsService _userAchievementsService;
        // ✅ הוספתי: 2 dependencies חדשים
        private readonly IUserService _userService;
        private readonly IAchievementsService _achievementService;

        // ✅ הוספתי: פרמטרים חדשים בקונסטרקטור
        public UserAchievementsController(
            IUserAchievementsService userAchievementsService,
            IUserService userService,
            IAchievementsService achievementService)
        {
            _userAchievementsService = userAchievementsService;
            _userService = userService;
            _achievementService = achievementService;
        }

        [HttpGet]
        public ActionResult<List<UserAchievement>> Get()
        {
            var userAchievement = _userAchievementsService.GetAllUserAchievement();
            if (userAchievement == null)
                return NotFound("No userAchievement found.");
            return Ok(userAchievement);
        }

        [HttpPost("register")]
        public ActionResult<UserAchievementsDTO> Post([FromBody] UserAchievementsDTO userAchievements)
        {
            if (userAchievements == null)
                return BadRequest("userAchievements data cannot be null.");
            try
            {
                var createdUserAchievement = _userAchievementsService.CreateUserAchievement(
                    userAchievements.UserId,
                    userAchievements.AchievementId,
                    userAchievements.Notes,
                    userAchievements.EarnedDate
                );
                return CreatedAtAction(nameof(Get), new { id = createdUserAchievement.Id }, createdUserAchievement);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<UserAchievementsDTO> Put(int id, [FromBody] UserAchievementsDTO UserAchievements)
        {
            if (UserAchievements == null)
                return BadRequest("UserAchievements data cannot be null.");
            var updatedUserAchievements = _userAchievementsService.UpdateAchievementsUser(
                UserAchievements.UserId,
                UserAchievements.AchievementId,
                UserAchievements.Notes,
                UserAchievements.EarnedDate
            );
            if (updatedUserAchievements == null)
                return NotFound($"UserAchievements with ID {id} not found.");
            return Ok(updatedUserAchievements);
        }

        [HttpGet("by-user/{userId}")]
        public ActionResult<object> GetAchievementsByUserId(int userId)
        {
          
            var achievements = _userAchievementsService.GetAchievementsByUserId(userId);

            if (achievements == null || achievements.Count == 0)
            {
                return Ok(new
                {
                    message = $"No achievements found for user with ID {userId}.",
                    achievements = new List<Achievements>() // רשימה ריקה
                });
            }
            return Ok(new
            {
                message = "Achievements retrieved successfully.",
                achievements = achievements
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<UserAchievement> Delete(int id)
        {
            var deletedUserAchievement = _userAchievementsService.RemoveUserAchievement(id);
            if (deletedUserAchievement == null)
                return NotFound($"UserAchievement with ID {id} not found.");
            return Ok(deletedUserAchievement);
        }

        // ✅ הוספתי: מתודה לקבלת ההישג הבא (נקראת בהתחברות)
        // ✅ מתודה פרטית למניעת כפילות קוד
        private Achievements GetNextAchievementForUser(int userId, int currentPoints)
        {
            var user = _userService.GetById(userId);
            if (user == null) return null;

            var userAchievementIds = _userAchievementsService.GetAchievementsByUserId(userId)
                .Select(a => a.Id).ToList();

            return _achievementService.GetAll()
                .Where(a =>
                    a.Agegroup == user.Agegroup &&
                    a.RequiredPoints > currentPoints &&
                    !userAchievementIds.Contains(a.Id))
                .OrderBy(a => a.RequiredPoints)
                .FirstOrDefault();
        }

        [HttpGet("next-achievement/{userId}")]
        public ActionResult<object> GetNextAchievement(int userId)
        {
            var user = _userService.GetById(userId);
            if (user == null)
                return NotFound("User not found");

            var nextAchievement = GetNextAchievementForUser(userId, user.TotalPoints);

            return Ok(new
            {
                userId = userId,
                currentPoints = user.TotalPoints,
                nextAchievement = nextAchievement,
                pointsToNext = nextAchievement?.RequiredPoints - user.TotalPoints ?? 0
            });
        }

        // ✅ מתודה לזכיה בהישג + קבלת ההישג הבא
        [HttpPost("earn-achievement")]
        public ActionResult EarnAchievement([FromBody] EarnAchievementDTO earnDto)
        {
            try
            {
                var user = _userService.GetById(earnDto.UserId);
                if (user == null)
                    return NotFound("User not found");

                _userAchievementsService.CreateUserAchievement(
                    earnDto.UserId,
                    earnDto.AchievementId,
                    $"זכה בהישג בתאריך {earnDto.EarnedDate.ToShortDateString()}", // ניתן לשנות את ה-Notes בהתאם
                    earnDto.EarnedDate 
                );

                var updatedUser = _userService.GetById(earnDto.UserId);
                if (updatedUser == null)
                {
                    return BadRequest("Could not retrieve updated user data after earning achievement.");
                }

                var nextAchievement = GetNextAchievementForUser(earnDto.UserId, updatedUser.TotalPoints);

                return Ok(new
                {
                    message = "Achievement earned successfully!",
                    nextAchievement = nextAchievement,
                    pointsToNext = nextAchievement?.RequiredPoints - updatedUser.TotalPoints ?? 0 // השתמש בנקודות המעודכנות
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    // ✅ הוספתי: DTO חדש לזכיה בהישג
    public class EarnAchievementDTO
    {
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public DateTime EarnedDate { get; set; } // שינוי: במקום NewTotalPoints
    }
}