'use client';

import type { Product } from './types';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, Firestore, setDoc } from 'firebase/firestore';

// Mock Firestore functions
export async function getProducts(db: Firestore): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProductById(db: Firestore, id: string): Promise<Product | null> {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    } else {
        return null;
    }
}

export async function addProduct(db: Firestore, product: Omit<Product, 'id'>): Promise<Product> {
    // Create a reference to a new document with a unique ID
    const newDocRef = doc(collection(db, "products"));
    
    // Use setDoc to save the product data with the new ID
    await setDoc(newDocRef, { ...product, id: newDocRef.id });

    // Return the full product object including the new ID
    return { id: newDoc_docRef.id, ...product };
}

export async function updateProduct(db: Firestore, id: string, updates: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
}

export async function deleteProduct(db: Firestore, id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
}
