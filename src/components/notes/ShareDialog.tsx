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
  onSuccess?: () => void; // Callback untuk refresh data
}

export function ShareDialog({ noteId, isOpen, onClose, onSuccess }: ShareDialogProps) {
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
      form.reset({ noteId, email: '' });
      onClose();
      onSuccess?.(); // Call refresh callback
    } catch (error) {
      console.error('Error sharing note:', error);
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
                    <Input
                      placeholder="Enter user email"
                      {...field}
                      disabled={shareNote.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={shareNote.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={shareNote.isPending || !form.watch('email')?.trim()}>
                {shareNote.isPending ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
