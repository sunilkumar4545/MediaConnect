# API Endpoints for Postman Testing

Base URL: `http://localhost:8080` (assuming default Spring Boot port)

## Auth Controller
**Base Path:** `/api/auth`

### Register
**Method:** `POST`
**URL:** `{{base_url}}/api/auth/register`
**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```

### Login
**Method:** `POST`
**URL:** `{{base_url}}/api/auth/login`
**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
*Note: Copy the `token` from the response to use in the Authorization header (Bearer Token) for protected endpoints.*

---

## Movie Controller
**Base Path:** `/api/movies`

### Get All Movies
**Method:** `GET`
**URL:** `{{base_url}}/api/movies`

### Get Movie by ID
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/1`
*(Replace `1` with actual Movie ID)*

### Get Trending Movies
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/trending`

### Get Popular Movies
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/popular`

### Search Movies
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/search?query=action`

### Filter by Genre
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/filter/genre?genre=Action`

### Filter by Language
**Method:** `GET`
**URL:** `{{base_url}}/api/movies/filter/language?language=English`

---

## Admin Controller
**Base Path:** `/api/admin`
*Requires Admin Role Authorization*

### Get All Users
**Method:** `GET`
**URL:** `{{base_url}}/api/admin/users`

### Get All Movies (Admin View)
**Method:** `GET`
**URL:** `{{base_url}}/api/admin/movies`

### Create Movie
**Method:** `POST`
**URL:** `{{base_url}}/api/admin/movies`
**Body (JSON):**
```json
{
  "title": "New Movie",
  "description": "Description of the new movie",
  "releaseYear": 2024,
  "duration": 120,
  "genres": "Action, Sci-Fi",
  "language": "English",
  "posterUrl": "http://example.com/poster.jpg",
  "videoPath": "http://example.com/video.mp4"
}
```

### Update Movie
**Method:** `PUT`
**URL:** `{{base_url}}/api/admin/movies/1`
*(Replace `1` with actual Movie ID)*
**Body (JSON):**
```json
{
  "title": "Updated Movie Title",
  "description": "Updated description",
  "releaseYear": 2024,
  "duration": 130,
  "genres": "Action, Adventure",
  "language": "English",
  "posterUrl": "http://example.com/poster_updated.jpg",
  "videoPath": "http://example.com/video_updated.mp4"
}
```

### Delete Movie
**Method:** `DELETE`
**URL:** `{{base_url}}/api/admin/movies/1`
*(Replace `1` with actual Movie ID)*

### Get Engagement Analytics
**Method:** `GET`
**URL:** `{{base_url}}/api/admin/analytics`

---

## User Controller
**Base Path:** `/api/users`
*Requires User Authentication*

### Get Current User Profile
**Method:** `GET`
**URL:** `{{base_url}}/api/users/me`

### Update Current User Profile
**Method:** `PUT`
**URL:** `{{base_url}}/api/users/me`
**Body (JSON):**
```json
{
  "fullName": "Updated Name",
  "phoneNumber": "1234567890"
}
```

### Subscribe to Plan
**Method:** `POST`
**URL:** `{{base_url}}/api/users/subscribe`
**Body (JSON):**
```json
{
  "plan": "PREMIUM"
}
```
*(Valid plans: BASIC, STANDARD, PREMIUM)*

---

## Watch History Controller
**Base Path:** `/api/watch-history`
*Requires User Authentication*

### Save Watch Progress
**Method:** `POST`
**URL:** `{{base_url}}/api/watch-history/save`
**Body (JSON):**
```json
{
  "userId": 1,
  "movieId": 1,
  "seconds": 300
}
```

### Get User History (By ID)
**Method:** `GET`
**URL:** `{{base_url}}/api/watch-history/user/1`
*(Replace `1` with actual User ID)*

### Get My History
**Method:** `GET`
**URL:** `{{base_url}}/api/watch-history/me`

### Get Watch Progress for Specific Movie
**Method:** `GET`
**URL:** `{{base_url}}/api/watch-history/progress?userId=1&movieId=1`
