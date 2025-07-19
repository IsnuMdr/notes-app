import axios from 'axios';
import { CreateNoteRequest, UpdateNoteRequest, ShareNoteRequest, Note } from '@/types/notes';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // Set a timeout for requests
});

export const notesApi = {
  // Get all notes (private + shared)
  getNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get public notes
  getPublicNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes?public=true');
    return response.data;
  },

  // Get single note
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create note
  createNote: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  // Update note
  updateNote: async (id: string, data: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  // Share note
  shareNote: async (data: ShareNoteRequest): Promise<void> => {
    await api.post('/notes/share', data);
  },
};
