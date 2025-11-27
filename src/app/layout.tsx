import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/lib/convex';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PlanningMind - AI Planner',
  description: 'AI-powered task planning and scheduling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ConvexClientProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
