import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Locale } from '@/i18n/request';

import { AdminTopBar } from '../admin-top-bar';
import { AdminUploadClient } from './admin-upload-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminUploadPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const isAuthenticated = cookies().has('admin-auth');

  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="space-y-10">
      <AdminTopBar locale={locale} />
      <AdminUploadClient locale={locale} />
    </div>
  );
}
