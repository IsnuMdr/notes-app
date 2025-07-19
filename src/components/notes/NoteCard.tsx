'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShareDialog } from './ShareDialog';
import { useDeleteNote } from '@/hooks/useNotes';
import { Edit, Trash2, Share2, MoreHorizontal, MessageCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Note } from '@/types/notes';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export function NoteCard({ note, showActions = true, variant = 'default' }: NoteCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const deleteNote = useDeleteNote();

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = session?.user.id === note.authorId;

  const truncatedContent =
    variant === 'compact'
      ? note.content.length > 100
        ? note.content.substring(0, 100) + '...'
        : note.content
      : note.content.length > 150
      ? note.content.substring(0, 150) + '...'
      : note.content;

  const handleEdit = () => {
    if (!isOwner) {
      toast.error('You can only edit your own notes');
      return;
    }
    router.push(`/notes/${note.id}/edit`);
  };

  const handleDeleteClick = () => {
    if (!isOwner) {
      toast.error('You can only delete your own notes');
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNote.mutateAsync(note.id);
      setShowDeleteDialog(false);
      // Refresh the page to update server-side data
      router.refresh();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleShare = () => {
    if (!isOwner) {
      toast.error('You can only share your own notes');
      return;
    }
    setShowShareDialog(true);
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${variant === 'compact' ? 'h-fit' : ''}`}>
        <CardHeader className={variant === 'compact' ? 'pb-2' : 'pb-3'}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle
                className={`line-clamp-1 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}
              >
                {note.title}
              </CardTitle>
              <p
                className={`text-muted-foreground mt-1 ${
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                }`}
              >
                by {note?.author?.username} •{' '}
                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                {note.updatedAt !== note.createdAt && <span className="ml-1">(edited)</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {note.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  Public
                </Badge>
              )}
              {note.shares && note.shares.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Shared
                </Badge>
              )}
              {showActions && isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeleteClick}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className={variant === 'compact' ? 'pt-0 pb-3' : 'pt-0'}>
          <p
            className={`text-muted-foreground mb-4 ${
              variant === 'compact' ? 'text-xs' : 'text-sm'
            }`}
          >
            {truncatedContent}
          </p>

          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 text-muted-foreground ${
                variant === 'compact' ? 'text-xs' : 'text-sm'
              }`}
            >
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {note.comments?.length || 0}
              </span>
              {note.shares && note.shares.length > 0 && (
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {note.shares.length}
                </span>
              )}
            </div>

            <Link href={`/notes/${note.id}`}>
              <Button
                variant="outline"
                size={variant === 'compact' ? 'sm' : 'sm'}
                className={variant === 'compact' ? 'h-7 text-xs' : ''}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      {showActions && (
        <ShareDialog
          noteId={note.id}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          onSuccess={() => router.refresh()} // Refresh to update server data
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note &quot;{note.title}
              &quot; and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteNote.isPending}
            >
              {deleteNote.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
