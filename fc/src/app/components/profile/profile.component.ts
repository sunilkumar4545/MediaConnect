import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserDTO } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { WatchHistoryService } from '../../services/watch-history.service';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MovieCardComponent],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-card {
      background: #fff;
      border-radius: 8px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private watchHistoryService = inject(WatchHistoryService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  authService = inject(AuthService);
  
  user: UserDTO | null = null;
  loading = true;
  isEditing = false;
  
  // Edit Form Data
  editData: Partial<UserDTO> = {};
  
  // History Data
  watchHistory: Movie[] = [];

  ngOnInit() {
    this.refreshUser();
  }

  refreshUser() {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        
        // Update auth service state quietly
        if (data) {
             const appUser: any = { ...data };
             this.authService.updateUser(appUser);
             this.loadHistory(data.id);
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistory(userId: number) {
      this.watchHistoryService.getUserHistory(userId).subscribe({
          next: (data) => {
               this.watchHistory = data.map((h: any) => ({
                    ...h.movie,
                    progress: h.progressSeconds,
                    displayProgress: this.formatTime(h.progressSeconds)
               }));
               this.cdr.detectChanges();
          },
          error: (err) => console.error('Failed to load history', err)
      });
  }


  
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    return `${m}m`;
  }

  getGenresList(): string[] {
    if (!this.user || !this.user.genres) return [];
    return this.user.genres.split(',').map(g => g.trim());
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  startEdit() {
    if (this.user) {
        this.editData = { ...this.user };
        this.isEditing = true;
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editData = {};
  }

  saveProfile() {
    if (!this.editData.fullName || !this.editData.email) {
        alert("Name and Email are required");
        return;
    }

    const originalEmail = this.user?.email;

    this.userService.updateMe(this.editData as UserDTO).subscribe({
        next: (updatedUser) => {
            if (updatedUser.email !== originalEmail) {
                alert('Email updated! Please login again with your new email.');
                this.authService.logout();
                return;
            }

            this.user = updatedUser;
            this.isEditing = false;
            this.authService.updateUser({ ...updatedUser } as any);
            this.cdr.detectChanges();
            alert('Profile updated successfully!');
        },
        error: (err) => {
            console.error('Update failed', err);
            alert('Failed to update profile. Email might be in use.');
        }
    });
  }
}
