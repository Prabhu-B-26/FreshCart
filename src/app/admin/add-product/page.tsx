
"use client";

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/products';
import ProductForm from '@/components/product/product-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await addProduct({ ...data, imageHint: data.name.toLowerCase() });
      toast({ title: 'Success', description: 'Product added successfully.' });
      router.push('/admin');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add product.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-headline font-bold">Add New Product</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
