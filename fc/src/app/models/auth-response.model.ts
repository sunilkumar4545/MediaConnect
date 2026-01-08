export interface AuthResponse {
    token: string;
    role: string;
    userId: number;
    user: import('./user.model').User;
}
