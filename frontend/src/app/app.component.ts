import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  title = 'UpToDate';
  searchText: string = '';
  isLoggedIn = false;
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.username = user.userName;
      },
      error: () => {
        const localUsername = this.authService.getUsername();
        if (localUsername) {
          this.isLoggedIn = true;
          this.username = localUsername;
        } else {
          this.isLoggedIn = false;
          this.username = null;
        }
      }
    });
  }
  

  search(event: Event): void {
    event.preventDefault();
    if (this.searchText.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchText } });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.username = null;
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Logout failed.');
      }
    });
  }
}
