import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.css']
})
export class AdminMoviesComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error: string | null = null;

  constructor(
      private movieService: MovieService, 
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.cdr.markForCheck(); // Mark specifically for OnPush compat (though unused here) verify UI updates
    
    this.movieService.getAdminMovies().subscribe({
      next: (data) => {
        console.log('AdminMovies: Loaded movies', data);
        this.movies = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (err) => {
        console.error('Error loading movies', err);
        const status = err.status || 'Unknown';
        if (status === 403) {
            this.error = `Access Denied (403). You must log in as an Admin.\nTry: admin@mediaconnect.com / admin123`;
        } else {
            this.error = `Failed to load movies (Status: ${status}). Ensure backend is running.`;
        }
        this.loading = false;
        this.cdr.detectChanges(); // Force update
      }
    });
  }

  addMovie(): void {
    this.router.navigate(['/admin/add-movie']);
  }

  editMovie(id: number): void {
    this.router.navigate(['/admin/edit-movie', id]);
  }

  deleteMovie(id: number): void {
     if (confirm('Are you sure you want to delete this movie?')) {
        this.movieService.deleteMovie(id).subscribe({
            next: () => {
                this.loadMovies(); 
            },
            error: (err) => {
                console.error('Error deleting movie', err);
                alert('Failed to delete movie');
            }
        });
    }
  }
}
