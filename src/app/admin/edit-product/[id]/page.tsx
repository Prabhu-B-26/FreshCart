"use client";

import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getProductById, updateProduct } from '@/lib/products';
import ProductForm from '@/components/product/product-form';
import { useAuth } from '@/context/auth-provider';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { loading: authLoading, user, isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id && firestore) {
      getProductById(firestore, id)
        .then(data => {
            if (data) setProduct(data);
            else throw new Error("Product not found");
        })
        .catch(() => {
            toast({ variant: 'destructive', title: 'Error', description: 'Product not found.' });
            router.push('/admin');
        })
        .finally(() => setLoading(false));
    }
  }, [id, router, toast, firestore]);

  const handleSubmit = async (data: any) => {
    if (!firestore) return;
    try {
      await updateProduct(firestore, id, data);
      toast({ title: 'Success', description: 'Product updated successfully.' });
      router.push('/admin');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update product.' });
    }
  };
  
  if (authLoading) return <p>Loading...</p>;
  if (!user || !isAdmin) {
      return <p className="text-center p-8">Access Denied. You must be an admin to view this page.</p>;
  }
  
  if (loading) return <ProductFormSkeleton />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-headline font-bold">Edit Product</h1>
      </div>
      {product ? (
        <ProductForm initialData={product} onSubmit={handleSubmit} />
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
}

function ProductFormSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="aspect-square w-full" />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <Skeleton className="h-12 w-32" />
                </div>
            </div>
        </div>
    );
}
