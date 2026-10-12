import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tassio Batista',
  description: 'Writing about AI, product management, and software.',
  metadataBase: new URL('https://tassiobatista.co'),
  openGraph: {
    siteName: 'Tassio Batista',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="14380690-e7a0-4aad-be11-ace2a2c214f2" />
      </head>
      <body className="font-sans min-h-screen bg-white text-slate-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
