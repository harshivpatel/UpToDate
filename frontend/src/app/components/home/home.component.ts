import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'UpToDate';
  newsArticles: any[] = [];
  bookmarks: any[] = [];
  searchQuery: string = '';
  category: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['name'] || null;

      if (this.category) {
        this.fetchNewsByCategory(this.category);
      } else {
        this.fetchTopNews();
      }
    });
  }

  fetchTopNews(): void {
    this.http.get<any>('http://localhost:5000/api/news').subscribe(
      data => this.newsArticles = data.articles,
      error => console.error('Error fetching top news:', error)
    );
  }

  fetchNewsByCategory(category: string): void {
    const url = `http://localhost:5000/api/news?category=${category}`;
    this.http.get<any>(url).subscribe(
      data => this.newsArticles = data.articles,
      error => console.error(`Error fetching ${category} news:`, error)
    );
  }

  searchNews(query: string): void {
    if (!query.trim()) return;
    const url = `http://localhost:5000/api/news?q=${query}`;
    this.http.get<any>(url).subscribe(
      data => this.newsArticles = data.articles,
      error => console.error('Error fetching searched news:', error)
    );
  }

  toggleBookmark(article: any): void {
    const exists = this.bookmarks.find(a => a.url === article.url);
    this.bookmarks = exists
      ? this.bookmarks.filter(a => a.url !== article.url)
      : [...this.bookmarks, article];
    console.log('Current Bookmarks:', this.bookmarks);
  }

  shareLink(platform: string, url: string): void {
    const links: { [key: string]: string } = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (links[platform]) {
      window.open(links[platform], '_blank');
    } else {
      console.warn('Unsupported platform');
    }
  }

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  bookmarkArticle(article: any) {
    this.authService.isLoggedIn().subscribe(isLogged => {
      if (!isLogged) {
        alert('Please login to bookmark articles.');
        return;
      }

      this.authService.addBookmark(article).subscribe({
        next: () => alert('Bookmarked!'),
        error: (err) => {
          console.error('Bookmark error:', err);
          alert('Bookmark failed');
        }
      });
    });
  }
}
