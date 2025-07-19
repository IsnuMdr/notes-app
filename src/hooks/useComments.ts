/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateCommentRequest } from '@/types/comments';
import { toast } from 'sonner';
import { commentsApi } from '@/services/api/comments';

export function useComments(noteId: string) {
  return useQuery({
    queryKey: ['comments', noteId],
    queryFn: () => commentsApi.getComments(noteId),
    enabled: !!noteId,
    refetchInterval: 5000, // Real-time polling
    refetchIntervalInBackground: true,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => commentsApi.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.noteId] });
      queryClient.invalidateQueries({ queryKey: ['comments', variables.noteId] });

      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      console.error('Comment creation failed:', error); // Debug log
      const errorMessage = error.response?.data?.error || 'Failed to add comment';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) =>
      await commentsApi.updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Comment updated');
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments', variables] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to delete comment';
      toast.error(errorMessage);
    },
  });
}
