import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  UserName: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.UserName || !this.password) {
      this.errorMessage = 'יש למלא את כל השדות';
      return;
    }

    this.authService.login({ UserName: this.UserName, password: this.password }).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.errorMessage = res.message;
          return;
        }

        this.successMessage = 'התחברות הצליחה';
        this.errorMessage = '';
        Swal.fire('', 'התחברת בהצלחה', 'success');

        // שמירת המשתמש ואירוע התחברות
        this.authService.setCurrentUser(res.user);

        // ניווט לאחר התחברות
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'שגיאה כללית בשרת';
      }
    });
  }
}
