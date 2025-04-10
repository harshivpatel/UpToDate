import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UpToDate';
  newsArticles: any[] = [];
  bookmarks: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTopNews();
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
  onSearch(): void {
    this.searchNews(this.searchQuery);
  }

  searchNews(query: string): void {
    if (!query.trim()) return;
    const url = `http://localhost:5000/api/news?q=${query}`;
    this.http.get<any>(url).subscribe(
      data => {
        this.newsArticles = data.articles;
        console.log("Search results:", data.articles);
      },
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
}
