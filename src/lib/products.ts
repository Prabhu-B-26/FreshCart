import type { Product } from './types';

export const mockProducts: Product[] = [
  { id: 'apple', name: 'Fresh Apples', price: 2.50, quantity: 100, imageUrl: 'https://picsum.photos/seed/apple/400/300', imageHint: 'apple fruit' },
  { id: 'banana', name: 'Ripe Bananas', price: 1.80, quantity: 150, imageUrl: 'https://picsum.photos/seed/banana/400/300', imageHint: 'banana fruit' },
  { id: 'bread', name: 'Whole Wheat Bread', price: 3.20, quantity: 50, imageUrl: 'https://picsum.photos/seed/bread/400/300', imageHint: 'bread loaf' },
  { id: 'milk', name: 'Dairy Milk', price: 4.50, quantity: 75, imageUrl: 'https://picsum.photos/seed/milk/400/300', imageHint: 'milk carton' },
  { id: 'eggs', name: 'Farm Fresh Eggs', price: 5.00, quantity: 200, imageUrl: 'https://picsum.photos/seed/eggs/400/300', imageHint: 'eggs carton' },
  { id: 'chicken', name: 'Chicken Breast', price: 9.99, quantity: 40, imageUrl: 'https://picsum.photos/seed/chicken/400/300', imageHint: 'chicken meat' },
  { id: 'spinach', name: 'Organic Spinach', price: 3.75, quantity: 60, imageUrl: 'https://picsum.photos/seed/spinach/400/300', imageHint: 'spinach vegetable' },
  { id: 'tomato', name: 'Vine Tomatoes', price: 2.80, quantity: 80, imageUrl: 'https://picsum.photos/seed/tomato/400/300', imageHint: 'tomato vegetable' },
  { id: 'cheese', name: 'Cheddar Cheese', price: 6.50, quantity: 90, imageUrl: 'https://picsum.photos/seed/cheese/400/300', imageHint: 'cheese block' },
  { id: 'pasta', name: 'Spaghetti Pasta', price: 2.25, quantity: 120, imageUrl: 'https://picsum.photos/seed/pasta/400/300', imageHint: 'pasta dry' },
  { id: 'coffee', name: 'Whole Bean Coffee', price: 12.00, quantity: 30, imageUrl: 'https://picsum.photos/seed/coffee/400/300', imageHint: 'coffee beans' },
  { id: 'orange-juice', name: 'Orange Juice', price: 4.75, quantity: 55, imageUrl: 'https://picsum.photos/seed/juice/400/300', imageHint: 'orange juice' },
];

// Mock Firestore functions
export async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from Firestore
  return Promise.resolve(mockProducts);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return Promise.resolve(mockProducts.find(p => p.id === id));
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { ...product, id: new Date().toISOString() };
    mockProducts.push(newProduct);
    console.log("Added product:", newProduct);
    return Promise.resolve(newProduct);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    mockProducts[index] = { ...mockProducts[index], ...updates };
    console.log("Updated product:", mockProducts[index]);
    return Promise.resolve(mockProducts[index]);
}
