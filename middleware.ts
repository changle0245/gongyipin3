import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, isLocale } from './i18n/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 允许 Next.js 静态资源与 API 请求直接通过
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (!maybeLocale || !isLocale(maybeLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api).*)']
};
