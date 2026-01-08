# Postman Realtime Testing Scenario

This guide provides a step-by-step workflow to test the entire MediaConnect application, from user registration to admin management and video playback tracking.

## 1. Environment Setup

In Postman, create a new Environment with the following variable:
- `base_url`: `http://localhost:8080`
- `token`: (Leave empty, we will set this after login)

---

## 2. Authentication Flow

### Step 1: Register a New User
**Endpoint:** `POST {{base_url}}/api/auth/register`
**Description:** Creates a new user account with initial genre preferences.
**JSON Body:**
```json
{
  "email": "user@test.com",
  "password": "password123",
  "fullName": "John Doe",
  "genrePreferences": ["Action", "Sci-Fi", "Drama"]
}
```
**Expected Status:** `200 OK`
**Response:** Includes a JWT Token.

### Step 2: Login
**Endpoint:** `POST {{base_url}}/api/auth/login`
**Description:** Authenticates the user and retrieves a fresh token.
**JSON Body:**
```json
{
  "email": "user@test.com",
  "password": "password123"
}
```
**Test Action:** Copy the `accessToken` (or `token`) from the response and paste it into your Postman Environment `token` variable.

**Authorization Header for ALL subsequent requests:**
- Type: **Bearer Token**
- Token: `{{token}}`

---

## 3. User Profile & Subscription

### Step 3: Get My Profile
**Endpoint:** `GET {{base_url}}/api/users/me`
**Description:** Verifies the token works and fetches current user details.
**Expected Status:** `200 OK`

### Step 4: Subscribe to a Plan
**Endpoint:** `POST {{base_url}}/api/users/subscribe`
**Description:** Simulates a payment and activates a subscription plan.
**JSON Body:**
```json
{
  "plan": "PREMIUM"
}
```
*Valid Plans: `BASIC`, `STANDARD`, `PREMIUM`*
**Expected Status:** `200 OK`

---

## 4. Admin Privileges Setup

**Option A: Manual Database Update (For your registered user)**
1. Open your Database Management Tool.
2. Run: `UPDATE users SET role = 'ADMIN' WHERE email = 'user@test.com';`
3. **Relogin** to ensure any caching is cleared (though our system checks DB on every request).

**Option B: Use Default System Admin (Easier)**
The system automatically creates an admin user on startup.
- **Email:** `admin@mediaconnect.com`
- **Password:** `admin123`

### Step 4b: Login as Admin
**Endpoint:** `POST {{base_url}}/api/auth/login`
**JSON Body:**
```json
{
  "email": "admin@mediaconnect.com",
  "password": "admin123"
}
```
**Action:** Copy the **new token** from this response and update your Postman Environment variable `token`. **Check that `role` in response says `ADMIN`.**

---

## 5. Admin Movie Management

### Step 5: Create a New Movie
**Endpoint:** `POST {{base_url}}/api/admin/movies`
**Description:** Adds a new movie to the catalog.
**JSON Body:**
```json
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets through the use of dream-sharing technology.",
  "releaseYear": 2010,
  "duration": "2h 28m",
  "genres": "Sci-Fi,Action",
  "language": "English",
  "posterUrl": "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "videoPath": "/videos/inception.mp4"
}
```
**Expected Status:** `200 OK`
**Response:** Returns the created movie object with an `id` (e.g., `1`).

### Step 6: Create Another Movie
**Endpoint:** `POST {{base_url}}/api/admin/movies`
**JSON Body:**
```json
{
  "title": "Parasite",
  "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  "releaseYear": 2019,
  "duration": "2h 12m",
  "genres": "Drama,Thriller",
  "language": "Korean",
  "posterUrl": "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "videoPath": "/videos/parasite.mp4"
}
```

### Step 7: Update Movie Details
**Endpoint:** `PUT {{base_url}}/api/admin/movies/1`
**Description:** Fixes a typo or updates details for Movie ID 1.
**JSON Body:**
```json
{
  "title": "Inception (Updated)",
  "description": "Updated description for the movie.",
  "releaseYear": 2010,
  "duration": "2h 30m",
  "genres": "Sci-Fi,Action,Adventure",
  "language": "English",
  "posterUrl": "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "videoPath": "/videos/inception_remastered.mp4"
}
```

### Step 8: View Engagement Analytics
**Endpoint:** `GET {{base_url}}/api/admin/analytics`
**Description:** Shows how many users have watched movies (will be empty initially).

---

## 6. Content Consumption (User Actions)

### Step 9: Search Movies
**Endpoint:** `GET {{base_url}}/api/movies/search?query=Inception`
**Expected Status:** `200 OK`

### Step 10: Filter by Genre
**Endpoint:** `GET {{base_url}}/api/movies/filter/genre?genre=Sci-Fi`

### Step 11: Simluate Watching a Movie
**Endpoint:** `POST {{base_url}}/api/watch-history/save`
**Description:** Tracks that the user watched 500 seconds of Movie ID 1.
**JSON Body:**
```json
{
  "userId": 1,
  "movieId": 1,
  "seconds": 500
}
```
*Note: Replace `1` with your actual User ID (from Profile response) and Movie ID.*

### Step 12: Check User History
**Endpoint:** `GET {{base_url}}/api/watch-history/me`
**Description:** Returns the list of movies the user has watched.

### Step 13: Verify Analytics (Admin)
**Endpoint:** `GET {{base_url}}/api/admin/analytics`
**Description:** Should now show viewing data for "Inception".
