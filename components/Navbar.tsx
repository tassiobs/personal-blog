'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthToken, setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navLink = 'px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50';

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/lib/api');
      await signOut();
    } catch {
      setAuthToken(null);
    }
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm tracking-tight">
          Tassio Batista
        </Link>

        <nav className="flex items-center gap-1">
          {/* Public links */}
          <Link href="/" className={navLink}>Writing</Link>
          <Link href="/topics" className={navLink}>Topics</Link>
          <Link href="/about" className={navLink}>About</Link>

          {/* Admin links — only when signed in */}
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className={navLink}>Dashboard</Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-600">
                Sign Out
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
