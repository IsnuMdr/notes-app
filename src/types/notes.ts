import { Comment } from './comments';

export interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
  comments: Comment[];
  shares: NoteShare[];
}

export interface NoteShare {
  id: string;
  noteId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith: {
    id: string;
    username: string;
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
