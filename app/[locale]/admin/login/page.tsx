import type { Metadata } from 'next';
import { getStaticTranslator } from '@/i18n/messages';
import type { Locale } from '@/i18n/request';
import { AdminLoginForm } from './admin-login-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getStaticTranslator(locale as Locale);
  return {
    title: t('admin.loginTitle'),
  };
}

export default function AdminLoginPage({ params: { locale }, searchParams }: { params: { locale: string }; searchParams: { returnTo?: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7d9] via-[#ffe7ac] to-[#f5c454] py-16">
      <div className="container mx-auto px-4">
        <AdminLoginForm locale={locale} returnTo={searchParams?.returnTo} />
      </div>
    </div>
  );
}
