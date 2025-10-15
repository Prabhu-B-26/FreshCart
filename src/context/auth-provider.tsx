
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock User type, simplified from Firebase User
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (email: string, pass: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Mock admin user for frontend-only experience
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@gmail.com';

// Mock database for users
let mockUsers: MockUser[] = [
    { uid: 'admin-user-id', email: ADMIN_EMAIL, displayName: 'Admin User' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.email === ADMIN_EMAIL);
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    setLoading(true);
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        setIsAdmin(foundUser.email === ADMIN_EMAIL);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({ title: 'Login Successful', description: `Welcome back, ${foundUser.displayName}!` });
        router.push(foundUser.email === ADMIN_EMAIL ? '/admin' : '/');
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
      }
      setLoading(false);
    }, 500);
  };

  const register = (email: string, pass: string, name: string) => {
    setLoading(true);
    setTimeout(() => {
        if (mockUsers.some(u => u.email === email)) {
            toast({ variant: 'destructive', title: 'Registration Failed', description: 'User already exists.' });
            setLoading(false);
            return;
        }
        const newUser: MockUser = {
            uid: `user_${Date.now()}`,
            email,
            displayName: name,
        };
        mockUsers.push(newUser);
        setUser(newUser);
        setIsAdmin(false);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast({ title: 'Registration Successful', description: `Welcome, ${name}!` });
        router.push('/');
        setLoading(false);
    }, 500);
  };


  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('user');
      toast({ title: 'Logged Out' });
      router.push('/login');
      setLoading(false);
    }, 500);
  };

  const value = { user, isAdmin, loading, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
