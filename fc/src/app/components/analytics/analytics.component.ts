import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsResponse } from '../../models/analytics.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  analyticsData: AnalyticsResponse[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('AnalyticsComponent: Initializing fetch...');
    this.analyticsService.getAnalytics()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
        console.log('AnalyticsComponent: Fetch completed');
      }))
      .subscribe({
        next: (data) => {
          console.log('AnalyticsComponent: Data received', data);
          this.analyticsData = data;
        },
        error: (err) => {
          console.error('AnalyticsComponent: Error fetching analytics', err);
          this.error = 'Failed to load analytics data. Check console for details.';
        }
      });
  }
}
