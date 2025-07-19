'use client';

import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/notes/NoteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/usePagination';

export default function SharedNotesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useNotes({
    filter: 'shared',
  });
  const { currentPage, currentLimit, handlePageChange, handleLimitChange } = usePagination();

  const handleView = (id: string) => {
    router.push(`/notes/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Public Notes</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Shared Notes</h1>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load shared notes</p>
        </div>
      </div>
    );
  }

  if (!data || data.notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No shared notes available. Check back later or create your own notes!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shared Notes</h1>

      {!data.notes || data.notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No shared notes available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.notes.map((note) => (
            <NoteCard key={note.id} note={note} onView={handleView} />
          ))}
        </div>
      )}

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
    </div>
  );
}
