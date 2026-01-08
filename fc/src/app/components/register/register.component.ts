import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  availableGenres: string[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary'];
  genreError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      genrePreferences: this.fb.array([], [Validators.minLength(2)])
    });
  }

  onGenreChange(event: any) {
    const genreArray: FormArray = this.registerForm.get('genrePreferences') as FormArray;
    if (event.target.checked) {
      genreArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      genreArray.controls.forEach((item: any) => {
        if (item.value == event.target.value) {
          genreArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
    const genreArray: FormArray = this.registerForm.get('genrePreferences') as FormArray;
    if (genreArray.length < 2) {
      this.genreError = true;
      return;
    }
    this.genreError = false;

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          // Redirect handled in service
        },
        error: (err) => {
          alert('Registration failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
  }
}
