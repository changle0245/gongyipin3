import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { loadLocaleMessages } from '@/i18n/messages';
import { TranslationsProvider } from '@/i18n/translation-context';
import { isLocale } from '@/i18n/request';
import '../../globals.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

interface AdminLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default async function AdminLayout({ children, params: { locale } }: AdminLayoutProps) {
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await loadLocaleMessages(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="font-sans antialiased">
        <TranslationsProvider locale={locale} messages={messages}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
