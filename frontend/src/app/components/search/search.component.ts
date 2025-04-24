import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResults: any[] = [];
  query: string = '';
  categories: string[] = ['General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'];
  isDarkMode: boolean = false;

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
    const token = this.authService.getToken();
    const userName = this.authService.getUsername();

    if (!token || !userName) {
      alert('Please log in to bookmark articles.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:5000/api/userdata/bookmark', { userName, article }, { headers }).subscribe({
      next: () => alert('Article bookmarked!'),
      error: (err) => {
        console.error('Bookmarking failed:', err);
        alert('Failed to bookmark the article.');
      }
    });
  }
}
