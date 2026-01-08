import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';
  private adminUrl = 'http://localhost:8080/api/admin/movies';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getTrendingMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/trending`);
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/popular`);
  }

  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/search?query=${query}`);
  }

  filterByGenre(genre: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/filter/genre?genre=${genre}`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.adminUrl, movie);
  }

  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.adminUrl}/${id}`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  getAdminMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.adminUrl);
  }

  getAvailableGenres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/genres`);
  }

  getAvailableLanguages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/languages`);
  }

  filterByLanguage(language: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/filter/language?language=${language}`);
  }
}
