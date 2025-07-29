import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { QuizComponent } from './quiz/quiz.component';
import { FormsModule } from '@angular/forms';
import { UserAchievementComponent } from './user-achievement/user-achievement.component';
import { DamageStampComponent } from './damage-stamp/damage-stamp.component'; // ← זה השורה החשובה

@NgModule({
  declarations: [
    DashboardComponent,
    UserSummaryComponent,
    ActivityCardComponent,
    ActivitiesListComponent,
    QuizComponent,
    UserAchievementComponent,
    DamageStampComponent ,
    

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule
  ]
})
export class DashboardModule {

}
