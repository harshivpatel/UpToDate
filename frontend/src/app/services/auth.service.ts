import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private baseUrl = 'http://localhost:5000/api';
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user_name';

  constructor(private http: HttpClient) {}

  register(data: { userName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setUsername(name: string) {
    localStorage.setItem(this.USER_KEY, name);
  }

  getUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.USER_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Bookmarking Methods
  addBookmark(article: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/userdata/bookmark`, { article }, { headers });
  }  

  removeBookmark(article: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/userdata/remove-bookmark`, { article }, { headers });
  }
  

  getBookmarks(): Observable<any> {
    const userName = this.getUsername();
    return this.http.get(`${this.baseUrl}/userdata/userName/${userName}`);
  }
}
