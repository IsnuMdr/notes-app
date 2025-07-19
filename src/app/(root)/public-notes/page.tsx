'use client';

import { usePublicNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/notes/NoteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function PublicNotesPage() {
  const router = useRouter();
  const { data: notes, isLoading, error } = usePublicNotes();

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
        <h1 className="text-3xl font-bold mb-8">Public Notes</h1>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load public notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Public Notes</h1>

      {!notes || notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No public notes available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onView={handleView} />
          ))}
        </div>
      )}
    </div>
  );
}
