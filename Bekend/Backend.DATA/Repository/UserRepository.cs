using Backend.CORE.entities;
using Backend.CORE.IRepositories;
using System.Collections.Generic;
using System.Linq;

namespace Backend.DATA.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public IEnumerable<Users> GetAll()
        {
            return _context.Users.ToList();
        }
        public Users GetByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public Users? GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public Users Add(Users user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public Users? Update(Users user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser == null)
                return null;

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.Age = user.Age;
            existingUser.CraetedTime = user.CraetedTime;
            existingUser.ProfilePictureUrl=user.ProfilePictureUrl;
            existingUser.TotalPoints=user.TotalPoints;
            existingUser.Level = user.Level;
            _context.SaveChanges();
            return existingUser;
        }

        public Users? Delete(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return null;

            _context.Users.Remove(user);
            _context.SaveChanges();
            return user;
        }
    }
}
