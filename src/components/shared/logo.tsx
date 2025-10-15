
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="p-1.5 bg-primary rounded-md">
        <Leaf className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold font-headline text-foreground">FreshCart</span>
    </Link>
  );
}
