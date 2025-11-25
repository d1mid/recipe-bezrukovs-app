import { makeAutoObservable, runInAction } from 'mobx';
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

  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await authService.login(credentials);
      runInAction(() => {
        this.currentUser = user;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при входе';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(data: RegisterData): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      console.log('AuthStore: начинаем регистрацию', data);
      const user = await authService.register(data);
      console.log('AuthStore: пользователь зарегистрирован', user);
      runInAction(() => {
        this.currentUser = user;
      });
    } catch (error: any) {
      console.error('AuthStore: ошибка регистрации', error);
      runInAction(() => {
        this.error = error.message || 'Ошибка при регистрации';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout(): void {
    authService.logout();
    this.currentUser = null;
  }
}
