import { AuthStore } from './AuthStore';
import { RecipeStore } from './RecipeStore';
import { CommentStore } from './CommentStore';

export class RootStore {
  authStore: AuthStore;
  recipeStore: RecipeStore;
  commentStore: CommentStore;

  constructor() {
    this.authStore = new AuthStore();
    this.recipeStore = new RecipeStore();
    this.commentStore = new CommentStore();
  }
}
