'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/i18n/translation-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, LockKeyhole } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AdminLoginFormProps {
  locale: string;
  returnTo?: string;
}

export function AdminLoginForm({ locale, returnTo }: AdminLoginFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Invalid credentials');
      }

      router.push(returnTo ?? `/${locale}/admin/upload`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#fbe49d] to-[#f5c454]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/80 p-3 text-[#b67900]">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">{t('admin.loginTitle')}</CardTitle>
              <CardDescription className="text-[#7a5b00]">
                {t('admin.loginDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="admin@example.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('admin.loggingIn')}
                </span>
              ) : (
                t('admin.loginButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-[#8c5800]">
        {t('admin.loginHint')}
      </p>
    </div>
  );
}
