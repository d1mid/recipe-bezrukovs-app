import { makeAutoObservable, runInAction } from 'mobx';
import { Comment } from '../types';
import commentService from '../services/commentService';

export class CommentStore {
  comments: Comment[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCommentsByRecipeId(recipeId: string | number): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const comments = await commentService.getCommentsByRecipeId(recipeId);
      runInAction(() => {
        this.comments = comments;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при загрузке комментариев';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createComment(commentData: Omit<Comment, 'id' | 'created_at'>): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const newComment = await commentService.createComment(commentData);
      runInAction(() => {
        this.comments.unshift(newComment);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при создании комментария';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteComment(id: string | number): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      await commentService.deleteComment(id);
      runInAction(() => {
        this.comments = this.comments.filter(c => c.id !== id);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Ошибка при удалении комментария';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearComments(): void {
    this.comments = [];
  }
}
