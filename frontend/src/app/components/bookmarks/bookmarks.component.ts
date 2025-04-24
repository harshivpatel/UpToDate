import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  bookmarks: any[] = [];
  isLoggedIn: boolean = false;
  isDarkMode: boolean = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Detect dark mode
    this.isDarkMode = typeof document !== 'undefined' &&
                      document.body.classList.contains('dark-theme');

    // Check if user is logged in and load bookmarks
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.username = user.userName;
        this.loadBookmarks();
      },
      error: () => {
        this.isLoggedIn = false;
        this.username = null;
        this.bookmarks = [];
      }
    });
  }

  loadBookmarks(): void {
    this.authService.getBookmarks().subscribe({
      next: (res) => {
        this.bookmarks = res.bookmarks || [];
      },
      error: () => {
        this.bookmarks = [];
      }
    });
  }

  removeBookmark(bookmark: any): void {
    this.authService.removeBookmark(bookmark).subscribe({
      next: () => {
        this.bookmarks = this.bookmarks.filter(b => b.url !== bookmark.url);
      },
      error: () => {
        alert('Failed to remove bookmark');
      }
    });
  }
}
