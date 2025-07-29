using Backend.CORE.entities;
using System;

namespace Backend.CORE.DTO
{
    public class UserCreateDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int TotalPoints { get; set; }
        public AgeGroup Agegroup { get; set; }


    }
    public class UserUpdateDTO : UserCreateDTO
    {
        public string ?Role { get; set; }
        public int Level { get; set; }
    }

}
