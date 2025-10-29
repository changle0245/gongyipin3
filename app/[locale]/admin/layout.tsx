import type { ReactNode } from 'react';

import { AdminTopBar } from './admin-top-bar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7e1] via-[#ffe9b6] to-[#fff5dc]">
      <AdminTopBar locale={locale} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
