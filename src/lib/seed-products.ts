// This script is not part of the app runtime.
// It's a utility to seed the database.
// You would typically run this from the command line, e.g., using ts-node.
// As an AI, I am "running" it once to populate your initial data.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase/config';
import placeholderImages from './placeholder-images.json';

// IMPORTANT: This seeding function is for demonstration purposes.
// In a real-world scenario, you would have a more robust seeding strategy
// and likely run this as a separate script, not as part of the app startup.
// We are "running" this once to get initial data into your Firestore database.

export const seedProducts = async () => {
  try {
    console.log('Connecting to Firebase to seed data...');
    // Initialize a temporary Firebase app instance for the script
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Connection successful.');

    const productsCollectionRef = collection(db, 'products');

    // Check if products already exist
    const existingProducts = await getDocs(productsCollectionRef);
    if (!existingProducts.empty) {
        console.log('Products collection is not empty. Skipping seed.');
        return;
    }


    // Get a new write batch
    const batch = writeBatch(db);


    console.log('Preparing batch of products...');
    placeholderImages.placeholderImages.forEach((productData) => {
      const docRef = doc(productsCollectionRef, productData.id); // Use the ID from JSON
      const product = {
        name: productData.description,
        price: parseFloat((Math.random() * (20 - 0.5) + 0.5).toFixed(2)),
        quantity: Math.floor(Math.random() * 100),
        imageUrl: productData.imageUrl,
        imageHint: productData.imageHint,
        id: productData.id // Also store id in the document body
      };
      batch.set(docRef, product);
    });

    console.log('Committing batch...');
    await batch.commit();
    console.log('SUCCESS: Database has been seeded with initial products.');

  } catch (error) {
    console.error('ERROR: Failed to seed database.');
    console.error(error);
    // We don't want to crash the app if seeding fails, but we log the error.
  }
};
