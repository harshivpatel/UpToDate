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
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearForm();
    this.errorMessage = '';
  }

  clearForm(): void {
    this.email = '';
    this.password = '';
    this.userName = '';
    this.errorMessage = '';
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();

    if (!this.email || !this.password || (!this.isLoginMode && !this.userName)) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.errorMessage = ''; // clear any previous errors

    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          this.authService.setUsername(res.userName);
          alert('Login successful');
          window.location.href = '/';
        },
        error: (err) => {
          const msg = err.error?.error || 'Login failed';
          this.errorMessage = msg;
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
          if (msg.toLowerCase().includes('exists')) {
            alert('User already exists');
          } else {
            this.errorMessage = msg;
          }
        }
      });
    }
  }
}
