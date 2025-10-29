'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n/translation-context';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();

  const quickLinks = [
    { name: t('common.home'), href: `/${locale}` },
    { name: t('common.products'), href: `/${locale}/products` },
    { name: t('common.categories'), href: `/${locale}/categories` },
    { name: t('common.contact'), href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#5c3b00] via-[#7a4c00] to-[#3d2900] text-[#ffe8b8]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#ffd36b]">
              Golden Crafts
            </h3>
            <p className="mb-4 text-sm">
              {t('home.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#ffd36b]">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#ffe8b8] transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#ffd36b]">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2 text-sm">
              <p>Email: info@metalcrafts.com</p>
              <p>WeChat: metalcrafts</p>
              <p>WhatsApp: +86 123 4567 8900</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#8a5b00] pt-8 text-center text-sm text-[#ffe8b8]">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
