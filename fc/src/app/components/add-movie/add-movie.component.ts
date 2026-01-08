import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  movieForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      releaseYear: [new Date().getFullYear(), Validators.required],
      duration: ['', Validators.required],
      genres: ['', Validators.required],
      language: ['', Validators.required],
      posterUrl: ['', Validators.required],
      description: ['', Validators.required],
      videoPath: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.movieForm.invalid) return;

    this.loading = true;
    this.movieService.createMovie(this.movieForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin-dashboard']); 
      },
      error: (err) => {
        console.error('Error adding movie', err);
        this.error = 'Failed to add movie';
        this.loading = false;
      }
    });
  }

  cancel(): void {
      this.router.navigate(['/admin-dashboard']);
  }
}

