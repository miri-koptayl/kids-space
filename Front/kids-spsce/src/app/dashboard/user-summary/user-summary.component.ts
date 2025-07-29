// src/app/dashboard/user-summary/user-summary.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core'; // **חשוב: הוסף Input**
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service'; // ודא נתיב נכון
import { AchievementService } from '../../core/services/Achievements.service'; // ודא נתיב נכון

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css'],
  standalone: false, 
})
export class UserSummaryComponent implements OnInit, OnDestroy {
  @Input() user: any; // מקבל את אובייקט המשתמש כ-Input מהדאשבורד
  @Input() userAchievements: any[] = []; // מקבל את הישגי המשתמש כ-Input
  @Input() nextUserAchievements: any = null; // מקבל את ההישג הבא כ-Input

  showAchievementsList: boolean = false; // מצב להצגה/הסתרה של רשימת ההישגים
  private authSubscription: Subscription | undefined;
  private achievementSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private achievementService: AchievementService
  ) { }

  ngOnInit(): void {
    console.log('UserSummaryComponent: ngOnInit נטען.');
    console.log('UserSummaryComponent: נתוני משתמש שהתקבלו כ-Input:', this.user);
    console.log('UserSummaryComponent: הישגים שהתקבלו כ-Input:', this.userAchievements);
    console.log('UserSummaryComponent: הישג הבא שהתקבל כ-Input:', this.nextUserAchievements);

    // אם ה-user לא הגיע כ-Input (למשל, טעינה ישירה או רענון), טען אותו
    if (!this.user) {
      this.authSubscription = this.authService.currentUser$.subscribe(user => {
        this.user = user;
        if (this.user && this.user.id) {
          console.log('UserSummaryComponent: משתמש נטען מ-AuthService:', this.user);
          // אם המשתמש נטען כאן, ייתכן שנצטרך לטעון את ההישגים גם כאן
          // אם userAchievements ו-nextUserAchievements לא הגיעו כ-Input.
          if (!this.userAchievements || this.userAchievements.length === 0) {
            this.loadUserAchievements(Number(this.user.id));
          }
        }
      });
    } else {
        // אם ה-user הגיע כ-Input, וודא שהישגים גם הגיעו.
        // אם לא, טען אותם. זה עבור המקרה שבו userSummary מוטמעת אבל הנתונים לא מועברים.
        if (!this.userAchievements || this.userAchievements.length === 0) {
             this.loadUserAchievements(Number(this.user.id));
        }
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.achievementSubscription) {
      this.achievementSubscription.unsubscribe();
    }
  }

  // פונקציית טעינת הישגים למקרה שלא הגיעו כ-Input
  private loadUserAchievements(userId: number): void {
    this.achievementService.GetAchievementsByUserId(userId).subscribe({
      next: (res) => {
        this.userAchievements = res.achievements || [];
        console.log('UserSummaryComponent: הישגי משתמש נטענו מחדש:', this.userAchievements);
      },
      error: (err) => console.error('UserSummaryComponent: שגיאה בטעינת הישגים מחדש:', err)
    });

    this.achievementService.GetNextAchievementForUser(userId).subscribe({
      next: (res) => {
        this.nextUserAchievements = res.nextAchievement || null;
        console.log('UserSummaryComponent: הישג הבא נטען מחדש:', this.nextUserAchievements);
      },
      error: (err) => console.error('UserSummaryComponent: שגיאה בטעינת הישג הבא מחדש:', err)
    });
  }

  onImageError(event: Event) {
    console.error('שגיאה בטעינת תמונת פרופיל', event);
    // הגדר תמונת ברירת מחדל או הסתר את התמונה
    (event.target as HTMLImageElement).src = 'assets/default-profile.png'; // נתיב לתמונת ברירת מחדל
  }

  toggleAchievementsList(): void {
    this.showAchievementsList = !this.showAchievementsList;
  }
}