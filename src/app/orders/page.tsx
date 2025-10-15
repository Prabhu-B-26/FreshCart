"use client";

import { useAuth } from "@/context/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";

// Mock data as we don't have a real orders backend
const mockOrders = [
    {
        id: 'mock-order-1678886400000',
        createdAt: new Date('2023-03-15T12:00:00Z'),
        total: 25.50,
        status: 'Delivered',
        items: [
            { name: 'Fresh Apples', quantity: 2 },
            { name: 'Whole Wheat Bread', quantity: 1 },
        ]
    },
    {
        id: 'mock-order-1678972800000',
        createdAt: new Date('2023-03-16T15:30:00Z'),
        total: 12.75,
        status: 'Processing',
        items: [
            { name: 'Organic Spinach', quantity: 1 },
            { name: 'Spaghetti Pasta', quantity: 3 },
        ]
    }
];


export default function OrdersPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading orders...</p>
    }

    if (!user) {
        return <p className="text-center p-8">Please log in to see your orders.</p>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-headline font-bold mb-8">Your Orders</h1>
            {mockOrders.length > 0 ? (
                <div className="space-y-6">
                    {mockOrders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Order #{order.id.split('-')[2]}</CardTitle>
                                    <CardDescription>{order.createdAt.toLocaleDateString()}</CardDescription>
                                </div>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                                   className={order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                >
                                    {order.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <p key={index} className="text-sm text-muted-foreground">{item.quantity} x {item.name}</p>
                                    ))}
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between font-semibold">
                                    <p>Total</p>
                                    <p>${order.total.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">No Orders Yet</h2>
                    <p className="mt-1 text-muted-foreground">You haven't placed any orders with us yet.</p>
                </div>
            )}
        </div>
    )
}
