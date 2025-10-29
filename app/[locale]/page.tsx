import { getAllProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getStaticTranslator } from '@/i18n/messages';
import { type Locale } from '@/i18n/request';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getStaticTranslator(locale as Locale);
  const products = getAllProducts();
  const categories = getCategories();

  const featuredProducts = products.slice(0, 12);
  const productCardLabels = {
    moq: t('product.moq'),
    viewDetails: t('common.viewDetails'),
    addToQuote: t('common.addToQuote')
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ffefc1] via-[#ffe29a] to-[#f5c454] py-20 text-[#4b3600]">
        <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto mb-6 bg-white/70 text-[#b67900]">{t('home.subtitle')}</Badge>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              {t('home.title')}
            </h1>
            <p className="mb-4 text-xl text-[#7a5b00]">
              {t('home.description')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="shadow-lg shadow-[#f7d686]/60">
                <Link href={`/${locale}/products`}>
                  {t('common.products')}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-[#f3d27a] bg-white/60 text-[#8c5800] backdrop-blur hover:bg-white/80"
              >
                <Link href={`/${locale}/contact`}>
                  {t('common.contact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff7d9] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#3b2900]">{t('home.browseByCategory')}</h2>
            <p className="text-[#8c5800]">{t('home.allCategories')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group"
              >
                <div className="rounded-3xl border border-[#f3d27a] bg-white/80 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0bd] text-2xl text-[#b67900] transition group-hover:bg-[#f5c454] group-hover:text-[#3b2900]">
                    🏺
                  </div>
                  <h3 className="mb-2 font-semibold text-[#4b3600]">
                    {category.name[locale as 'en' | 'zh' | 'ar']}
                  </h3>
                  <p className="text-sm text-[#8c5800]">
                    {category.description[locale as 'en' | 'zh' | 'ar']}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-[#3b2900]">{t('home.featuredProducts')}</h2>
              <p className="text-[#8c5800]">
                {products.length}+ {t('common.products')}
              </p>
            </div>
            <Button asChild variant="outline" className="border-[#f3d27a] bg-white/70 text-[#8c5800]">
              <Link href={`/${locale}/products`}>
                {t('common.viewDetails')}
              </Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  labels={productCardLabels}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#f3d27a] bg-white/70 py-12 text-center">
              <div className="mb-4 text-[#d89b00]">
                <Search className="mx-auto h-16 w-16" />
              </div>
              <p className="text-lg font-medium text-[#4b3600]">No products available yet</p>
              <p className="mt-2 text-sm text-[#8c5800]">
                Upload products through the admin panel to get started
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#fbe49d] via-[#f7c54a] to-[#f0aa00] py-16 text-[#3b2900]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[#5b3d00]">
            {t('home.ctaDescription')}
          </p>
          <Button size="lg" asChild className="bg-[#3b2900] text-[#fbe49d] hover:bg-[#2c1e00]">
            <Link href={`/${locale}/quote`}>
              {t('common.requestQuote')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
