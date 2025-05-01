import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit{
  
  isDarkMode = false;
  isLoggedIn = false;

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
  
}
