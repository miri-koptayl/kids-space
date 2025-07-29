import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const protectedEndpoints = [
      '/api/user/',           // עדכון משתמש
      'user/update',          // עדכון משתמש
      'user/profile',         // פרופיל משתמש
      'user/delete',          // מחיקת משתמש
      '/protected/',          // כל endpoint שמתחיל ב-protected
      'localhost:7160/api/user/', 
    ];
    
    // בדוק אם הבקשה הנוכחית דורשת אימות
    const requiresAuth = protectedEndpoints.some(endpoint => 
      req.url.includes(endpoint) && 
      (req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH')
    );
    
    // אם הבקשה לא דורשת אימות, שלח כרגיל
    if (!requiresAuth) {
      console.log('📤 Request without authentication:', req.url);
      return next.handle(req);
    }

    // קבל את הטוקן מה-AuthService
    const token = this.authService.getToken();
        
    // אם יש טוקן, הוסף אותו לכותרות הבקשה
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
            
      console.log('🔑 Token added to protected request:', authReq.url);
      return next.handle(authReq);
    }
        
    // אם אין טוקן לבקשה מוגנת, שלח בלי טוקן (השרת יחזיר 401)
    console.log('⚠️ Protected request without token:', req.url);
    return next.handle(req);
  }
}