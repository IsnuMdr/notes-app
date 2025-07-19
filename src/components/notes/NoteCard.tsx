'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareDialog } from './ShareDialog';
import { Note } from '@/types/notes';
import { Edit, Trash2, Share2, MoreHorizontal, MessageCircle, Eye } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  const { data: session } = useSession();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const isOwner = session?.user.id === note.authorId;
  const truncatedContent =
    note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                by {note.author.username} •{' '}
                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {note.isPublic && <Badge variant="secondary">Public</Badge>}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(note)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(note.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">{truncatedContent}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {note.comments.length}
              </span>
              {note.shares.length > 0 && (
                <span className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  {note.shares.length}
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => onView?.(note.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <ShareDialog
        noteId={note.id}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </>
  );
}
