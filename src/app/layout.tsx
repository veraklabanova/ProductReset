import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'CCM v2.0 | Construction Capacity Manager',
  description: 'Produktový Reset – Construction Capacity Manager v2.0 Prototype',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full flex">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
