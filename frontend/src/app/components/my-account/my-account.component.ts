import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
<<<<<<< HEAD
import { SidebarComponent } from '../sidebar/sidebar.component';
=======
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
>>>>>>> fix/validations-errorhandling

@Component({
  selector: 'app-my-account',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterModule,SidebarComponent],
=======
  imports: [CommonModule, RouterModule, FormsModule],
>>>>>>> fix/validations-errorhandling
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit{
  
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
      error: err => {
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
    
  }
  
}
