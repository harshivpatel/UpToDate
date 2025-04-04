import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UpToDate';
  newsArticles: any[] = [];
  bookmarks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:5000/api/news').subscribe(
      (data) => {
        this.newsArticles = data.articles;
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }

  toggleBookmark(article: any): void {
    const exists = this.bookmarks.find((a) => a.url === article.url);
    if (exists) {
      this.bookmarks = this.bookmarks.filter((a) => a.url !== article.url);
    } else {
      this.bookmarks.push(article);
    }
    console.log('Current Bookmarks:', this.bookmarks);
  }

  shareLink(platform: string, url: string): void {
    let shareUrl = '';
    if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else {
      console.warn('Unsupported platform');
      return;
    }
    window.open(shareUrl, '_blank');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  fetchNewsByCategory(category: string) {
    const url = `http://localhost:5000/api/news?category=${category}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.newsArticles = data.articles;
      },
      (error) => {
        console.error(`Error fetching the ${category} news`, error);
      }
    );
  }
}

