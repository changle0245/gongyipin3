'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n/translation-context';

interface AdminTopBarProps {
  locale: string;
}

export function AdminTopBar({ locale }: AdminTopBarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace(`/${locale}/admin/login`);
    router.refresh();
  };

  const isLoginPage = pathname.endsWith('/login');

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#fbe29f] via-[#f4c36a] to-[#d6960b] text-[#422d00] shadow-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold tracking-wide text-[#422d00]">
          金耀工艺 Golden Crafts
        </Link>
        <div className="flex items-center gap-3">
          {!isLoginPage && (
            <Button
              variant="outline"
              className="border-[#fbe29f] bg-white/80 text-[#6b4700] hover:bg-white"
              onClick={() => router.push(`/${locale}/admin/upload`)}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t('auth.goToDashboard')}
            </Button>
          )}
          {isLoginPage ? (
            <Button
              variant="outline"
              className="border-[#fbe29f] bg-white/80 text-[#6b4700] hover:bg-white"
              onClick={() => router.push(`/${locale}`)}
            >
              {t('auth.backToSite')}
            </Button>
          ) : (
            <Button
              className="bg-[#7a4c00] text-white hover:bg-[#633d00]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.logout')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
