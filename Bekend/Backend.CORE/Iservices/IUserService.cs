using Backend.CORE.entities;
using System.Collections.Generic;

namespace Backend.CORE.Iservices
{
    public interface IUserService
    {
        List<Users> GetUsers();
        Users? GetByUsername(string username); 

        Users? GetById(int id);
        Users Login(string username, string password);

        Users? RemoveUser(int id);

        Users? RegisterUser(string username, string email, string password, int age, string ProfilePictureUrl, int TotalPoints, AgeGroup Agegroup);


        Users? UpdateUser(int id, string username, string email, string password, int age, string role,string ProfilePictureUrl,int TotalPoints,int level);

    }
}
