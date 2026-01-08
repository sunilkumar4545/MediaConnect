import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WatchHistoryService {
  private apiUrl = 'http://localhost:8080/api/watch-history';

  constructor(private http: HttpClient, private authService: AuthService) {}

  saveProgress(movieId: number, seconds: number): Observable<any> {
    const user = this.authService.currentUser();
    if (!user) return new Observable();
    
    return this.http.post(`${this.apiUrl}/save`, {
      userId: user.user.id, // Ensure this matches the model structure. Checked AuthResponse model implicitly.
      movieId,
      seconds
    });
  }

  getUserHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getMyHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  getProgress(movieId: number): Observable<any> {
    const user = this.authService.currentUser();
    if (!user) return new Observable();

    return this.http.get(`${this.apiUrl}/progress?userId=${user.user.id}&movieId=${movieId}`);
  }
}
