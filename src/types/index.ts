export interface User {
  id: string | number;
  username: string;
  email: string;
  password?: string;
}

export interface Recipe {
  id: string | number;
  title: string;
  description: string;
  ingredients: string;
  user_id: string | number;
  image_url: string;
  created_at: string;
}

export interface Comment {
  id: string | number;
  recipe_id: string | number;
  user_id: string | number;
  text: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
