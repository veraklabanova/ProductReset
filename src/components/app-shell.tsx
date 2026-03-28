'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import { Suspense } from 'react';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isEmbed = searchParams.get('embed') === '1';
  const isPreview = pathname === '/preview';

  if (isEmbed || isPreview) {
    return <main className="flex-1 overflow-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1 overflow-auto">{children}</main>}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}
