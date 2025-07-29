import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = 'http://localhost:7160/api/activities';

  constructor(private http: HttpClient) {}

  getActivitiesByUserAge(age: number): Observable<any> {
    const params = new HttpParams().set('age', age.toString());
    return this.http.get<any>(`${this.apiUrl}/by-age`, { params });
  }
}
