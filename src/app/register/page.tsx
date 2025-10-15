
"use client";

import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthLayout title="Registration Disabled" description="This is a frontend-only demo.">
        <div className='text-center space-y-4'>
            <p className="text-muted-foreground">
                User registration is not available because the backend has been removed. 
                You can use the mock login page to simulate being a user or an admin.
            </p>
            <Button asChild>
                <Link href="/login">
                    Go to Login
                </Link>
            </Button>
        </div>
    </AuthLayout>
  );
}
