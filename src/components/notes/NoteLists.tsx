'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useNotes, useDeleteNote } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Note } from '@/types/notes';
import DialogDeleteConfirmation from '../common/DialogDeleteConfirmation';
import { Pagination } from '../ui/pagination';
import { usePagination } from '@/hooks/usePagination';

export function NoteList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useNotes();
  const deleteNote = useDeleteNote();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const { currentPage, currentLimit, handlePageChange, handleLimitChange } = usePagination();

  const handleEdit = (note: Note) => {
    router.push(`/notes/${note.id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      await deleteNote.mutateAsync(noteToDelete);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load notes</p>
      </div>
    );
  }

  if (!data || data.notes.length === 0) {
    const hasFilters =
      searchParams.get('search') ||
      (searchParams.get('filter') && searchParams.get('filter') !== 'all');

    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {hasFilters
            ? 'No notes found with current filters.'
            : 'No notes found. Create your first note!'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={handleView}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={data.pagination.totalPages}
        currentLimit={currentLimit}
        total={data.pagination.total}
        hasNext={data.pagination.hasNext}
        hasPrev={data.pagination.hasPrev}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <DialogDeleteConfirmation
        isOpen={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
      />
    </>
  );
}
