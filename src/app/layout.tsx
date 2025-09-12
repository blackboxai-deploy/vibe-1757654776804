import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/contexts/GameContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LevelUp Life - Gamifikasi Personal Development',
  description: 'Transform your life journey into an RPG adventure. Track habits, complete quests, and level up your life with AI-powered insights.',
  keywords: 'habit tracking, personal development, gamification, life improvement, goals, habits',
  authors: [{ name: 'LevelUp Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1f2937',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-900 text-white min-h-screen`}>
        <GameProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster 
            position="top-right" 
            theme="dark"
            richColors
            expand={true}
          />
        </GameProvider>
      </body>
    </html>
  );
}