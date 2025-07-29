using System;
using System.Collections.Generic;
using Backend.CORE.Iservices;
using Backend.CORE.IRepositories;
using Backend.CORE.entities;

namespace Backend.SERVER
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<Users> GetUsers()
        {
            return (List<Users>)_userRepository.GetAll();
        }
        public Users GetByUsername(string username)
        {
            return _userRepository.GetByUsername(username);
        }

        public Users? GetById(int id)
        {
            return (Users?)_userRepository.GetById(id);
        }
        public Users Login(string username, string password)
        {
            var user = _userRepository.GetByUsername(username);
            if (user == null || user.Password != password)
                return null;

            return user;
        }


        public Users RegisterUser(string username, string email, string password, int age, string ProfilePictureUrl, int totalpoint, AgeGroup Agegroup)
        {
            var existingUser = _userRepository.GetByUsername(username);
            if (existingUser != null)
                throw new InvalidOperationException("שם המשתמש כבר קיים במערכת.");

            var user = new Users
            {
                Username = username,
                Email = email,
                Password = password,
                Age = age,
                ProfilePictureUrl = ProfilePictureUrl,
                TotalPoints = totalpoint,
                Role = "User",
                Level = 0,
                CraetedTime = DateTime.UtcNow,
                Agegroup = age > 2 && age <= 7 ? AgeGroup.BOY :
       age <= 12 ? AgeGroup.YOUNG :
       AgeGroup.BIG
            };

            return _userRepository.Add(user);
        }

        public Users? UpdateUser(int id, string username, string email, string password, int age, string role, string ProfilePictureUrl, int TotalPoints, int level)
        {
            var existingUser = _userRepository.GetById(id);
            if (existingUser == null) return null;

            existingUser.Username = username;
            existingUser.Email = email;
            existingUser.Password = password;
            existingUser.Age = age;
            existingUser.Role = role;
            existingUser.ProfilePictureUrl = ProfilePictureUrl;
            existingUser.TotalPoints = TotalPoints;
            existingUser.Level = level;
            return _userRepository.Update(existingUser);
        }

        public Users? RemoveUser(int id)
        {
            return _userRepository.Delete(id);
        }
    }
}
