'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/i18n/translation-context';
import { ShoppingCart, Search, Menu, Shield } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-[#f4c36a]/60 bg-gradient-to-r from-[#fff3c4]/90 via-[#f8d77f]/90 to-[#f0b748]/90 backdrop-blur supports-[backdrop-filter]:bg-[#f8d77f]/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#5c3b00]">
              <span className="text-[#d6960b]">Golden</span>
              <span className="text-[#5c3b00]">Crafts</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#5c3b00]',
                  pathname === item.href
                    ? 'text-[#5c3b00]'
                    : 'text-[#8a5b00]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/search`}>
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Quote Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href={`/${locale}/quote`}>
                <ShoppingCart className="h-5 w-5" />
                {quoteCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {quoteCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />

            <Button
              variant="outline"
              className="hidden md:inline-flex border-[#fbe29f] bg-white/80 text-[#7a4c00] hover:bg-white"
              asChild
            >
              <Link href={`/${locale}/admin/login`}>
                <Shield className="mr-2 h-4 w-4" />
                {t('auth.adminPortal')}
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium px-2 py-1 rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-[#fbe7b2] text-[#5c3b00]'
                      : 'text-[#8a5b00] hover:bg-[#fdf1cc]'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={`/${locale}/admin/login`}
                className="text-sm font-medium px-2 py-2 rounded-md bg-gradient-to-r from-[#f4c36a] to-[#d6960b] text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('auth.adminPortal')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
