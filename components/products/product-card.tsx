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

/**
 * 产品卡片组件
 */
export function ProductCard({ product, locale, onAddToQuote, labels }: ProductCardProps) {
  const lang = locale as 'en' | 'zh' | 'ar';

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
      <Link href={`/${locale}/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#fff3c4]">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name[lang]}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#c2932a]">
              No Image
            </div>
          )}

          {/* 分类徽章 */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/${locale}/products/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-[#4b3600] transition-colors hover:text-[#b87f09]">
            {product.name[lang]}
          </h3>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-[#8a5b00]">
          {product.description[lang]}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#c2932a]">{labels.moq}</span>
          <span className="font-medium text-[#5c3b00]">{product.specifications.moq}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild className="flex-1" variant="outline">
          <Link href={`/${locale}/products/${product.id}`}>
            {labels.viewDetails}
          </Link>
        </Button>
        {onAddToQuote && (
          <Button
            onClick={() => onAddToQuote(product.id)}
            className="flex-1"
          >
            {labels.addToQuote}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
