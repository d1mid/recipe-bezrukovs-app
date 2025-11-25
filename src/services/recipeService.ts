import axios from 'axios';
import { Recipe } from '../types';

const API_URL = 'http://localhost:5000';

class RecipeService {
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await axios.get<Recipe[]>(`${API_URL}/recipes?_sort=created_at&_order=desc`);
    return response.data;
  }

  async getRecipeById(id: string | number): Promise<Recipe> {
    const response = await axios.get<Recipe>(`${API_URL}/recipes/${id}`);
    return response.data;
  }

  async getRecipesByUserId(userId: string | number): Promise<Recipe[]> {
    const response = await axios.get<Recipe[]>(`${API_URL}/recipes?userId=${userId}&_sort=created_at&_order=desc`);
    return response.data;
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
    const newRecipe = {
      ...recipe,
      created_at: new Date().toISOString()
    };
    const response = await axios.post<Recipe>(`${API_URL}/recipes`, newRecipe);
    return response.data;
  }

  async updateRecipe(id: string | number, recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await axios.patch<Recipe>(`${API_URL}/recipes/${id}`, recipe);
    return response.data;
  }

  async deleteRecipe(id: string | number): Promise<void> {
    await axios.delete(`${API_URL}/recipes/${id}`);
  }
}

export default new RecipeService();
