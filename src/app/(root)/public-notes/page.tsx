import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPublicNotes } from '@/lib/actions/note';
import { SearchParams } from '@/types/notes';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { NoteList } from '@/components/notes/NoteList';

export default async function PublicNotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { search, filter, page, limit } = await searchParams;

  const params = {
    search: search || '',
    filter: filter || 'all',
    page,
    limit: limit || '12',
  };

  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { notes, pagination } = await getPublicNotes({
    search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 12,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Public Notes</h1>

      <div className="space-y-6">
        <SearchAndFilter showFilterOptions={false} />
        <NoteList notes={notes} pagination={pagination} searchParams={params} />
      </div>
    </div>
  );
}
