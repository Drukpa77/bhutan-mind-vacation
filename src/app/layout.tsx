import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import Cursor from '@/components/Cursor';
import './globals.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Archivo({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Bhutan Mind Vacation — Journeys through the Kingdom of Bhutan',
  description: 'BMV Tours & Treks — a Bhutanese, family-owned travel company in Thimphu. Private journeys, festivals, treks and tailor-made routes across the Kingdom of Bhutan.'
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
        <body>
          {children}
          <Cursor />
        </body>
      </html>
    </ViewTransitions>
  );
}
