'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { useNote } from '@/hooks/useNotes';
import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useState } from 'react';
import { ShareDialog } from '@/components/notes/ShareDialog';

export default function NoteDetailPage() {
  const params = useParams();

  const { data: session } = useSession();
  const { data: note, isLoading, error } = useNote(params.id as string);
  const [showShareDialog, setShowShareDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-red-500">
            Note not found or you don&apos;t have permission to view it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = session?.user.id === note.authorId;

  return (
    <>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{note.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>by {note?.author?.fullname}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                  {note.updatedAt !== note.createdAt && (
                    <>
                      <span>•</span>
                      <span>
                        edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {note.isPublic && <Badge variant="secondary">Public</Badge>}
                {isOwner && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/notes/${note.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>

            {note.shares && note.shares.length > 0 && (
              <div className="mt-6">
                <Separator className="mb-4" />
                <div>
                  <h4 className="text-sm font-medium mb-2">Shared with:</h4>
                  <div className="flex flex-wrap gap-2">
                    {note.shares.map((share) => (
                      <Badge key={share.id} variant="outline">
                        {share.sharedWith.fullname}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Comments ({note.comments && note.comments.length})
          </h3>

          <div className="space-y-6">
            <CommentForm noteId={note.id} />
            <CommentList noteId={note.id} />
          </div>
        </div>
      </div>

      <ShareDialog
        noteId={note.id}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </>
  );
}
