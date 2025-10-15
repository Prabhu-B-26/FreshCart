
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/auth-provider";
import { getOrdersForUser } from '@/lib/orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                setLoading(true);
                const userOrders = await getOrdersForUser(user.uid);
                setOrders(userOrders);
                setLoading(false);
            } else {
                setOrders([]);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (authLoading || loading) {
        return <OrdersSkeleton />;
    }

    if (!user) {
        return <p className="text-center p-8">Please log in to see your orders.</p>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-headline font-bold mb-8">Your Orders</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Order #{order.id.slice(0, 7)}</CardTitle>
                                    <CardDescription>{(order.createdAt as Date).toLocaleDateString()}</CardDescription>
                                </div>
                                <Badge variant='secondary'>Processing</Badge>
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

function OrdersSkeleton() {
    return (
        <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <Skeleton className="h-7 w-40" />
                                <Skeleton className="h-4 w-24 mt-2" />
                            </div>
                             <Skeleton className="h-6 w-20" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-semibold">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
