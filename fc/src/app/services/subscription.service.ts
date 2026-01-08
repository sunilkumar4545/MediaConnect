import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  subscribe(plan: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/subscribe`, { plan });
  }
}