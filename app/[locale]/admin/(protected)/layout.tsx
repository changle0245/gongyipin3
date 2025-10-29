import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Locale } from '@/i18n/request';
import { AdminTopBar } from '../admin-top-bar';

export default function ProtectedAdminLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const hasAuth = cookies().has('admin-auth');

  if (!hasAuth) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7d9] via-[#ffe59a] to-[#f5c454] p-6">
      <div className="container mx-auto">
        <AdminTopBar locale={locale} />
        {children}
      </div>
    </div>
  );
}
