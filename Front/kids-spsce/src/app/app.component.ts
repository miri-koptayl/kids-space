import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { UserAchievementComponent } from './dashboard/user-achievement/user-achievement.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kids-spsce';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('ניווט התחיל לכתובת:', event.url);
      } else if (event instanceof NavigationEnd) {
        console.log('ניווט הסתיים בכתובת:', event.url);
      } else if (event instanceof NavigationError) {
        console.error('שגיאה בניווט:', event.error);
      }
    });
  }
}
