import { makeAutoObservable } from 'mobx';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/authService';

export class AuthStore {
  currentUser: User | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.currentUser = authService.getCurrentUser();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const user = await authService.login(credentials);
      this.currentUser = user;
    } catch (error: any) {
      this.error = error.message || 'Ошибка при входе';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async register(data: RegisterData): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await authService.register(data);
      this.currentUser = user;
    } catch (error: any) {
      this.error = error.message || 'Ошибка при регистрации';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    authService.logout();
    this.currentUser = null;
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
