import axios from 'axios';
import { User, LoginCredentials, RegisterData } from '../types';

const API_URL = 'http://localhost:5000';

// Настройка axios для автоматической отправки токена
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.url?.includes(API_URL)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('Попытка входа:', credentials.email);
      
      // json-server-auth endpoint для логина
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Ответ от сервера:', response.data);
      
      const { accessToken, user } = response.data;
      
      // Сохраняем JWT токен
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('JWT токен сохранён:', accessToken);
      
      return user;
    } catch (error: any) {
      console.error('Ошибка входа:', error.response?.data || error.message);
      
      if (error.response?.status === 400) {
        throw new Error('Неверный email или пароль');
      }
      throw new Error('Ошибка при входе');
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      console.log('Начинаем регистрацию:', { email: data.email, username: data.username });
      
      // json-server-auth endpoint для регистрации
      // Пароль будет автоматически захеширован!
      const response = await axios.post(`${API_URL}/register`, {
        email: data.email,
        password: data.password,
        username: data.username
      });

      console.log('Ответ регистрации:', response.data);

      const { accessToken, user } = response.data;
      
      // Сохраняем JWT токен
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Пользователь зарегистрирован и залогинен, токен:', accessToken);

      return user;
    } catch (error: any) {
      console.error('Ошибка регистрации:', error.response?.data || error.message);
      
      if (error.response?.status === 400) {
        throw new Error('Пользователь с таким email уже существует');
      }
      throw new Error('Ошибка при регистрации');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Проверяем срок действия JWT токена
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export default new AuthService();
