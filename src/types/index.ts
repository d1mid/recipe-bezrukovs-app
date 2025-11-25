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
  userId: string | number;  // Изменили с user_id на userId
  image_url: string;
  created_at: string;
}

export interface Comment {
  id: string | number;
  recipeId: string | number;  // Изменили с recipe_id на recipeId
  userId: string | number;     // Изменили с user_id на userId
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
