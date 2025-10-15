
import type { Order } from './types';

let memoryOrders: Order[] = [];

export async function createOrder(userId: string, orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}`,
        userId: userId,
        createdAt: new Date(),
        status: 'Processing',
    };
    memoryOrders.push(newOrder);
    return newOrder.id;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return memoryOrders.filter(o => o.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrderById(userId: string, orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const order = memoryOrders.find(o => o.id === orderId && o.userId === userId);
    return order || null;
}

// Function to update order status in memory
export async function updateOrderStatus(orderId: string, status: 'Processing' | 'Delivered'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    memoryOrders = memoryOrders.map(o => o.id === orderId ? { ...o, status } : o);
}
