'use client';

import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import DialogDeleteConfirmation from '../common/DialogDeleteConfirmation';
import { useDeleteComment } from '@/hooks/useComments';
import { useState } from 'react';

export function CommentList({ noteId }: { noteId: string }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const { data: comments, isLoading, error } = useComments(noteId);
  const deleteComment = useDeleteComment();

  const handleDeleteClick = (id: string) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      await deleteComment.mutateAsync(commentToDelete);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      // Invalidate the query and refetch the data
      deleteComment.reset();
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load comments. Please try again later.
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onDelete={handleDeleteClick} />
      ))}
      {deleteDialogOpen && (
        <DialogDeleteConfirmation
          isOpen={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Comment"
          message="Are you sure you want to delete this comment?"
        />
      )}
    </div>
  );
}
