import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { AchievementService } from '../../core/services/Achievements.service'; // ודא שהנתיב נכון

@Component({
  selector: 'app-damage-stamp',
  standalone: false,
  templateUrl: './damage-stamp.component.html',
  styleUrls: ['./damage-stamp.component.css']
})
export class DamageStampComponent implements OnInit { // ודא שאתה מיישם את ממשק OnInit
  secretCode: number[] = [];
  currentGuess: string = '';
  attempts: number = 0;
  maxAttempts: number = 0;
  gameOver: boolean = false;
  feedback: string = '';
  history: { guess: string; result: string }[] = [];

  constructor(private authService: AuthService, private achievementService: AchievementService) { }
  nextUserAchievements: any;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  ngOnInit(): void {
    this.startGame();
    this.achievementService.GetNextAchievementForUser(this.user.id).subscribe({
      next: (res) => {
        this.nextUserAchievements = res.nextAchievement || null;
        console.log('ההישג הבא:', this.nextUserAchievements);
      },
      error: (err) => {
        console.error('שגיאה בשליפת ההישג הבא', err);
        this.nextUserAchievements = null;
      }
    });
  }

  startGame(): void {
    this.secretCode = this.generateSecretCode();
    this.attempts = 0;
    this.gameOver = false;
    this.feedback = '';
    this.history = [];
    this.maxAttempts = this.user.age <= 7 ? 15 : 10;
    this.currentGuess = ''; // ודא ששדה הקלט ריק להתחלה חדשה
    console.log('Secret Code:', this.secretCode.join('')); // לצרכי בדיקה בלבד, לא להציג למשתמש
  }

  /**
   * מייצר קוד סודי בן 4 ספרות שונות (0-9).
   */
  generateSecretCode(): number[] {
    const code: number[] = [];
    while (code.length < 4) {
      const digit = Math.floor(Math.random() * 10);
      if (!code.includes(digit)) { // ודא שהספרה אינה קיימת כבר בקוד
        code.push(digit);
      }
    }
    return code;
  }

  /**
   * בודק את הניחוש הנוכחי של המשתמש מול הקוד הסודי.
   */
  checkGuess(): void {
    if (this.gameOver) {
      return; // אל תאפשר בדיקה אם המשחק נגמר
    }

    // ולידציה של אורך ופורמט הקלט
    if (this.currentGuess.length !== 4 || !/^\d{4}$/.test(this.currentGuess)) {
      this.feedback = 'אנא הזן מספר בן 4 ספרות.';
      return;
    }

    const guessDigits = this.currentGuess.split('').map(d => +d);
    const uniqueDigits = new Set(guessDigits);
    if (uniqueDigits.size !== 4) {
      this.feedback = 'יש להזין 4 ספרות שונות.';
      return;
    }

    this.attempts++; // הגדל את מונה הניסיונות

    let bulls = 0; // ספרות נכונות במקום הנכון
    let cows = 0;  // ספרות נכונות במקום הלא נכון

    guessDigits.forEach((digit, index) => {
      if (digit === this.secretCode[index]) {
        bulls++;
      } else if (this.secretCode.includes(digit)) {
        cows++;
      }
    });

    this.feedback = `${bulls} במקום הנכון, ${cows} במקום הלא נכון`;
    this.history.push({ guess: this.currentGuess, result: this.feedback });
    // בדיקה אם המשתמש ניחש נכון
    if (bulls === 4) {
      this.gameOver = true;
      this.feedback = 'מזל טוב! ניחשת את המספר נכון!';
      this.addPoint();
    }
    // בדיקה אם נגמרו הניסיונות
    else if (this.attempts >= this.maxAttempts) {
      this.gameOver = true;
      this.feedback = `נגמרו הניסיונות! המספר היה ${this.secretCode.join('')}`;
    }

    this.currentGuess = ''; // נקה את שדה הקלט עבור הניסיון הבא
  }
  addPoint() {
    const userString = localStorage.getItem('user');
  
    if (userString) {
      const user = JSON.parse(userString);
      const newTotalPoints = (user.totalPoints || 0) + 8;
      let newLevel = user.level || 0;
      
      console.log("נקודות ישנות:", user.totalPoints, "רמה ישנה:", user.level);
  
      // טיפול בהישגים רק אם יש נתונים על ההישג הבא
      if (this.nextUserAchievements && this.nextUserAchievements.requiredPoints) {
        console.log("נקודות להישג הבא:", this.nextUserAchievements.requiredPoints);
        
        // בדיקה להישג ברמה 0 (התחלתית)
        if (newLevel == 0 && this.nextUserAchievements.requiredPoints == newTotalPoints) {
          this.achievementService.EarnAchievement({
            UserId: this.user.id,
            AchievementId: this.nextUserAchievements.id
          }).subscribe({
            next: (res) => {
              console.log('ההישג נרשם בהצלחה:', res);
            },
            error: (err) => {
              console.error('שגיאה בשמירת ההישג:', err);
            }
          });
        }
        // בדיקה להישג ברמות גבוהות יותר
        else if (newTotalPoints == this.nextUserAchievements.requiredPoints * newLevel) {
          this.achievementService.EarnAchievement({
            UserId: this.user.id,
            AchievementId: this.nextUserAchievements.id
          }).subscribe({
            next: (res) => {
              console.log('ההישג נרשם בהצלחה:', res);
            },
            error: (err) => {
              console.error('שגיאה בשמירת ההישג:', err);
            }
          });
        }
      } else {
        console.log('אין נתונים על הישג הבא - מדלג על בדיקת הישגים');
      }
  
      // בדיקה לעלייה ברמה
      if (newTotalPoints >= 100) {
        newLevel = Math.floor(newTotalPoints / 100);
      }
  
      console.log("נקודות חדשות:", newTotalPoints, "רמה חדשה:", newLevel);
      
      const updatedUserData = { ...user, totalPoints: newTotalPoints, level: newLevel };
      
      // עדכון בשרת
      this.authService.updateUser(user.id, updatedUserData).subscribe({
        next: (responseFromServer) => {
          console.log('הנקודות עודכנו בהצלחה בשרת:', responseFromServer);
          localStorage.setItem('user', JSON.stringify(responseFromServer));
          
          // הודעה על עלייה ברמה (רק אם עלה רמה בפועל)
          if (newLevel > user.level) {
            console.log("עלה רמה מ-", user.level, "ל-", newLevel);
            Swal.fire({
              title: 'כל הכבוד!',
              html: `עלית לרמה <strong>${newLevel}</strong>! 🎉<br>אתה הופך למומחה אמיתי!`,
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