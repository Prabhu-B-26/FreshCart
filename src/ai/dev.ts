import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-product-recommendations.ts';
import { seedProducts } from '@/lib/seed-products';

// Call this to seed products if the database is empty.
// Make sure to only run this once or you will get duplicate products.
seedProducts();
