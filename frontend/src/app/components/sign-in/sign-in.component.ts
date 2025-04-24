import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  isLoginMode: boolean = true;
  email: string = '';
  password: string = '';
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearForm();
  }

  clearForm(): void {
    this.email = '';
    this.password = '';
    this.userName = '';
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
  
    if (!this.email || !this.password || (!this.isLoginMode && !this.userName)) {
      alert('Please fill in all required fields.');
      return;
    }
  
    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          this.authService.setUsername(res.userName); 
          alert('Login successful');
          window.location.href = '/';
        },
        error: (err) => {
          const msg = err.error?.error || 'Login failed';
          alert(msg);
        }
      });
    } else {
      this.authService.register({
        userName: this.userName,
        email: this.email,
        password: this.password
      }).subscribe({
        next: () => {
          alert('Registration successful. You can now log in.');
          this.toggleMode();
        },
        error: (err) => {
          const msg = err.error?.error || 'Registration failed';
          alert(msg);
        }
      });
    }
  }
  
  
}
