import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../types';
import recipeService from '../services/recipeService';

export class RecipeStore {
  recipes: Recipe[] = [];
  currentRecipe: Recipe | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRecipes(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const recipes = await recipeService.getAllRecipes();
      runInAction(() => {
        this.recipes = recipes;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при загрузке рецептов';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchRecipeById(id: string | number): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const recipe = await recipeService.getRecipeById(id);
      runInAction(() => {
        this.currentRecipe = recipe;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при загрузке рецепта';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchUserRecipes(userId: string | number): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const recipes = await recipeService.getRecipesByUserId(userId);
      runInAction(() => {
        this.recipes = recipes;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при загрузке рецептов';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createRecipe(recipeData: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
    this.isLoading = true;
    this.error = null;

    try {
      const newRecipe = await recipeService.createRecipe(recipeData);
      runInAction(() => {
        this.recipes.unshift(newRecipe);
      });
      return newRecipe;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при создании рецепта';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateRecipe(id: string | number, recipeData: Partial<Recipe>): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const updatedRecipe = await recipeService.updateRecipe(id, recipeData);
      runInAction(() => {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
        }
        if (this.currentRecipe?.id === id) {
          this.currentRecipe = updatedRecipe;
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при обновлении рецепта';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteRecipe(id: string | number): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      await recipeService.deleteRecipe(id);
      runInAction(() => {
        this.recipes = this.recipes.filter(r => r.id !== id);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при удалении рецепта';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearCurrentRecipe(): void {
    this.currentRecipe = null;
  }
}
