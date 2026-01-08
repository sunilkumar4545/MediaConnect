import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AdminMoviesComponent } from '../admin-movies/admin-movies.component';
import { AnalyticsComponent } from '../analytics/analytics.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminMoviesComponent, AnalyticsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  activeTab: string = 'users'; // Default tab
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AdminDashboard: Initializing...');
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    console.log('AdminDashboard: Loading users...');
    
    this.userService.getAllUsers()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges(); // Force UI update
          console.log('AdminDashboard: Loading finished');
        })
      )
      .subscribe({
        next: (data) => {
          console.log('AdminDashboard: Users loaded', data);
          this.users = data;
        },
        error: (err) => {
          console.error('AdminDashboard: Error loading users', err);
          this.error = 'Failed to load users. Please try refreshing.';
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
