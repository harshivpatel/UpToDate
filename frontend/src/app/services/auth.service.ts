import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private baseUrl = 'http://localhost:5000/api';
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user_name';

  constructor(private http: HttpClient) {}

  // Token and Username Storage
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
  

  setUsername(name: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, name);
    }
  }
  

  getUsername(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.USER_KEY);
    }
    return null;
  }
  

  // Auth Methods
  register(data: { userName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true });
  }

  getCurrentUser(): Observable<{ userName: string }> {
    return this.http.get<{ userName: string }>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getCurrentUser().subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  //Bookmarking Methods
  addBookmark(article: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/userdata/bookmark`, { article }, { withCredentials: true });
  }

  removeBookmark(article: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/userdata/remove-bookmark`, { article }, { withCredentials: true });
  }

  getBookmarks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/userdata/bookmarks`, {
      withCredentials: true
    });
  }
  
  clearBookmarks(): Observable<any> {
    return this.http.put(`${this.baseUrl}/userdata/update`, { bookmarks: [] }, { withCredentials: true });
  }
}
