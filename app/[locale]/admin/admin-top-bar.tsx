'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/i18n/translation-context';
import { Button } from '@/components/ui/button';
import { LogOut, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface AdminTopBarProps {
  locale: string;
}

export function AdminTopBar({ locale }: AdminTopBarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    try {
      setPending(true);
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = `/${locale}/admin/login`;
    }
  };

  const navigation = [
    {
      href: `/${locale}/admin/upload`,
      label: t('admin.uploadNav'),
      icon: UploadCloud,
    },
  ];

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#f3d27a] bg-white/80 p-4 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-wide text-[#b67900]">{t('admin.portal')}</p>
        <h2 className="text-2xl font-semibold text-[#3b2900]">{t('admin.dashboardTitle')}</h2>
      </div>
      <div className="flex items-center gap-3">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Button
            key={href}
            asChild
            variant={pathname === href ? 'default' : 'outline'}
            className={pathname === href ? '' : 'border-[#f3d27a] text-[#8c5800]'}
          >
            <Link href={href} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </Button>
        ))}
        <Button variant="ghost" className="text-[#8c5800]" onClick={handleLogout} disabled={pending}>
          <LogOut className="mr-2 h-4 w-4" />
          {pending ? t('admin.loggingOut') : t('admin.logout')}
        </Button>
      </div>
    </div>
  );
}
