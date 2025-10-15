"use client";

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-provider';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      imageHint: product.imageHint,
    });
  };

  return (
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="p-0">
              <div className="relative w-full aspect-[4/3]">
                  <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      data-ai-hint={product.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
              </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
              <CardTitle className="font-headline text-lg mb-1">{product.name}</CardTitle>
              <p className="text-muted-foreground text-sm">
                  ${product.price.toFixed(2)}
              </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
              </Button>
          </CardFooter>
      </Card>
  );
}
