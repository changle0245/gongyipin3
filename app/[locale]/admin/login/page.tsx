import type { Locale } from '@/i18n/request';

import { AdminLoginForm } from './admin-login-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLoginPage({ params: { locale } }: { params: { locale: Locale } }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#f3c572] bg-white/90 p-10 shadow-2xl backdrop-blur">
        <AdminLoginForm locale={locale} />
      </div>
    </div>
  );
}
