'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { createStaticTranslator, type Messages } from './messages';
import type { Locale } from './request';

interface TranslationContextValue {
  locale: Locale;
  translate: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

interface TranslationsProviderProps {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}

export function TranslationsProvider({ locale, messages, children }: TranslationsProviderProps) {
  const value = useMemo<TranslationContextValue>(() => ({
    locale,
    translate: createStaticTranslator(messages)
  }), [locale, messages]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslations() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }

  return context.translate;
}

export function useLocale() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useLocale must be used within a TranslationsProvider');
  }

  return context.locale;
}
