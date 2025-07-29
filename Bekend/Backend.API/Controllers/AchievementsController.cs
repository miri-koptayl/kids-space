using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Iservices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementsController : ControllerBase
    {
        private readonly IAchievementsService _achievementsService;

        public AchievementsController(IAchievementsService achievementsService)
        {
            _achievementsService = achievementsService;
        }

        [HttpGet]
        public ActionResult<List<Achievements>> Get()
        {
            var achievements = _achievementsService.GetAll();
            if (achievements == null || achievements.Count == 0)
                return NotFound("No achievements found.");
            return Ok(achievements);
        }

        [HttpGet("{id}")]
        public ActionResult<Achievements> GetById(int id)
        {
            var achievement = _achievementsService.GetById(id);
            if (achievement == null)
                return NotFound($"Achievement with ID {id} not found.");
            return Ok(achievement);
        }

        [HttpPost("register")]
        public ActionResult<Achievements> Post([FromBody] AchievementDTO dto)
        {
            if (dto == null)
                return BadRequest("Achievement data cannot be null.");

            try
            {
                var created = _achievementsService.CreateAchievement(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<Achievements> Put(int id, [FromBody] AchievementDTO dto)
        {
            if (dto == null)
                return BadRequest("Achievement data cannot be null.");

            var updated = _achievementsService.UpdateAchievement(id, dto);
            if (updated == null)
                return NotFound($"Achievement with ID {id} not found.");

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public ActionResult<Achievements> Delete(int id)
        {
            var deleted = _achievementsService.DeleteAchievement(id);
            if (deleted == null)
                return NotFound($"Achievement with ID {id} not found.");

            return Ok(deleted);
        }
    }
}
