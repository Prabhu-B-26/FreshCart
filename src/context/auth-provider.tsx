
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock User type, simplified from Firebase User
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (asAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: true, // Default to admin for frontend-only
  loading: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock admin user for frontend-only experience
const adminUser: MockUser = {
  uid: 'admin-user-id',
  email: 'admin@example.com',
  displayName: 'Admin User',
};

const regularUser: MockUser = {
  uid: 'regular-user-id',
  email: 'user@example.com',
  displayName: 'Regular User',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For this frontend-only version, we'll default to being logged in as an admin.
  const [user, setUser] = useState<MockUser | null>(adminUser);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = (asAdmin = true) => {
    setLoading(true);
    setTimeout(() => {
      if (asAdmin) {
        setUser(adminUser);
        setIsAdmin(true);
      } else {
        setUser(regularUser);
        setIsAdmin(false);
      }
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }, 500);
  };

  const value = { user, isAdmin, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
