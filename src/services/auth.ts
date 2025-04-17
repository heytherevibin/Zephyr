import { apiService } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    // Check for stored token on initialization
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiService.setToken(token);
        this.getCurrentUser().catch(() => {
          this.logout();
        });
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data) {
      this.setAuthData(response.data);
    }
    
    return response.data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    
    if (response.data) {
      this.setAuthData(response.data);
    }
    
    return response.data;
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    apiService.clearToken();
    localStorage.removeItem('auth_token');
  }

  public async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await apiService.get<User>('/auth/me');
      if (response.data) {
        this.currentUser = response.data;
        return this.currentUser;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }

    return null;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  private setAuthData(data: AuthResponse): void {
    this.currentUser = data.user;
    apiService.setToken(data.token);
    localStorage.setItem('auth_token', data.token);
  }
}

export const authService = AuthService.getInstance(); 