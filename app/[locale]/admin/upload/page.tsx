import type { Locale } from '@/i18n/request';

import { AdminUploadClient } from './admin-upload-client';

type AdminUploadPageProps = {
  params: { locale: Locale };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminUploadPage({ params: { locale } }: AdminUploadPageProps) {
  return <AdminUploadClient locale={locale} />;
}
