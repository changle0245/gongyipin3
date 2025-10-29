import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  locale: string;
  onAddToQuote?: (productId: string) => void;
  labels: {
    moq: string;
    viewDetails: string;
    addToQuote: string;
  };
}

export function ProductCard({ product, locale, onAddToQuote, labels }: ProductCardProps) {
  const lang = locale as 'en' | 'zh' | 'ar';

  return (
    <Card className="group overflow-hidden border-transparent bg-gradient-to-br from-white via-[#fff7d9] to-[#ffe8a1] transition-transform hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/${locale}/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-[#fff1c6]">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name[lang]}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#b38b3c]">
              No Image
            </div>
          )}

          <div className="absolute left-4 top-4">
            <Badge className="bg-white/80 shadow-lg shadow-[#fce69a]/60">
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/${locale}/products/${product.id}`}>
          <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-[#3b2900] transition-colors hover:text-[#b67900]">
            {product.name[lang]}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-[#8c5800]">
          {product.description[lang]}
        </p>

        <div className="flex items-center justify-between text-sm text-[#6b4600]">
          <span>{labels.moq}</span>
          <span className="font-semibold text-[#b67900]">{product.specifications.moq}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 bg-[#fff2c2] p-6 pt-0">
        <Button asChild variant="outline" className="flex-1 border-transparent bg-white/80">
          <Link href={`/${locale}/products/${product.id}`}>
            {labels.viewDetails}
          </Link>
        </Button>
        {onAddToQuote && (
          <Button onClick={() => onAddToQuote(product.id)} className="flex-1">
            {labels.addToQuote}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
