import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe(
        (res: any) => {
          alert('Login successful');
          this.authService.setToken(res.token);
          this.authService.setUsername(res.userName);
        },
        (err) => alert('Login failed')
      );
    } else {
      this.authService.register({ userName: this.userName, email: this.email, password: this.password }).subscribe(
        (res: any) => {
          alert('Registration successful. You can now log in.');
          this.toggleMode();
        },
        (err) => alert('Registration failed')
      );
    }
  }
}
