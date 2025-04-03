import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UpToDate';  
  newsArticles: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    this.http.get<any>('http://localhost:5000/api/news').subscribe(
      (data) => {
        this.newsArticles = data.articles;
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }
}
