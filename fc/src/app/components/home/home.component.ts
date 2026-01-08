import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { WatchHistoryService } from '../../services/watch-history.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { App } from '../../app';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MovieCardComponent],
  templateUrl: './home.component.html',
  styles: [`
    /* Clean background override if needed */
  `]
})
export class HomeComponent implements OnInit {
  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  searchResults: Movie[] = [];
  
  searchQuery: string = '';
  isSearching: boolean = false;

  genres: string[] = [];
  languages: string[] = [];

  continueWatching: any[] = [];
  
  constructor(
    private authService: AuthService, 
    private movieService: MovieService,
    private watchHistoryService: WatchHistoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load filter options from backend
    this.loadFilterOptions();

    if (this.authService.isAuthenticated()) {
        this.loadDashboard();
    }

    this.authService.currentUser$.subscribe(user => {
        if (user || this.authService.isAuthenticated()) {
            this.loadDashboard();
        }
    });
  }

  loadFilterOptions() {
    this.movieService.getAvailableGenres().subscribe({
      next: (data) => this.genres = data,
      error: (err) => console.error('Failed to load genres', err)
    });

    this.movieService.getAvailableLanguages().subscribe({
      next: (data) => this.languages = data,
      error: (err) => console.error('Failed to load languages', err)
    });
  }

  loadDashboard() {
    // Load Continue Watching
    const user = this.authService.currentUser();
    if (user) {
        this.watchHistoryService.getUserHistory(Number(user.userId)).subscribe({
            next: (data) => {
                // Map history to movie objects with added progress info
                this.continueWatching = data.map((h: any) => {
                    const totalSeconds = this.parseDuration(h.movie.duration);
                    return {
                        ...h.movie,
                        progress: h.progressSeconds,
                        totalDuration: totalSeconds,
                        displayProgress: `${this.formatTime(h.progressSeconds)} / ${h.movie.duration}`
                    };
                });
                this.cdr.detectChanges();
            }
        });
    }

    this.movieService.getTrendingMovies().subscribe({
        next: (data) => {
            this.trendingMovies = data;
            this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Failed to load trending', err)
    });

    this.movieService.getPopularMovies().subscribe({
        next: (data) => {
            this.popularMovies = data;
            this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Failed to load popular', err)
    });
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    return `${m}m`;
  }

  parseDuration(duration: string): number {
    if (!duration) return 0;
    let total = 0;
    const hours = duration.match(/(\d+)\s*(h|hr|hrs)/);
    const minutes = duration.match(/(\d+)\s*m/);
    
    if (hours) total += parseInt(hours[1]) * 3600;
    if (minutes) total += parseInt(minutes[1]) * 60;
    
    return total > 0 ? total : 7200; // Default to 2h if parsing fails
  }

  search() {
    if (this.searchQuery.trim()) {
      this.isSearching = true;
      this.movieService.searchMovies(this.searchQuery).subscribe(data => this.searchResults = data);
    }
  }

  clearSearch() {
    this.isSearching = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.loadDashboard();
  }

  filterGenre(event: any) {
    const genre = event.target.value;
    if (genre) {
      this.isSearching = true;
      this.searchQuery = `Genre: ${genre}`;
      this.movieService.filterByGenre(genre).subscribe(data => this.searchResults = data);
    } else {
      this.clearSearch();
    }
  }

  filterLanguage(event: any) {
    const language = event.target.value;
    if (language) {
      this.isSearching = true;
      this.searchQuery = `Language: ${language}`;
      this.movieService.filterByLanguage(language).subscribe(data => this.searchResults = data);
    } else {
      this.clearSearch();
    }
  }
}
