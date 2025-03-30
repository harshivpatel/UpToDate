import { Injectable  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiURL = 'https://newsapi.org/v2/top-headlines';
  private apiKey = '241d9cda125a47f5a816a7fc8fa1cc0a';

  constructor(private http: HttpClient) {}

  getNews(country: String = 'ie'): Observable<any> {
    return this.http.get<any>(`${this.apiURL}?country=${country}&apiKey=${this.apiKey}`);
  }
}