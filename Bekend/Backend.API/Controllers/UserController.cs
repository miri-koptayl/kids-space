using Backend.CORE.DTO;
using Backend.CORE.entities;
using Backend.CORE.Interfaces;
using Backend.CORE.Iservices;
using Backend.SERVER.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;

namespace Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtTokenGenerator _jwtService;

        public UserController(IUserService userService, IJwtTokenGenerator jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpGet]
        //[Authorize]
        public ActionResult<List<Users>> Get()
        {
            var users = _userService.GetUsers();
            if (users == null)
                return NotFound("No users found.");
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<Users> Get(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
                return NotFound($"User with ID {id} not found.");
            return Ok(user);
        }

        [HttpPost("register")]
        public ActionResult Post([FromBody] UserUpdateDTO userDto)
        {
            if (userDto == null)
                return BadRequest("User data cannot be null.");

            var existingUser = _userService.GetByUsername(userDto.Username);
            if (existingUser != null)
            {
                return Ok(new { success = false, message = "שם המשתמש כבר קיים במערכת." });
            }

            var newUser = _userService.RegisterUser(
                userDto.Username,
                userDto.Email,
                userDto.Password,
                userDto.Age,
                userDto.ProfilePictureUrl ?? "", 
                userDto.TotalPoints,
                userDto.Agegroup
            );

            var token = _jwtService.GenerateToken(newUser);

            return Ok(new
            {
                success = true,
                token,
                user = new
                {
                    newUser.Id,          
                    newUser.Username,    
                    newUser.Email,        
                    newUser.Age,          
                    newUser.Role,         
                    newUser.ProfilePictureUrl, 
                    newUser.TotalPoints,
                    newUser.Agegroup,

                }
            });
        }

        [HttpPost("upload-profile-picture")]
        public ActionResult UploadProfilePicture(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile-pictures");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            var relativePath = $"/profile-pictures/{fileName}";
            return Ok(new { url = relativePath });
        }

        [HttpPut("{id}")]

        public ActionResult<UsersDTO> Put(int id, [FromBody] UserUpdateDTO user)
        {
            if (user == null)
                return BadRequest("User data cannot be null.");

            var updatedUser = _userService.UpdateUser(
                id,
                user.Username,
                user.Email,
                user.Password,
                user.Age,
                user.Role,
                user.ProfilePictureUrl,
                user.TotalPoints,
                user.Level
            );

            if (updatedUser == null)
                return NotFound($"User with ID {id} not found.");

            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult<Users> Delete(int id)
        {
            var deletedUser = _userService.RemoveUser(id);
            if (deletedUser == null)
                return NotFound($"User with ID {id} not found.");
            return Ok(deletedUser);
        }
        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginDTO loginDto)
        {

            try
            {
                var user = _userService.Login(loginDto.Username, loginDto.Password);

                if (user == null)
                {
                    return Unauthorized(new { success = false, message = "שם משתמש או סיסמה שגויים." });
                }
                Console.WriteLine($"User {user} logged in successfully.");
                var token = _jwtService.GenerateToken(user);

                return Ok(new
                {
                    success = true,
                    token,
                    user = new
                    {
                        user.Id,
                        user.Username,
                        user.Role,
                        user.Email,
                        user.Age,
                        user.Password,
                        user.TotalPoints,
                        user.ProfilePictureUrl
                    }
                });
            }
            catch (Exception ex)
            {
                // החזרת פרטי השגיאה – לא מומלץ בפרודקשן, אבל כן לפיתוח
                return StatusCode(500, new
                {
                    success = false,
                    message = "אירעה שגיאה במהלך תהליך ההתחברות.",
                    error = ex.Message,
                    stackTrace = ex.StackTrace // להסרה בפרודקשן
                });
            }
        }

    }

    public class UsersDTO
    {
        // מימוש אפשרי בהתאם לצורך, או למחוק אם אינו בשימוש
    }
}
