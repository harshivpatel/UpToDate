import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResults: any[] = [];
  query: string = '';
  categories: string[] = ['General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'];
  isDarkMode: boolean = false;
  isLoggedIn = false;
  userName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) this.searchArticles();
    });
  }

  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('dark-theme');
    const observer = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains('dark-theme');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Check session user
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.userName = user.userName;
      },
      error: () => {
        this.isLoggedIn = false;
        this.userName = null;
      }
    });
  }

  searchArticles(): void {
    this.newsService.searchNews(this.query).subscribe({
      next: (data) => {
        this.searchResults = data.articles || [];
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
      }
    });
  }

  bookmarkArticle(article: any): void {
    if (!this.isLoggedIn || !this.userName) {
      alert('Please log in to bookmark articles.');
      return;
    }

    this.http.post(
      'http://localhost:5000/api/userdata/bookmark',
      { article },
      { withCredentials: true }
    ).subscribe({
      next: () => alert('Bookmarked!'),
      error: (err) => {
        console.error('Bookmarking failed:', err);
        alert('Failed to bookmark the article.');
      }
    });
  }
  onCategoriesChanged(categories: string[]): void {

  }
  
}
