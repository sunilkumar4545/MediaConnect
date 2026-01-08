export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
    genres: string;
    subscriptionStatus?: string;
    currentPlan?: string;
    subscriptionExpiry?: string;
}

export interface AuthRequest {
    email: string;
    password: string;
    fullName?: string;
    genrePreferences?: string[];
}
