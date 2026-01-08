export interface WatchHistory {
    id?: number;
    userId: number;
    movieId: number;
    watchedSeconds: number;
    lastWatched?: string; // ISO Date string
}
