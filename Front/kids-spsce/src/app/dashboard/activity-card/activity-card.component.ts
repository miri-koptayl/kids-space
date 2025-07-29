import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { AchievementService } from '../../core/services/Achievements.service';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.css'],
  standalone: false,
})
export class ActivityCardComponent implements OnInit {
  @Input() activity: any;
  @Output() back = new EventEmitter<void>();

  storyText: string = '';
  nextUserAchievements: any;
  user : any = JSON.parse(localStorage.getItem('user') || '{}'); // קבלת המשתמש מה-localStorage
  constructor(private http: HttpClient, private authService: AuthService,private achievementService:AchievementService) {}

  ngOnInit(): void {
    if (this.activity?.type === 'story' && this.activity?.contentUrl) {
      this.loadStoryContent(this.activity.contentUrl);

      this.achievementService.GetNextAchievementForUser(this.user.id).subscribe({
        next: (res) => {
          this.nextUserAchievements = res.nextAchievement || null;
          // console.log('ההישג הבא:', this.nextUserAchievements);
        },
        error: (err) => {
          console.error('שגיאה בשליפת ההישג הבא', err);
          this.nextUserAchievements = null;
        }
      });
    }
  }

  loadStoryContent(url: string): void {
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (data) => (this.storyText = data),
      error: (err) => {
        console.error('שגיאה בטעינת הסיפור:', err);
        this.storyText = 'אירעה שגיאה בטעינת הסיפור.';
      },
    });
  }

  onBack(): void {
    this.back.emit();
  }

  addPoint() {
  
    // console.log("השיג הבא דרך....", this.nextUserAchievements);
    const userString = localStorage.getItem('user');

    if (userString) {
      const user = JSON.parse(userString);
      const newTotalPoints = (user.totalPoints || 0) +  (this.activity.pointsValue || 0);
      let newLevel = user.level || 0;
      console.log("נקודות ישנות:", user.totalPoints, "רמה ישנה:", user.level,"נקודות להישג הבא :", this.nextUserAchievements.requiredPoints);
      if (newLevel == 0 && this.nextUserAchievements.requiredPoints == newTotalPoints) {
        this.achievementService.EarnAchievement({
          UserId: this.user.id,
          AchievementId: this.nextUserAchievements.id
        }).subscribe({
          next: (res) => {
            console.log('ההישג נרשם בהצלחה:', res);
          },
          error: (err) => {
            console.error('שגיאה בשמירת  ההישג ', err);
          }
        });
      }
      else
        if (newTotalPoints == this.nextUserAchievements.requiredPoints *newLevel) {
          this.achievementService.EarnAchievement({
            UserId: this.user.id,
            AchievementId: this.nextUserAchievements.id
          }).subscribe({
            next: (res) => {
              console.log('ההישג נרשם בהצלחה:', res);
            },
            error: (err) => {
              console.error('שגיאה בשמירת  ההישג ', err);
            }
          });
        }
      if (newTotalPoints > 100) {
        newLevel += 1;
      }
    

      console.log("נקודות חדשות:", newTotalPoints, "רמה חדשה:", newLevel);
      const updatedUserData = { ...user, totalPoints: newTotalPoints, level: newLevel };
      this.authService.updateUser(user.id, updatedUserData).subscribe({
        next: (responseFromServer) => {
          console.log('הנקודות עודכנו בהצלחה בשרת:', responseFromServer);
          localStorage.setItem('user', JSON.stringify(responseFromServer));
          if (newTotalPoints == 100 && newLevel >= 0) {
            console.log("עלה רמה")
            Swal.fire({
              title: 'כל הכבוד!',
              html: `עלית לרמה <strong>${user.level + 1}</strong>! 🎉<br>אתה הופך למומחה אמיתי!`,
              icon: 'success',
              confirmButtonText: 'ממשיכים!',
              customClass: {
                popup: 'swal2-level-up-popup'
              }
            });
          }
        },
        error: (err) => {
          console.error('שגיאה בעדכון הנקודות בשרת:', err);
        },
      });
    } else {
      console.error('לא נמצא משתמש ב-localStorage');
    }
  }
}
