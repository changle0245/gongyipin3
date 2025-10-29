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
    <footer className="mt-16 bg-gradient-to-b from-[#fff2c2] via-[#ffe59a] to-[#f7c54a] text-[#4b3600]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-extrabold text-[#3b2900]">GoldCrafts</h3>
            <p className="text-sm text-[#7a5b00]">{t('home.description')}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#3b2900]">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm text-[#7a5b00]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#b67900]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#3b2900]">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2 text-sm text-[#7a5b00]">
              <p>Email: gold@goldcrafts.com</p>
              <p>WeChat: goldcrafts</p>
              <p>WhatsApp: +86 123 4567 8900</p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white/70 p-4 text-center text-sm text-[#7a5b00] shadow-inner shadow-[#f7d686]/50">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
