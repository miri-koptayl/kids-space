using Backend.CORE.entities;
using System.Collections.Generic;

namespace Backend.CORE.Iservices
{
    public interface IActivitiesService
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
