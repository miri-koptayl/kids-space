import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AchievementService {
  private apiUrl = 'http://localhost:7160/api/UserAchievements';

  constructor(private http: HttpClient) {}

  GetNextAchievementForUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/next-achievement/${userId}`);
  }

  GetAchievementsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-user/${userId}`);
  }
  EarnAchievement(earnAchievement: {
    UserId: number;
    AchievementId: number;
  }) {
    return this.http.post(`${this.apiUrl}/earn-achievement`, earnAchievement).pipe(
        tap((response: any) => {
            console.log("השיג נרשם בהצלחה", response);
            console.log("פרטי השיג שנרשם", earnAchievement);
          })
    );
  }
  


}
