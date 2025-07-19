import axios from 'axios';
import { CreateCommentRequest, Comment } from '@/types/comments';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // Set a timeout for requests
});

export const commentsApi = {
  // Create comment
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Get comments for a note
  getComments: async (noteId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments?noteId=${noteId}`);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.put(`/comments?commentId=${commentId}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments?commentId=${commentId}`);
  },
};
