import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'UpToDate';
  newsArticle: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.fetchNews();
  }
  fetchNews(): void {
    const apiUrl = 'https://newsapi.org/v2/top-headlines?country=ie&apiKey=241d9cda125a47f5a816a7fc8fa1cc0a';
    
  }
}
