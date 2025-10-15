"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useUser as useFirebaseUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

// Set admin email from environment variables
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, userError } = useFirebaseUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the logged-in user's email matches the admin email
      setIsAdmin(user.email === ADMIN_EMAIL);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (isUserLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Error loading user: {userError.message}</p>
      </div>
    )
  }

  const value = { user, isAdmin, loading: isUserLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
