'use client';

import { useParams, useRouter } from 'next/navigation';
import { useNote, useUpdateNote } from '@/hooks/useNotes';
import { NoteForm } from '@/components/notes/NoteForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UpdateNoteRequest } from '@/types/notes';

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { data: note, isLoading } = useNote(params.id as string);
  const updateNote = useUpdateNote();

  const handleSubmit = async (data: UpdateNoteRequest) => {
    try {
      await updateNote.mutateAsync({ id: params.id as string, data });
      router.push(`/notes/${params.id}`);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-red-500">
            Note not found or you don&apos;t have permission to edit it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/notes/${note.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Note
          </Link>
        </Button>
      </div>

      <NoteForm note={note} onSubmit={handleSubmit} isLoading={updateNote.isPending} />
    </div>
  );
}
