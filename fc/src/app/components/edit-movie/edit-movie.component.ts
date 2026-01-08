import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  movieForm: FormGroup;
  loading = false;
  error: string | null = null;
  id: number | null = null;

  constructor(
      private fb: FormBuilder,
      private movieService: MovieService, 
      private router: Router,
      private route: ActivatedRoute,
      private cdr: ChangeDetectorRef
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      releaseYear: [0, Validators.required],
      duration: ['', Validators.required],
      genres: ['', Validators.required],
      language: ['', Validators.required],
      posterUrl: ['', Validators.required],
      description: ['', Validators.required],
      videoPath: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('EditMovie: ID param:', idParam);
    
    if (idParam) {
        this.id = +idParam;
        if (!isNaN(this.id)) {
            this.loadMovie(this.id);
        } else {
            this.error = 'Invalid Movie ID provided.';
        }
    } else {
        this.error = 'No Movie ID provided in URL.';
    }
  }

  loadMovie(id: number): void {
      this.loading = true;
      this.error = null;
      console.log('EditMovie: Fetching movie details for ID:', id);

      this.movieService.getMovieById(id).subscribe({
          next: (data) => {
              console.log('EditMovie: Loaded data:', data);
              this.movieForm.patchValue(data);
              this.loading = false;
              this.cdr.detectChanges(); 
          },
          error: (err) => {
              console.error('EditMovie: Error fetching data', err);
              this.loading = false;
              const status = err.status;
              if (status === 404) {
                  this.error = `Movie not found (ID: ${id}).`;
              } else if (status === 403) {
                  this.error = 'Access Denied. You do not have permission to view this movie.';
              } else {
                  this.error = `Failed to load movie. Server responded with status: ${status}`;
              }
              this.cdr.detectChanges();
          }
      });
  }

  onSubmit(): void {
    if (!this.id) {
        this.error = 'Cannot update: Missing Movie ID';
        return;
    }
    
    if (this.movieForm.invalid) return;
    
    this.loading = true;
    this.error = null;
    
    this.movieService.updateMovie(this.id, this.movieForm.value).subscribe({
      next: () => {
        console.log('EditMovie: Update successful');
        this.loading = false;
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        console.error('EditMovie: Update failed', err);
        this.error = 'Failed to update movie. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
      this.router.navigate(['/admin-dashboard']);
  }
}
