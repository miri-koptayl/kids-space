// src/app/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service'; // ודא נתיב נכון
import { AchievementService } from '../core/services/Achievements.service'; // ודא נתיב נכון

@Component({
  selector: 'app-dashboard',
  standalone: false, // נשאר false
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showDefaultMessage: boolean = false;
  private routerSubscription!: Subscription;
  private authSubscription!: Subscription; // נוסף לניהול מנוי AuthService

  user: any;
  userAchievements: any[] = [];
  nextUserAchievements: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private achievementService: AchievementService
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent: ngOnInit נטען');

    this.checkRouteForDefaultMessage(this.router.url);

    // חיוני: הרשמה ל-currentUser$ כדי לקבל את המשתמש
    // שמור את המנוי כדי לבטל אותו ב-ngOnDestroy
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user && this.user.id) {
        console.log('DashboardComponent: משתמש התקבל:', this.user);
        // וודא ש-userId נשלח כמספר
        this.loadUserAchievements(Number(this.user.id));
      } else {
        console.warn('DashboardComponent: אין נתוני משתמש זמינים, לא ניתן לטעון הישגים.');
        this.userAchievements = [];
        this.nextUserAchievements = null;
      }
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRouteForDefaultMessage(event.urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) { // בטל את המנוי של AuthService
      this.authSubscription.unsubscribe();
    }
  }

  private checkRouteForDefaultMessage(url: string): void {
    const specificChildContentRoutes = [
      '/dashboard/StoryListComponent',
      '/dashboard/QuizComponent',
      '/dashboard/DamageStampComponent',
      '/dashboard/userAchievement',
      '/dashboard/summary' // אם user-summary הוא נתיב נפרד ולא רק חלק מ-dashboard
    ];

    if (url === '/dashboard' || url === '/dashboard/') {
      this.showDefaultMessage = true;
    } else {
      this.showDefaultMessage = !specificChildContentRoutes.some(route => url.includes(route));
    }
    console.log(`DashboardComponent: URL: ${url}, showDefaultMessage: ${this.showDefaultMessage}`);
  }

  // פונקציה לטעינת הישגים - userId צריך להיות מסוג number
  private loadUserAchievements(userId: number): void {
    // שלב 1: טעינת כל ההישגים של המשתמש
    this.achievementService.GetAchievementsByUserId(userId).subscribe({
      next: (res) => {
        if (res && res.achievements) {
          this.userAchievements = res.achievements;
          console.log('DashboardComponent: הישגי המשתמש נטענו בהצלחה:', this.userAchievements);
        } else {
          this.userAchievements = [];
          console.warn('DashboardComponent: לא התקבלו הישגים עבור המשתמש, או שהפורמט שגוי.');
        }
      },
      error: (err) => {
        console.error('DashboardComponent: שגיאה בשליפת הישגי המשתמש:', err);
        this.userAchievements = [];
      }
    });

    // שלב 2: טעינת ההישג הבא
    this.achievementService.GetNextAchievementForUser(userId).subscribe({
      next: (res) => {
        if (res && res.nextAchievement) {
          this.nextUserAchievements = res.nextAchievement;
          console.log('DashboardComponent: ההישג הבא נטען בהצלחה:', this.nextUserAchievements);
        } else {
          this.nextUserAchievements = null;
          console.warn('DashboardComponent: אין הישג הבא או שהפורמט שגוי.');
        }
      },
      error: (err) => {
        console.error('DashboardComponent: שגיאה בשליפת ההישג הבא:', err);
        this.nextUserAchievements = null;
      }
    });
  }

  // פונקציות ניווט (כפי שדנו, שולחות נתונים דרך state)
  navigateToStories(): void {
    this.router.navigate(['/dashboard/StoryListComponent']);
  }

  navigateToQuiz(): void {
    this.router.navigate(['/dashboard/QuizComponent'], {
      state: {
        user: this.user,
        userAchievements: this.userAchievements,
        nextUserAchievements: this.nextUserAchievements
      }
    });
  }

  navigateToDamageStamp(): void {
    this.router.navigate(['/dashboard/DamageStampComponent'], {
      state: {
        user: this.user,
        userAchievements: this.userAchievements,
        nextUserAchievements: this.nextUserAchievements
      }
    });
  }

  navigateToAchievements(): void {
    console.log('DashboardComponent: מנווט להישגים עם נתונים:', {
      user: this.user,
      userAchievements: this.userAchievements,
      nextUserAchievements: this.nextUserAchievements
    });

    this.router.navigate(['/dashboard/userAchievement'], {
      state: {
        user: this.user,
        userAchievements: this.userAchievements,
        nextUserAchievements: this.nextUserAchievements
      }
    });
  }
}