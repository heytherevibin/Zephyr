import { apiService } from './api';
import { User, Settings } from '../types';

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: File;
  settings?: Partial<Settings>;
}

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/users/me');
    return response.data;
  }

  public async updateUser(data: UpdateUserData): Promise<User> {
    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
    }
    
    if (data.email) {
      formData.append('email', data.email);
    }
    
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    if (data.settings) {
      formData.append('settings', JSON.stringify(data.settings));
    }

    const response = await apiService.put<User>('/users/me', formData);
    return response.data;
  }

  public async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await apiService.put<Settings>('/users/me/settings', settings);
    return response.data;
  }

  public async getSettings(): Promise<Settings> {
    const response = await apiService.get<Settings>('/users/me/settings');
    return response.data;
  }

  public async deleteAccount(): Promise<void> {
    await apiService.delete('/users/me');
  }
}

export const userService = UserService.getInstance(); 