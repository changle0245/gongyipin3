'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/i18n/translation-context';
import { ShoppingCart, Search, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from './language-switcher';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
  quoteCount?: number;
}

export function Header({ locale, quoteCount = 0 }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('common.home'), href: `/${locale}` },
    { name: t('common.products'), href: `/${locale}/products` },
    { name: t('common.categories'), href: `/${locale}/categories` },
    { name: t('common.contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f5d17c] bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="text-2xl font-extrabold tracking-wide">
              <span className="bg-gradient-to-r from-[#d89b00] to-[#f5b400] bg-clip-text text-transparent">Gold</span>
              <span className="text-[#4b3600]">Crafts</span>
            </div>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-[#b67900]'
                    : 'text-[#7a5b00] hover:text-[#b67900]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/search`} aria-label={t('common.search')}>
                <Search className="h-5 w-5 text-[#8c5800]" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href={`/${locale}/quote`} aria-label={t('common.quote')}>
                <ShoppingCart className="h-5 w-5 text-[#8c5800]" />
                {quoteCount > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#f5b400] text-[#3b2900]">
                    {quoteCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href={`/${locale}/admin/login`} className="gap-2 text-[#8c5800]">
                <LogIn className="h-4 w-4" />
                {t('admin.loginLink')}
              </Link>
            </Button>

            <LanguageSwitcher currentLocale={locale} />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-[#8c5800]" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#f5d17c] bg-white/90 py-4 md:hidden">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-[#ffe59a] text-[#4b3600]'
                      : 'text-[#7a5b00] hover:bg-[#fff2c2]'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={`/${locale}/admin/login`}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#8c5800] hover:bg-[#fff2c2]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                {t('admin.loginLink')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
