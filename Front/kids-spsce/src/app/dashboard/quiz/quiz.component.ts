import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'; import { TriviaService } from '../../core/services/trivia.service';

import { AuthService } from '../../core/services/auth.service';

import { AchievementService } from '../../core/services/Achievements.service';

import Swal from 'sweetalert2';

@Component({

  selector: 'app-quiz',

  templateUrl: './quiz.component.html',

  styleUrls: ['./quiz.component.css'],

  standalone: false,

})

export class QuizComponent implements OnInit, OnChanges {

  categories: any[] = [];

  selectedCategory: number | null = null;

  questions: any[] = [];

  currentQuestionIndex = 0;

  selectedAnswer: string | null = null;

  showResult = false;

  isCorrect: boolean | null = null;

  nextUserAchievements: any;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');



  score: number = 0;

  pointsPerCorrectAnswer: number = 2;

  quizFinished: boolean = false;



  constructor(private triviaService: TriviaService, private achievementService: AchievementService, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['nextUserAchievements'] && changes['nextUserAchievements'].currentValue) {

      this.nextUserAchievements = changes['nextUserAchievements'].currentValue;

      console.log('ההישג הבא התקבל ב-QuizComponent:', this.nextUserAchievements);

    }

  }

  ngOnInit(): void {

    this.triviaService.getCategories().subscribe((res: any) => {

      this.categories = res.trivia_categories;

    });



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



  onCategoryChange() {

    if (this.selectedCategory) {

      this.triviaService.getQuestionsByCategory(this.selectedCategory).subscribe((res: any) => {

        this.questions = res.results.map((q: any) => ({

          ...q,

          allAnswers: this.shuffleAnswers([...q.incorrect_answers, q.correct_answer])

        }));

        this.currentQuestionIndex = 0;

        this.resetAnswer();

        this.score = 0;

        this.quizFinished = false;

      });

    }

  }



  shuffleAnswers(answers: string[]): string[] {

    return answers.sort(() => Math.random() - 0.5);

  }



  selectAnswer(answer: string) {

    this.selectedAnswer = answer;

    const correct = this.questions[this.currentQuestionIndex].correct_answer;

    this.isCorrect = answer === correct;

    this.showResult = true;

    if (this.isCorrect) {

      this.score += this.pointsPerCorrectAnswer;

      this.addPoint();



    }

  }



  nextQuestion() {

    if (this.currentQuestionIndex < this.questions.length - 1) {

      this.currentQuestionIndex++;

      this.resetAnswer();

    } else {

      this.quizFinished = true;

      this.resetAnswer();

      this.addPoint();

    }

  }



  resetAnswer() {

    this.selectedAnswer = null;

    this.showResult = false;

    this.isCorrect = null;

  }





  addPoint() {



    console.log("השיג הבא דרך....", this.nextUserAchievements);

    const userString = localStorage.getItem('user');



    if (userString) {

      const user = JSON.parse(userString);

      const newTotalPoints = (user.totalPoints || 0) + this.pointsPerCorrectAnswer;

      let newLevel = user.level || 0;

      console.log("נקודות ישנות:", user.totalPoints, "רמה ישנה:", user.level, "נקודות להישג הבא :", this.nextUserAchievements.requiredPoints);

      if (newLevel == 0 && this.nextUserAchievements.requiredPoints == newTotalPoints) {

        this.achievementService.EarnAchievement({

          UserId: this.user.id,

          AchievementId: this.nextUserAchievements.id

        }).subscribe({

          next: (res) => {

            console.log('ההישג נרשם בהצלחה:', res);

          },

          error: (err) => {

            console.error('שגיאה בשמירת  ההישג ', err);

          }

        });

      }

      else

        if (newTotalPoints == this.nextUserAchievements.requiredPoints * newLevel) {

          this.achievementService.EarnAchievement({

            UserId: this.user.id,

            AchievementId: this.nextUserAchievements.id

          }).subscribe({

            next: (res) => {

              console.log('ההישג נרשם בהצלחה:', res);

            },

            error: (err) => {

              console.error('שגיאה בשמירת  ההישג ', err);

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