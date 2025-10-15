"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import { CheckCircle, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface ReceiptPageProps {
  params: { orderId: string };
}

type OrderWithDate = Omit<Order, 'createdAt'> & {
    createdAt: Date;
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const { user } = useAuth();
  const firestore = useFirestore();

  const orderRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'orders', params.orderId);
  }, [user, firestore, params.orderId]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);
  
  const typedOrder: OrderWithDate | null = order ? {
      ...order,
      createdAt: (order.createdAt as unknown as Timestamp)?.toDate() ?? new Date(),
  } : null;


  const handleDownloadPdf = () => {
    if (!typedOrder || !user) return;
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.text('GrocerEase - Order Receipt', 20, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Order ID: ${typedOrder.id}`, 20, 30);
    doc.text(`User: ${user.displayName || user.email}`, 20, 36);
    doc.text(`Date: ${typedOrder.createdAt.toLocaleString()}`, 20, 42);
    
    autoTable(doc, {
        startY: 50,
        head: [['Item', 'Quantity', 'Unit Price', 'Total']],
        body: typedOrder.items.map(item => [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ]),
        foot: [[{content: 'Total', styles: {halign: 'right'}}, '', '', `$${typedOrder.total.toFixed(2)}`]],
        theme: 'striped'
    });
    
    doc.save(`GrocerEase-Receipt-${typedOrder.id}.pdf`);
  };

  if (isLoading) {
    return <ReceiptSkeleton />;
  }
  
  if (!typedOrder) {
    return <div className="text-center p-8">Order not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-headline font-bold">Thank You For Your Order!</h1>
      <p className="text-muted-foreground mt-2">Your receipt is ready. A confirmation has been sent to your email.</p>
      
      <Card className="text-left mt-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Order ID: {typedOrder.id}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typedOrder.items.map((item, i) => (
              <div key={item.id + i} className="flex justify-between items-center">
                <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <p>Total Paid</p>
              <p>${typedOrder.total.toFixed(2)}</p>
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

function ReceiptSkeleton() {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-9 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
            
            <Card className="text-left mt-8">
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Separator className="my-4" />
                        <div className="flex justify-between font-bold text-lg">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-7 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 flex justify-center gap-4">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
            </div>
        </div>
    )
}
