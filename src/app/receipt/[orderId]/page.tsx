"use client"; // Needs to be client for jsPDF and hooks

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { CheckCircle, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '@/context/cart-provider';

interface ReceiptPageProps {
  params: { orderId: string };
}

// Mock order data since we can't fetch from Firestore
interface MockOrder {
  id: string;
  userEmail: string | null;
  items: CartItem[];
  total: number;
  createdAt: number;
}


export default function ReceiptPage({ params }: ReceiptPageProps) {
  const { user } = useAuth();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const { cartItems, totalPrice } = useCart(); // Get cart state from before it was cleared

  useEffect(() => {
    // In a real app, you would fetch order details from Firestore using params.orderId
    // For this mock, we'll reconstruct the order from what we can
    if (user) {
        // This is a hack for the demo. We are using the cart state from before it was cleared
        // This won't work if the user refreshes the page. A real app would persist this server-side.
        const lastOrderItems = JSON.parse(localStorage.getItem('lastOrderItems') || '[]');
        const lastOrderTotal = JSON.parse(localStorage.getItem('lastOrderTotal') || '0');

        const mockOrderData: MockOrder = {
            id: params.orderId,
            userEmail: user.email,
            items: lastOrderItems,
            total: lastOrderTotal,
            createdAt: Date.now(),
        };
        setOrder(mockOrderData);
    }
  }, [user, params.orderId]);

  // Save the cart items to local storage before it's cleared on the payment page.
  // This is a hack.
  useEffect(() => {
      if(cartItems.length > 0) {
        localStorage.setItem('lastOrderItems', JSON.stringify(cartItems));
        localStorage.setItem('lastOrderTotal', JSON.stringify(totalPrice));
      }
  }, [cartItems, totalPrice])

  const handleDownloadPdf = () => {
    if (!order || !user) return;
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.text('GrocerEase - Order Receipt', 20, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`User: ${user.displayName || user.email}`, 20, 36);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 42);
    
    autoTable(doc, {
        startY: 50,
        head: [['Item', 'Quantity', 'Unit Price', 'Total']],
        body: order.items.map(item => [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ]),
        foot: [[{content: 'Total', styles: {halign: 'right'}}, '', '', `$${order.total.toFixed(2)}`]],
        theme: 'striped'
    });
    
    doc.save(`GrocerEase-Receipt-${order.id}.pdf`);
  };

  if (!order) {
    return <div className="text-center p-8">Loading receipt...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-headline font-bold">Thank You For Your Order!</h1>
      <p className="text-muted-foreground mt-2">Your receipt is ready. A confirmation has been sent to your email.</p>
      
      <Card className="text-left mt-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <p>Total Paid</p>
              <p>${order.total.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={handleDownloadPdf}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
}
