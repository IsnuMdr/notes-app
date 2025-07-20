import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { Header } from '@/components/common/Header';
import { Toaster } from 'sonner';
import { LoadingProvider } from '@/providers/LoadingProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Note Taking App',
  description: 'A simple note taking application with sharing capabilities',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <LoadingProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main>{children}</main>
              </div>
              <Toaster />
            </LoadingProvider>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
