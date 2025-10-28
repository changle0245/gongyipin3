import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
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
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 设置请求上下文中的语言环境，确保静态渲染时可以正确识别当前语言
  setRequestLocale(locale);

  // 显式传入 locale 获取文案，避免在静态构建时依赖请求头
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
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
