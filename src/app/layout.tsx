
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { InstallPWA } from '@/components/install-pwa';

export const metadata: Metadata = {
  title: 'Please Do',
  description: 'A simple and beautiful todo list app.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#A0D2EB" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <InstallPWA />
      </body>
    </html>
  );
}
