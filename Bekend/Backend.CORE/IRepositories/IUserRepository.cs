// Backend.CORE.IRepositories.IUserRepository.cs
using Backend.CORE.entities;
using System.Collections.Generic;

namespace Backend.CORE.IRepositories
{
    public interface IUserRepository
    {
        IEnumerable<Users> GetAll();
        Users GetByUsername(string username);

        Users? GetById(int id);
        Users Add(Users user);
        Users? Update(Users user);
        Users? Delete(int id);
    }
}
