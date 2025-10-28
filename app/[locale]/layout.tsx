import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { loadLocaleMessages } from '@/i18n/messages';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 验证 locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 设置请求上下文中的语言环境，确保静态渲染时可以正确识别当前语言
  setRequestLocale(locale);

  // 使用按语言拆分的静态导入，彻底避免运行时从请求头解析 locale
  const messages = await loadLocaleMessages(locale as Locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header locale={locale} />
            <main className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
