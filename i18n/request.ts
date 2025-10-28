import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 支持的语言
export const locales = ['en', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ar: 'العربية'
};

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的 locale 参数
  if (!locales.includes(locale as Locale)) notFound();

  return {
    // 显式返回 locale，避免后续版本的 next-intl 报告缺失
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
