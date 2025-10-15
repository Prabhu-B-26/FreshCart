"use client";

import { useEffect, useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { useAuth } from '@/context/auth-provider';
import ProductCard from './product-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function RecommendedProducts() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  
  // This is a placeholder effect to track browsing history.
  // In a real app, this would be triggered on product detail pages.
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
    if (history.length === 0) {
        localStorage.setItem('browsingHistory', JSON.stringify(['eggs', 'cheese']));
    }
  },[])


  useEffect(() => {
    async function fetchRecommendations() {
      if (!user || !firestore) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // In a real app, fetch purchase history from user's orders in Firestore
        const purchaseHistory: string[] = ['milk', 'bread']; 
        
        const browsingHistory: string[] = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
        
        const recommendationInput = {
          userId: user.uid,
          purchaseHistory,
          browsingHistory
        };
        
        const result = await getPersonalizedRecommendations(recommendationInput);
        
        if (result.recommendedProducts.length > 0) {
            const productsRef = collection(firestore, 'products');
            const q = query(productsRef, where('id', 'in', result.recommendedProducts.slice(0, 10)));
            const querySnapshot = await getDocs(q);
            const recommendedProducts = querySnapshot.docs.map(doc => doc.data() as Product);
            setRecommendations(recommendedProducts.slice(0, 4));
        }

      } catch (error) {
        console.error("Failed to get recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [user, firestore]);

  if (loading || recommendations.length === 0 || !user) {
    return null; // The suspense fallback in page.tsx will handle loading state
  }

  return (
    <div>
      <h2 className="text-3xl font-headline font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
