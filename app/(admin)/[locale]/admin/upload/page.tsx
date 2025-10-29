export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import AdminUploadPageClient from './AdminUploadPageClient';

export default function AdminUploadPage() {
  noStore();
  headers();
  return <AdminUploadPageClient />;
}
