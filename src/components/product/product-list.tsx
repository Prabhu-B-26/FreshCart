
"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/products';
import ProductCard from './product-card';
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton";


export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
        setIsLoading(true);
        const fetched = await getProducts();
        setProducts(fetched);
        setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (isLoading) {
      return (
          <div className="space-y-8">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="w-full max-w-lg pl-10"
                    value=""
                    disabled
                  />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for products..."
          className="w-full max-w-lg pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="flex">
                <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found for "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}
