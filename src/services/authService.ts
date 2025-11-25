import axios from 'axios';
import { User, LoginCredentials, RegisterData } from '../types';

const API_URL = 'http://localhost:5000';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await axios.get<User[]>(`${API_URL}/users`, {
      params: {
        email: credentials.email,
        password: credentials.password
      }
    });

    if (response.data.length === 0) {
      throw new Error('Неверный email или пароль');
    }

    const user = response.data[0];
    const token = `fake-jwt-token-${user.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }

  async register(data: RegisterData): Promise<User> {
    const existingUsers = await axios.get<User[]>(`${API_URL}/users`, {
      params: { email: data.email }
    });

    if (existingUsers.data.length > 0) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const response = await axios.post<User>(`${API_URL}/users`, data);
    const user = response.data;

    const token = `fake-jwt-token-${user.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
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
}

export default new AuthService();
