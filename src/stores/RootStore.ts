import { AuthStore } from './AuthStore';
import { RecipeStore } from './RecipeStore';

export class RootStore {
  authStore: AuthStore;
  recipeStore: RecipeStore;

  constructor() {
    this.authStore = new AuthStore();
    this.recipeStore = new RecipeStore();
  }
}
