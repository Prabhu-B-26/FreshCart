
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts, deleteProduct } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/auth-provider';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have access to this page.' });
        router.push('/');
    } else if (!authLoading && user) {
        const fetchProducts = async () => {
          setLoading(true);
          const fetchedProducts = await getProducts();
          setProducts(fetchedProducts);
          setLoading(false);
        };
        fetchProducts();
    }
  }, [isAdmin, authLoading, router, toast, user]);

  const forceRerender = async () => {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
  }

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast({ title: 'Success', description: 'Product deleted successfully.' });
      forceRerender(); // Re-fetch products to update the list
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product.' });
    }
  };

  if (loading || authLoading) {
    return <p>Loading...</p>;
  }
  
  if (!isAdmin) {
      return null;
  }

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products here.</p>
        </div>
        <Button onClick={() => router.push('/admin/add-product')} className="bg-accent hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.length > 0 ? products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden md:table-cell">
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={product.quantity > 0 ? 'default' : 'destructive'}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/edit-product/${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No products found. Add one to get started!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
