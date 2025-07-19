'use client';

import { useRouter } from 'next/navigation';
import { useCreateNote } from '@/hooks/useNotes';
import { NoteForm } from '@/components/notes/NoteForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateNotePage() {
  const router = useRouter();
  const createNote = useCreateNote();

  const handleSubmit = async (data: { title: string; content: string }) => {
    try {
      await createNote.mutateAsync(data);
      router.push('/');
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <NoteForm onSubmit={handleSubmit} isLoading={createNote.isPending} />
    </div>
  );
}
