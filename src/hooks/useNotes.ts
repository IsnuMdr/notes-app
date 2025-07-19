import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/services/api/notes';
import { CreateNoteRequest, UpdateNoteRequest, ShareNoteRequest } from '@/types/notes';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export function useNotes() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all'; // all, my, shared, public

  return useQuery({
    queryKey: ['notes', { search, filter }],
    queryFn: () => notesApi.getNotes({ search, filter }),
  });
}

export function useMyNotes() {
  return useQuery({
    queryKey: ['notes', 'my'],
    queryFn: notesApi.getMyNotes,
  });
}

export function usePublicNotes() {
  return useQuery({
    queryKey: ['notes', 'public'],
    queryFn: notesApi.getPublicNotes,
  });
}

export function useSharedNotes() {
  return useQuery({
    queryKey: ['notes', 'shared'],
    queryFn: notesApi.getSharedNotes,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => notesApi.getNote(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => notesApi.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
      notesApi.updateNote(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
      toast.success('Note updated successfully');
    },
    onError: () => {
      toast.error('Failed to update note');
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });
}

export function useShareNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShareNoteRequest) => notesApi.shareNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note shared successfully');
    },
    onError: () => {
      toast.error('Failed to share note');
    },
  });
}
