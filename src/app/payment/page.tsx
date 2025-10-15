"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  cardholderName: z.string().min(2, { message: "Name is too short." }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits." }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid format. Use MM/YY." }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
});

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in to place an order." });
      setIsLoading(false);
      return;
    }

    // Simulate payment processing and order saving
    setTimeout(async () => {
      try {
        // In a real app, you would save the order to Firestore here.
        const orderId = `mock-order-${Date.now()}`;
        console.log("Order placed:", {
          orderId,
          userId: user.uid,
          userEmail: user.email,
          items: cartItems,
          total: totalPrice,
          createdAt: Date.now(),
        });
        
        clearCart();
        toast({ title: "Payment Successful!", description: "Your order has been placed." });
        router.push(`/receipt/${orderId}`);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Order failed",
          description: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 2000); // 2-second delay to simulate network request
  }
  
  if (!user) {
    // This is a fallback. A protected route HOC or middleware is better.
    return <div className="text-center p-8">Please log in to proceed with payment.</div>
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-4">Payment Details</h1>
        <p className="text-muted-foreground mb-8">Enter your payment information to complete the purchase.</p>
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John M. Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1111222233334444" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 mt-4" disabled={isLoading}>
                  {isLoading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">Order Summary</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-right">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
