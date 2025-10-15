"use client";

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/products';
import ProductForm from '@/components/product/product-form';
import { useAuth } from '@/context/auth-provider';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading, user, isAdmin } = useAuth();
  const firestore = useFirestore();

  const handleSubmit = async (data: any) => {
    if (!firestore) return;
    try {
      await addProduct(firestore, { ...data, imageHint: data.name.toLowerCase() });
      toast({ title: 'Success', description: 'Product added successfully.' });
      router.push('/admin');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add product.' });
    }
  };
  
  if (loading) return <p>Loading...</p>
  if (!user || !isAdmin) {
      return <p className="text-center p-8">Access Denied. You must be an admin to view this page.</p>
  }

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
