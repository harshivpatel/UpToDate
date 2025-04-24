import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isDarkMode = document.body.classList.contains('dark-theme');

    if (this.isLoggedIn) {
      this.authService.getBookmarks().subscribe({
        next: (res) => {
          this.bookmarks = res.bookmarks || [];
        },
        error: () => {
          this.bookmarks = [];
        }
      });
    }
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
