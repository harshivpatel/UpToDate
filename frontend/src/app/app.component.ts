import { Component, OnInit, DoCheck } from '@angular/core';
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
export class AppComponent implements OnInit, DoCheck {
  isDarkMode = false;
  title = 'UpToDate';
  searchText: string = '';
  isLoggedIn = false;
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUsername();
  }

  ngDoCheck(): void {
    const token = this.authService.getToken();
    const user = this.authService.getUsername();

    if (token && user) {
      this.isLoggedIn = true;
      this.username = user;
    } else {
      this.isLoggedIn = false;
      this.username = null;
    }
  }

  search(event: Event): void {
    event.preventDefault();
    if (this.searchText.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchText } });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isLoggedIn = false;
    this.username = null;
  }
}
