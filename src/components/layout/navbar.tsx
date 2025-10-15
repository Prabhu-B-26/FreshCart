"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ShoppingCart, ClipboardList, PlusCircle, LogOut, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import React from 'react';

import { useAuth } from '@/context/auth-provider';
import { useCart } from '@/context/cart-provider';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/shared/logo';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Navbar() {
  const { user, isAdmin, loading } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home, public: true },
    { href: '/orders', label: 'Orders', icon: ClipboardList, auth: true },
    { href: '/admin/add-product', label: 'Add Product', icon: PlusCircle, admin: true },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.public) return true;
    if (link.admin) return isAdmin;
    if (link.auth) return !!user;
    return false;
  });

  const NavItems = () => (
    <>
      {filteredLinks.map(({ href, label, icon: Icon }) => (
        <Button key={href} variant="ghost" asChild>
          <Link href={href} className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo className="mr-4 hidden md:flex" />

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-4 py-4">
                <div className="px-4">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-2 px-4">
                  <NavItems />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex items-center space-x-1">
            <NavItems />
          </nav>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-1">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            {loading ? <Skeleton className="h-8 w-8 rounded-full" /> : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? "User"} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
