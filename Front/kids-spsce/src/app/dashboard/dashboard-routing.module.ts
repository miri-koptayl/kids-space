import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { QuizComponent } from './quiz/quiz.component';
import {DamageStampComponent} from './damage-stamp/damage-stamp.component';
import { UserAchievementComponent } from './user-achievement/user-achievement.component'; // ← זה השורה החשובה
const routes: Routes = [
    {
      path: '',
      component: DashboardComponent,
      children: [
      
        { path: 'summary', component: UserSummaryComponent },
        { path: 'StoryListComponent', component: ActivitiesListComponent },
        { path: 'QuizComponent', component: QuizComponent },
        { path: 'DamageStampComponent', component: DamageStampComponent },
        { path: 'userAchievement', component: UserAchievementComponent },
      ]
    }
  ];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
