
"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const handleLoginAsAdmin = () => {
    login(true);
    router.push('/admin');
  };
  
  const handleLoginAsUser = () => {
    login(false);
    router.push('/');
  };

  return (
    <AuthLayout title="Frontend Demo" description="Log in to a mock account. No backend is active.">
      <div className="space-y-4">
        <Button onClick={handleLoginAsAdmin} className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In as Admin'}
        </Button>
        <Button onClick={handleLoginAsUser} className="w-full" variant="secondary" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In as User'}
        </Button>
      </div>
    </AuthLayout>
  );
}
