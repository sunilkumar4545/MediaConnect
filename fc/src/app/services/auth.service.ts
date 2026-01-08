import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private token: string | null = null;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.token = response.token;
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response));
    this.currentUserSubject.next(response);
    
    if (response.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
    } else {
        this.router.navigate(['/home']);
    }
  }



  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  hasActiveSubscription(): boolean {
    const user = this.currentUser()?.user;
    return user?.subscriptionStatus === 'ACTIVE';
  }

  updateUser(user: User): void {
    const current = this.currentUser();
    if (current) {
        const updatedResponse: AuthResponse = {
            ...current,
            user: user
        };
        this.currentUserSubject.next(updatedResponse);
        localStorage.setItem('currentUser', JSON.stringify(updatedResponse));
    }
  }
}
