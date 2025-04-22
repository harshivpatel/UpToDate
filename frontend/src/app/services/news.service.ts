import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  searchNews(query: string) {
    return this.http.get<any>(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=241d9cda125a47f5a816a7fc8fa1cc0a`
    );
  }
  
  
  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/news')
  }
}
