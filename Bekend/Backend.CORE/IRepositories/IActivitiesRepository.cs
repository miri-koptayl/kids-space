using System;
using System.Collections.Generic;
using Backend.CORE.entities;

namespace Backend.CORE.IRepositories
{
    public interface IActivitiesRepository
    {
        List<Activities> GetActivities();
        Activities? RemoveActivities(int id);

        Activities? RegisterActivities(
            AgeGroup ageGroup,
            int pointsValue,
            string contentUrl,
            string type,
            string description,
            string title
        );

        Activities? UpdateActivities(
            int id,
            AgeGroup ageGroup,
            int pointsValue,
            string contentUrl,
            string type,
            string description,
            string title,
            bool isApproved
        );
        List<Activities> GetActivitiesByUserAge(int userAge);

    }
}
