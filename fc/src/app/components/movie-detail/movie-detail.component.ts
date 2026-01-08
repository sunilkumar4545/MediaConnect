import { Component, inject, OnDestroy, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { UserService, UserDTO } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { WatchHistoryService } from '../../services/watch-history.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class MovieDetailComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private userService = inject(UserService);
  private watchHistoryService = inject(WatchHistoryService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService); 
  movie = signal<Movie | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  private destroy$ = new Subject<void>();
  private watchProgressTimer: any;

  constructor() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const movieId = params['id'];
          if (movieId) {
            this.loading.set(true);
            this.error.set(null);
            this.movie.set(null);
            this.cdr.markForCheck();
            
            // Step 1: Check DB for subscription status
            // We use switchMap to chain: GetUser -> Check Status -> Get Movie
            return this.userService.getMe().pipe(
                switchMap((userDTO) => {
                    // Update local auth state with fresh DB data
                    const appUser: any = { ...userDTO };
                    this.authService.updateUser(appUser);

                    if (userDTO.subscriptionStatus !== 'ACTIVE') {
                        // Redirect if inactive
                        this.router.navigate(['/plans']);
                        // Return empty observable to stop flow
                        return [];
                    }

                    // Step 2: If Valid, Fetch Movie
                    return this.movieService.getMovieById(+movieId);
                })
            );
          }
          return [];
        })
      )
      .subscribe({
        next: (movie) => {
          // If we got here, user is active and movie is loaded (or empty array if redirected)
          if (movie && !Array.isArray(movie)) { 
            this.movie.set(movie as Movie);
            this.loading.set(false);
            this.cdr.markForCheck();
            if ((movie as Movie).id) {
                this.loadLastWatchPosition((movie as Movie).id!);
            }
          }
        },
        error: (error) => {
          console.error('Error loading movie:', error);
          // If it's a 401/403 from getMe(), it might land here too
          this.error.set('Failed to load movie details.');
          this.loading.set(false);
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.watchProgressTimer) clearTimeout(this.watchProgressTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLastWatchPosition(movieId: number) {
    const user = this.authService.currentUser();
    if (!user) return;

    this.watchHistoryService.getProgress(movieId).subscribe({
        next: (history) => {
            if (history && history.progressSeconds > 0) {
                setTimeout(() => {
                    const videoElement = document.querySelector('video') as HTMLVideoElement;
                    if (videoElement) {
                        videoElement.currentTime = history.progressSeconds;
                    }
                }, 500);
            }
        },
        error: (err) => console.error('Error loading progress:', err)
    });
  }

  saveProgress(event: Event) {
    if (this.watchProgressTimer) clearTimeout(this.watchProgressTimer);
    
    this.watchProgressTimer = setTimeout(() => {
        const video = event.target as HTMLVideoElement;
        this.saveProgressNow(video.currentTime);
    }, 5000);
  }

  onPause(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.saveProgressNow(video.currentTime);
  }

  onMovieEnded(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.saveProgressNow(video.duration); // Mark as watched
  }

  private saveProgressNow(seconds: number) {
    const user = this.authService.currentUser();
    const movie = this.movie();
    
    // Ensure seconds is valid number
    if (isNaN(seconds)) return;
    
    if (user && movie && movie.id) {
        this.watchHistoryService.saveProgress(movie.id!, Math.floor(seconds)).subscribe();
    }
  }

  // Helper to ensure correct video path
  getVideoUrl(path: string): string {
    if (!path) return '';
    
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // If path is already inside videos folder
    if (path.includes('/videos/') || path.includes('videos/')) {
        return path.startsWith('/') ? path : '/' + path;
    }

    // Remove leading slash if present ensuring clean append
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `/videos/${cleanPath}`;
  }
}
