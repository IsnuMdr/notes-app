import axios from 'axios';
import {
  CreateNoteRequest,
  UpdateNoteRequest,
  ShareNoteRequest,
  Note,
  NotesResponse,
} from '@/types/notes';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // Set a timeout for requests
});

interface GetNotesParams {
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}

export const notesApi = {
  // Get all notes
  getNotes: async (params: GetNotesParams = {}): Promise<NotesResponse> => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append('search', params.search);
    if (params.filter && params.filter !== 'all') searchParams.append('filter', params.filter);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `/notes?${queryString}` : '/notes';

    const response = await api.get(url);
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
