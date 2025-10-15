import { collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";
import type { Order } from './types';

export async function createOrder(db: Firestore, userId: string, orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>): Promise<string> {
    const ordersCollection = collection(db, `users/${userId}/orders`);
    const newOrderRef = await addDoc(ordersCollection, {
        ...orderData,
        userId: userId,
        createdAt: serverTimestamp(),
    });
    return newOrderRef.id;
}
