import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  age: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  user: any = {};
  selectedFile: File | null = null;
  profilePictureUrl: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  uploadProfilePicture(): Promise<string> {
    if (!this.selectedFile) {
      return Promise.resolve(''); 
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    return this.http.post<{ url: string }>('/api/user/upload-profile-picture', formData)
      .toPromise()
      .then(response => response?.url ?? '')
      .catch(() => {
        this.errorMessage = 'העלאת תמונת הפרופיל נכשלה';
        return '';
      });
  }

  async register() {
    const ageToSend = this.age ?? 0;

    this.errorMessage = '';
    this.successMessage = '';

    const uploadedUrl = await this.uploadProfilePicture();
    this.profilePictureUrl = uploadedUrl;
    console.log('Uploaded profile picture URL:', this.profilePictureUrl);

    this.authService.register({
      username: this.username,
      password: this.password,
      email: this.email,
      age: ageToSend,
      ProfilePictureUrl: this.profilePictureUrl
    }).subscribe({
      next: (res: any) => {
        if (res && res.success === true && res.user && res.user.id) {
          this.successMessage = 'הרשמה הצליחה';
          Swal.fire('', 'נרשמת בהצלחה', 'success');
          this.errorMessage = '';
          this.user = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        } else if (res && res.message) {
          this.errorMessage = res.message;
          this.successMessage = '';
        } else {
          this.errorMessage = 'הרשמה נכשלה - פורמט תגובה לא צפוי';
          this.successMessage = '';
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'שגיאה כללית בשרת';
        this.successMessage = '';
      }
    });
  }
}
