using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Iservices;
using Backend.SERVER;
using Microsoft.AspNetCore.Mvc;
using static Backend.CORE.DTO.ActivitiesDTO;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivitiesService _ActivitiesService;

        public ActivitiesController(IActivitiesService activitiesService)
        {
            _ActivitiesService = activitiesService;
        }

        // קבלת כל הפעילויות
        [HttpGet]
        public ActionResult<List<Activities>> Get()
        {
            var activities = _ActivitiesService.GetActivities();

            if (activities == null || activities.Count == 0)
                return Ok(new { message = "אין פעילויות במערכת.", activities = new List<Activities>() });

            return Ok(new { message = "נמצאו פעילויות", activities });
        }
        [HttpGet("by-age")]
        public IActionResult GetActivitiesByUserAge([FromQuery] int age)
        {
            var activities = _ActivitiesService.GetActivitiesByUserAge(age);


            if (activities == null || activities.Count == 0)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "לא נמצאו פעילויות מתאימות לגיל שצוין"
                });
            }

            return Ok(new
            {
                Success = true,
                Activities = activities
            });
        }

        // יצירת פעילות חדשה
        [HttpPost("register")]
        public ActionResult<ActivitiesDTO> Post([FromBody] ActivitiesDTO activities)
        {
            if (activities == null)
                return BadRequest("Activity data cannot be null.");

            try
            {
                var createdActivities = _ActivitiesService.RegisterActivities(
                    activities.Agegroup,
                    activities.PointsValue,
                    activities.ContentUrl,
                    activities.Type,
                    activities.Description,
                    activities.Title
                );

                return CreatedAtAction(nameof(Get), new { id = createdActivities.Id }, createdActivities);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // עדכון פעילות
        [HttpPut("{id}")]
        public ActionResult<ActivitiesDTO> Put(int id, [FromBody] ActivitiesUpdateDTO activities)
        {
            if (activities == null)
                return BadRequest("Activity data cannot be null.");

            var updatedActivities = _ActivitiesService.UpdateActivities(
                id,
                activities.Agegroup,
                activities.PointsValue,
                activities.ContentUrl,
                activities.Type,
                activities.Description,
                activities.Title,
                activities.IsApproved
            );

            if (updatedActivities == null)
                return NotFound($"Activity with ID {id} not found.");

            return Ok(updatedActivities);
        }

        // מחיקת פעילות
        [HttpDelete("{id}")]
        public ActionResult<Activities> Delete(int id)
        {
            var deletedActivities = _ActivitiesService.RemoveActivities(id);

            if (deletedActivities == null)
                return NotFound($"Activity with ID {id} not found.");

            return Ok(deletedActivities);
        }
    }
}
