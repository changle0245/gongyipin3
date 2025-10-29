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

  // 每个分类显示最多4个产品
  const featuredProducts = products.slice(0, 12);
  const productCardLabels = {
    moq: t('product.moq'),
    viewDetails: t('common.viewDetails'),
    addToQuote: t('common.addToQuote')
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f9e39a] via-[#f4c36a] to-[#d6960b] py-20 text-[#422d00]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl text-[#3f2c00]">
              {t('home.title')}
            </h1>
            <p className="mb-4 text-xl text-[#6b4700] md:text-2xl">
              {t('home.subtitle')}
            </p>
            <p className="mb-8 text-lg text-[#7a5b00]">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-[#7a4c00] hover:bg-[#fff5d4]">
                <Link href={`/${locale}/products`}>
                  {t('common.products')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-[#422d00] hover:bg-white/30">
                <Link href={`/${locale}/contact`}>
                  {t('common.contact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#fff5dc]/80 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#4b3600]">{t('home.browseByCategory')}</h2>
            <p className="text-[#8a5b00]">{t('home.allCategories')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group"
              >
                <div className="rounded-2xl border border-[#f3c572] bg-white/90 p-6 text-center transition-shadow hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0c9] text-2xl text-[#c2932a] transition-all group-hover:bg-[#d6960b] group-hover:text-white">
                    🏺
                  </div>
                  <h3 className="mb-2 font-semibold text-[#4b3600]">
                    {category.name[locale as 'en' | 'zh' | 'ar']}
                  </h3>
                  <p className="text-sm text-[#8a5b00] line-clamp-2">
                    {category.description[locale as 'en' | 'zh' | 'ar']}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-[#4b3600]">{t('home.featuredProducts')}</h2>
              <p className="text-[#8a5b00]">
                {products.length}+ {t('common.products')}
              </p>
            </div>
            <Button asChild variant="outline">
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
            <div className="text-center py-12">
              <div className="mb-4 text-[#e5b347]">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-[#7a5b00]">No products available yet</p>
              <p className="mt-2 text-sm text-[#8a5b00]">
                Upload products through the admin panel to get started
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#5c3b00] via-[#7a4c00] to-[#3d2900] py-16 text-[#ffe8b8]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#ffd36b]">
            Ready to Start Your Order?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-[#ffe8b8]">
            Contact us today for a free quote. We&apos;re here to help you find the perfect metal craft products for your needs.
          </p>
          <Button size="lg" asChild className="bg-[#ffd36b] text-[#3d2900] hover:bg-[#f4c36a]">
            <Link href={`/${locale}/quote`}>
              Request a Quote
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
