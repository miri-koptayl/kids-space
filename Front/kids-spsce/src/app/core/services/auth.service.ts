import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:7160/api/user';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * התחברות למערכת
   */
  login(credentials: { UserName: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          this.setToken(response.token);
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

 
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

 
  register(userData: {
    username: string;
    password: string;
    email: string;
    age: number;
    ProfilePictureUrl?: string;
  }) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          console.log("פרטי משתמש שנרשם",userData)
          this.setToken(response.token);
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  updateUser(userId: number, userData: any) {
    console.log('עדכון משתמש:', userId, userData);
    return this.http.put(`${this.apiUrl}/${userId}`, userData).pipe(
      tap((updatedUser: any) => {
        this.setCurrentUser(updatedUser);
      })
    );
  }

 
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}