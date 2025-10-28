import { type Locale } from './request';

export interface Messages {
  [key: string]: string | Messages;
}

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: async () => (await import('@/messages/en.json')).default,
  zh: async () => (await import('@/messages/zh.json')).default,
  ar: async () => (await import('@/messages/ar.json')).default
};

export async function loadLocaleMessages(locale: Locale): Promise<Messages> {
  return loaders[locale]();
}

export function createStaticTranslator(messages: Messages) {
  return (key: string): string => {
    const segments = key.split('.');
    let value: unknown = messages;

    for (const segment of segments) {
      if (typeof value === 'object' && value !== null && segment in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[segment];
      } else {
        throw new Error(`Missing translation key: ${key}`);
      }
    }

    if (typeof value !== 'string') {
      throw new Error(`Translation for key ${key} is not a string`);
    }

    return value;
  };
}

export async function getStaticTranslator(locale: Locale) {
  const messages = await loadLocaleMessages(locale);
  return createStaticTranslator(messages);
}
