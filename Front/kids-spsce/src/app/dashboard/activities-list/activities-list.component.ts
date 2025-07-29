import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../core/services/activity-service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css'],
  standalone: false,
})
export class ActivitiesListComponent implements OnInit {
  activities: any[] = [];
  errorMessage: string = '';
  selectedActivity: any = null;

  constructor(private activitiesService: ActivityService) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.errorMessage = 'משתמש לא מחובר. אנא התחבר שוב.';
      return;
    }

    const user = JSON.parse(userString);
    const age = user.age;

    if (!age) {
      this.errorMessage = 'אין נתון גיל למשתמש. לא ניתן להציג פעילויות.';
      return;
    }

    console.log('גיל המשתמש:', age);

    this.activitiesService.getActivitiesByUserAge(age).subscribe({
      next: (data: any) => {
        if (data.success && data.activities && data.activities.length > 0) {
          this.activities = data.activities;
          this.errorMessage = '';
        } else {
          this.activities = [];
          this.errorMessage = 'לא נמצאו פעילויות מתאימות לגיל שלך.';
        }
        console.log('פעילויות שהתקבלו:', this.activities);
      },
      error: (err) => {
        console.error('שגיאה בטעינת הפעילויות:', err);
        this.errorMessage = 'שגיאה בעת טעינת הפעילויות.';
      }
    });
  }

  selectActivity(activity: any): void {
    this.selectedActivity = activity;
  }

  clearSelection(): void {
    this.selectedActivity = null;
  }
}
