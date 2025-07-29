using Backend.CORE.entities;
using System.Collections.Generic;
using System.Linq;
using Backend.CORE.IRepositories;

namespace Backend.DATA.Repository
{
    public class ActivitiesRepository : IActivitiesRepository
    {
        private readonly DataContext _context;

        public ActivitiesRepository(DataContext context)
        {
            _context = context;
        }

        public List<Activities> GetActivities()
        {
            return _context.Activities.ToList();
        }

        public Activities? RegisterActivities(AgeGroup ageGroup, int pointsValue, string contentUrl, string type, string description, string title)
        {
            var activity = new Activities
            {
                Agegroup = ageGroup,
                PointsValue = pointsValue,
                ContentUrl = contentUrl,
                Type = type,
                Description = description,
                Title = title,
                IsApproved = false
            };

            _context.Activities.Add(activity);
            _context.SaveChanges();
            return activity;
        }

        public Activities? UpdateActivities(int id, AgeGroup ageGroup, int pointsValue, string contentUrl, string type, string description, string title, bool isApproved)
        {
            var existing = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (existing == null)
                return null;

            existing.Agegroup = ageGroup;
            existing.PointsValue = pointsValue;
            existing.ContentUrl = contentUrl;
            existing.Type = type;
            existing.Description = description;
            existing.Title = title;
            existing.IsApproved = isApproved;

            _context.SaveChanges();
            return existing;
        }

        public Activities? RemoveActivities(int id)
        {
            var activity = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null)
                return null;

            _context.Activities.Remove(activity);
            _context.SaveChanges();
            return activity;
        }

     

        public List<Activities> GetActivitiesByUserAge(int userAge)
        {
            var group = GetAgeGroupForUser(userAge);

            return _context.Activities
                .Where(a => a.Agegroup == group && a.IsApproved)
                .ToList();
        }

        private AgeGroup GetAgeGroupForUser(int age)
        {
            if (age <= 7 && age>2)
                return AgeGroup.BOY;
            else if (age <= 12 && age>7)
                return AgeGroup.YOUNG;
            else
                return AgeGroup.BIG;
        }

    }
}
