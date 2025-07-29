// src/app/dashboard/user-achievement/user-achievement.component.ts
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core'; // **הוסף Input**
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // ודא נתיב נכון
import { AchievementService } from '../../core/services/Achievements.service'; // ודא נתיב נכון

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrls: ['./user-achievement.component.css'],
  standalone: false,
})
export class UserAchievementComponent implements OnInit {
  // **אלו ה-@Input() שקומפוננטת האב (UserSummaryComponent) שולחת**
  @Input() userAchievements: any[] = [];
  @Input() nextUserAchievements: any = null;
  @Input() user: any = null; // אובייקט המשתמש (אם מעבירים גם אותו כ-Input)

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private achievementService: AchievementService
  ) { }

  ngOnInit(): void {
    console.log('UserAchievementComponent: ngOnInit נטען');

    // 1. נסה לקבל נתונים דרך ה-Router State (בעיקר לניווט ישיר לדף ההישגים)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      // אם הנתונים מגיעים דרך ה-state, השתמש בהם.
      // ודא שאתה לא דורס Input שהגיעו כבר. עדיף להעדיף Input אם זו קומפוננטת ילד.
      // אם המטרה היא שזה יהיה הדרך העיקרית לקבל נתונים, אז זה בסדר.
      this.userAchievements = navigation.extras.state['userAchievements'] || [];
      this.nextUserAchievements = navigation.extras.state['nextUserAchievements'] || null;
      this.user = navigation.extras.state['user'] || null;

      console.log('UserAchievementComponent: נתונים שהתקבלו מהראוטר (בכניסה ישירה לדף):', {
        userAchievements: this.userAchievements,
        nextUserAchievements: this.nextUserAchievements,
        user: this.user
      });

      this.cdr.detectChanges(); // כפה על Angular לזהות שינויים
      console.log('UserAchievementComponent: Change detection forced after state data.');

    }
    
    // 2. אם לא התקבלו נתונים דרך ה-Router State (או אם הגיעו כ-@Input ורוצים לוודא שהם טעונים)
    // ובנוסף המערך עדיין ריק או ה-user לא קיים (למשל, רענון דף או ניווט ישיר ללא state)
    // אז טען את הנתונים ישירות מהשירות.
    if (!this.user || !this.user.id || !this.userAchievements || this.userAchievements.length === 0) {
        console.warn('UserAchievementComponent: נתונים חסרים, מנסה לטעון מהשירות.');
        this.loadAchievementsFromService();
    }
    // אם הנתונים הגיעו כ-@Input וקיימים, אין צורך לטעון אותם מחדש.
  }

  /**
   * טוען את הישגי המשתמש ישירות מהשירות.
   * קורא ל-AuthService כדי לקבל את ה-userId, ואז ל-AchievementService.
   */
  private loadAchievementsFromService(): void {
    // נסה לקבל את פרטי המשתמש הנוכחי
    this.authService.currentUser$.subscribe(user => {
      this.user = user; // עדכן את אובייקט המשתמש גם כאן
      if (this.user && this.user.id) {
        const userId = Number(this.user.id); // ודא המרה למספר
        console.log('UserAchievementComponent: טוען הישגים עבור משתמש ID:', userId);

        // טעינת כל ההישגים של המשתמש
        this.achievementService.GetAchievementsByUserId(userId).subscribe({
          next: (res) => {
            if (res && res.achievements) {
              this.userAchievements = res.achievements;
              console.log('UserAchievementComponent: הישגי המשתמש נטענו מהשירות:', this.userAchievements);
            } else {
              this.userAchievements = [];
              console.warn('UserAchievementComponent: לא התקבלו הישגים מהשירות עבור המשתמש.');
            }
            this.cdr.detectChanges(); // עדכן תצוגה לאחר טעינת נתונים
          },
          error: (err) => {
            console.error('UserAchievementComponent: שגיאה בטעינת הישגי המשתמש מהשירות:', err);
            this.userAchievements = [];
            this.cdr.detectChanges();
          }
        });

        // טעינת ההישג הבא למשתמש
        this.achievementService.GetNextAchievementForUser(userId).subscribe({
          next: (res) => {
            if (res && res.nextAchievement) {
              this.nextUserAchievements = res.nextAchievement;
              console.log('UserAchievementComponent: ההישג הבא נטען מהשירות:', this.nextUserAchievements);
            } else {
              this.nextUserAchievements = null;
              console.warn('UserAchievementComponent: אין הישג הבא מהשירות.');
            }
            this.cdr.detectChanges(); // עדכן תצוגה לאחר טעינת נתונים
          },
          error: (err) => {
            console.error('UserAchievementComponent: שגיאה בטעינת ההישג הבא מהשירות:', err);
            this.nextUserAchievements = null;
            this.cdr.detectChanges();
          }
        });
      } else {
        console.warn('UserAchievementComponent: אין משתמש פעיל, לא ניתן לטעון הישגים מהשירות.');
        this.userAchievements = [];
        this.nextUserAchievements = null;
        this.cdr.detectChanges();
      }
    });
  }
}