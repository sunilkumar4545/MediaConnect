export interface Movie {
    id?: number;
    title: string;
    releaseYear: number;
    duration: string;
    genres: string;
    language: string;
    posterUrl: string;

    views?: number;
    description?: string;
    videoPath: string;
    
    // Optional fields for history/progress
    progress?: number;
    totalDuration?: number; // duration in seconds
    lastWatched?: string;
    displayProgress?: string;
}
