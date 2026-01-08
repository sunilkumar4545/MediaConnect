import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsResponse } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8080/api/admin/analytics';

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<AnalyticsResponse[]> {
    return this.http.get<AnalyticsResponse[]>(this.apiUrl);
  }
}
