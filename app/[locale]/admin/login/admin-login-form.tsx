'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/i18n/translation-context';
import type { Locale } from '@/i18n/request';

interface AdminLoginFormProps {
  locale: Locale;
}

export function AdminLoginForm({ locale }: AdminLoginFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError(t('auth.invalidCredentials'));
        return;
      }

      const redirect = searchParams.get('redirect');
      router.replace(redirect ?? `/${locale}/admin/upload`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#fbe29f] to-[#e5a418] text-white shadow-lg">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[#4b3600]">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-sm text-[#7a5b00]">
            {t('auth.loginSubtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="username" className="text-[#4b3600]">
            {t('auth.username')}
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={t('auth.usernamePlaceholder')}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="text-[#4b3600]">
            {t('auth.password')}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 rounded-md border border-[#f4c06a] bg-[#fff5dd] px-4 py-3 text-sm text-[#8a5b00]">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#f4c06a] to-[#d6960b] text-white shadow-lg hover:from-[#eeb243] hover:to-[#c28105]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('auth.loggingIn')}
          </span>
        ) : (
          t('auth.signIn')
        )}
      </Button>
    </form>
  );
}
