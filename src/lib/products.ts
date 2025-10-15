
"use client";

import type { Product } from './types';
import placeholderImages from './placeholder-images.json';

// Initialize with placeholder data
let memoryProducts: Product[] = placeholderImages.placeholderImages.map(p => ({
    id: p.id,
    name: p.description,
    price: parseFloat((Math.random() * (20 - 0.5) + 0.5).toFixed(2)),
    quantity: Math.floor(Math.random() * 100),
    imageUrl: p.imageUrl,
    imageHint: p.imageHint,
}));

// Mock functions to simulate Firestore operations
export async function getProducts(): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...memoryProducts];
}

export async function getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const product = memoryProducts.find(p => p.id === id);
    return product ? { ...product } : null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newId = `prod_${Date.now()}`;
    const newProduct: Product = { ...product, id: newId };
    memoryProducts.unshift(newProduct);
    return newId;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    memoryProducts = memoryProducts.map(p => 
        p.id === id ? { ...p, ...updates } : p
    );
}

export async function deleteProduct(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    memoryProducts = memoryProducts.filter(p => p.id !== id);
}
