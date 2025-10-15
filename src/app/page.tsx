import { getProducts } from '@/lib/products';
import ProductList from '@/components/product/product-list';
import RecommendedProducts from '@/components/product/recommended-products';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-headline font-bold mb-2">Our Products</h1>
        <p className="text-lg text-muted-foreground">Fresh groceries delivered to your door.</p>
      </div>
      
      <ProductList products={products} />

      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <RecommendedProducts />
      </Suspense>
    </div>
  );
}

function RecommendedProductsSkeleton() {
  return (
    <div>
      <h2 className="text-3xl font-headline font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        ))}
      </div>
    </div>
  );
}
