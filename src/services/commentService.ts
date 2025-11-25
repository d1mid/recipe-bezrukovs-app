import axios from 'axios';
import { Comment } from '../types';

const API_URL = 'http://localhost:5000';

class CommentService {
  async getCommentsByRecipeId(recipeId: string | number): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(
      `${API_URL}/comments?recipe_id=${recipeId}&_sort=created_at&_order=desc`
    );
    return response.data;
  }

  async createComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
    const newComment = {
      ...comment,
      created_at: new Date().toISOString()
    };
    const response = await axios.post<Comment>(`${API_URL}/comments`, newComment);
    return response.data;
  }

  async deleteComment(id: string | number): Promise<void> {
    await axios.delete(`${API_URL}/comments/${id}`);
  }
}

export default new CommentService();
