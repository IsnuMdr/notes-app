import { Pagination } from '../common/Pagination';
import { NoteCard } from './NoteCard';
import { Note } from '@prisma/client';

interface NoteListProps {
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export function NoteList({ notes, pagination, searchParams }: NoteListProps) {
  if (notes.length === 0) {
    const hasFilters =
      searchParams.search || (searchParams.filter && searchParams.filter !== 'all');

    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {hasFilters ? 'No notes found with current filters.' : 'No notes found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notes Grid */}
      <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            showActions={true} // Pass prop to show/hide actions
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        currentLimit={pagination.limit}
        total={pagination.total}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        searchParams={searchParams}
      />
    </div>
  );
}
