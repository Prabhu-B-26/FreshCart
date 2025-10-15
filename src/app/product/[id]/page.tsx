
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id).then(p => {
        setProduct(p);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div className="text-center">Product not found.</div>;
  }

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
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl lg:text-4xl font-headline font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold my-4">${product.price.toFixed(2)}</p>
        <p className="text-muted-foreground mb-6">
            A brief, engaging description of the product would go here. Highlighting its key features and benefits to entice the customer.
        </p>
        <div className="flex items-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" />
                Add to Cart
            </Button>
             <span className="text-sm text-muted-foreground">
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </span>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-12 w-48 mt-4" />
            </div>
        </div>
    )
}
