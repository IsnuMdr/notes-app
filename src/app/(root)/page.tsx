import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getNotesServerSide } from '@/lib/actions/note';
import { SearchParams } from '@/types/notes';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { NoteList } from '@/components/notes/NoteList';

export default async function DashboardPage({
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

  if (!session) {
    redirect('/login');
  }

  const { notes, pagination } = await getNotesServerSide({
    search,
    filter,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 12,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.fullname}!</p>
        </div>
        <Button asChild>
          <Link href="/notes/create">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <SearchAndFilter />
        <NoteList notes={notes} pagination={pagination} searchParams={params} />
      </div>
    </div>
  );
}
