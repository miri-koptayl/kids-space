using Backend.CORE.entities;
using Backend.CORE.IRepositories;
using Backend.CORE.Iservices;
using System;
using System.Collections.Generic;

namespace Backend.SERVER
{
    public class ActivitiesService : IActivitiesService
    {
        private readonly IActivitiesRepository _ActivitiesRepository;

        public ActivitiesService(IActivitiesRepository activitiesRepository)
        {
            _ActivitiesRepository = activitiesRepository;
        }

        public List<Activities> GetActivities()
        {
            return _ActivitiesRepository.GetActivities();
        }

        public Activities? RegisterActivities(AgeGroup Agegroup, int PointsValue, string ContentUrl, string Type, string Description, string Title)
        {
            return _ActivitiesRepository.RegisterActivities(
                Agegroup,
                PointsValue,
                ContentUrl,
                Type,
                Description,
                Title);
        }

        public Activities? RemoveActivities(int id)
        {
            return _ActivitiesRepository.RemoveActivities(id);
        }

        public Activities? UpdateActivities(int id, AgeGroup Agegroup, int PointsValue, string ContentUrl, string Type, string Description, string Title, bool IsApproved)
        {
            return _ActivitiesRepository.UpdateActivities(
                id,
                Agegroup,
                PointsValue,
                ContentUrl,
                Type,
                Description,
                Title,
                IsApproved);
        }

        public List<Activities> GetActivitiesByUserAge(int userAge)
        {
            return _ActivitiesRepository.GetActivitiesByUserAge(userAge);
        }
    }
}
