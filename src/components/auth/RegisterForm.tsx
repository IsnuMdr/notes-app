'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useLoading } from '@/providers/LoadingProvider';
import { Lock, Mail, User } from 'lucide-react';
import { PasswordInput } from '../ui/password-input';

type RegisterFormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axios.post('/api/register', data);

      showLoading('Account created! Redirecting to login...');
      toast.success('Account created successfully! Please login.');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Registration failed');
      } else {
        toast.error('Registration failed');
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to start taking notes</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Choose a fullname"
                        className="pl-10"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="fullname"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your email"
                        className="pl-10"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <PasswordInput
                        placeholder="Create a password"
                        className="pl-10"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="new-password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <PasswordInput
                        placeholder="Confirm your password"
                        className="pl-10"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="new-password"
                      />
                    </div>
                  </FormControl>
                  {confirmPassword && password && confirmPassword !== password && (
                    <p className="text-sm text-red-500">Passwords don&apos;t match</p>
                  )}
                  {confirmPassword && password && confirmPassword === password && (
                    <p className="text-sm text-green-500">Passwords match</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
