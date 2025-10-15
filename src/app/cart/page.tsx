"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const handleProceedToPayment = () => {
    if (!user) {
      router.push('/login?redirect=/payment');
    } else {
      router.push('/payment');
    }
  };

  if (cartCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-headline font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6 bg-accent hover:bg-accent/90">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-bold mb-8">Your Shopping Cart</h1>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="relative h-20 w-20 rounded-md overflow-hidden">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.imageHint} />
            </div>
            <div className="flex-grow">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                className="h-8 w-14 text-center"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Separator className="my-8" />
      <div className="flex justify-end items-center">
        <div className="text-right">
          <p className="text-muted-foreground">Total</p>
          <p className="text-3xl font-bold">${totalPrice.toFixed(2)}</p>
          <Button className="mt-4 bg-accent hover:bg-accent/90" size="lg" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
