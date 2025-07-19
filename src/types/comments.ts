export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  noteId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateCommentRequest {
  content: string;
  noteId?: string;
}
