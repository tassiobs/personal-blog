'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthToken, setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      // Still clear token even if API call fails
      setAuthToken(null);
    }
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm tracking-tight"
        >
          Tassio Batista
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
          >
            Writing
          </Link>

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
              >
                Profile
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-600">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-slate-600">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
