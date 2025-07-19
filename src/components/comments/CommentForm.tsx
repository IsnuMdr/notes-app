'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/lib/validations';
import { useCreateComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

interface CommentFormProps {
  noteId: string;
}

export function CommentForm({ noteId }: CommentFormProps) {
  const createComment = useCreateComment();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });
  const onSubmit = async (data: { content: string }) => {
    const commentData = {
      ...data,
      noteId,
    };

    try {
      await createComment.mutateAsync(commentData);
      form.reset();
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error('Failed to post comment. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write a comment..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createComment.isPending || !form.watch('content')?.trim()}>
          {createComment.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </Form>
  );
}
