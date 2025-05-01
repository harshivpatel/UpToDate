import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  isDarkMode = false;
  isLoggedIn = false;
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: () => {
        this.isLoggedIn = true;
      },
      error: () => {
        this.isLoggedIn = false;
      }
    });
  }

  changePassword(): void {
    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err: any) => {
        alert(err.error?.error || 'Failed to change password');
      }
    });
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-theme');
    this.isDarkMode = !this.isDarkMode;
  }

  setDarkMode(): void {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }

  setLightMode(): void {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }

  onCategoriesChanged(categories: string[]): void {
    // To be implemented if needed
  }
}
