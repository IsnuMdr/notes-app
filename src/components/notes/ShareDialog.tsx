'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shareSchema } from '@/lib/validations';
import { useShareNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface ShareDialogProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ noteId, isOpen, onClose }: ShareDialogProps) {
  const shareNote = useShareNote();

  const form = useForm({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      noteId,
      email: '',
    },
  });

  const onSubmit = async (data: { noteId: string; email: string }) => {
    try {
      await shareNote.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to share note:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={shareNote.isPending}>
                {shareNote.isPending ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
