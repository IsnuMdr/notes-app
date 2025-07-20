import { Comment } from './comments';

export interface NotesResponse {
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: {
    id: string;
    fullname: string;
    email: string;
  };
  comments?: Comment[];
  shares?: NoteShare[];
}

export interface NoteShare {
  id: string;
  noteId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

export interface ShareNoteRequest {
  noteId: string;
  email: string;
}

export interface SearchParams {
  search?: string;
  filter?: string;
  page?: string;
  limit?: string;
}
