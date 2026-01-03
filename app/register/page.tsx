'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('auth/register', { email, password, displayName: fullName.trim() });
      const nextPath = response?.user?.studioStatus === 'ONBOARDING' ? '/onboarding' : '/dashboard';
      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-weak-50 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.55),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(120,98,70,0.08),transparent_35%)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-center">
        <Card className="w-full max-w-md border border-stroke-soft-200 bg-bg-white-0 shadow-lg">
          <CardContent className="p-7 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-text-sub-600">Studio Manager</p>
                <h1 className="text-2xl font-semibold leading-tight text-text-strong-950 sm:text-3xl">
                  Create your studio account
                </h1>
                <p className="text-sm text-text-sub-600">
                  Start managing clients, uploads, and share links in one place.
                </p>
              </div>

              {googleEnabled && (
                <div className="space-y-3">
                  <Button asChild variant="outline" className="h-11 w-full">
                    <a href="/api/auth/google">Continue with Google</a>
                  </Button>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-sub-600">
                    <span className="h-px flex-1 bg-stroke-soft-200" />
                    or
                    <span className="h-px flex-1 bg-stroke-soft-200" />
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Boluwatife Omotoyinbo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                  />
                </div>

                {error && (
                  <div className="rounded-md border border-error-base/30 bg-error-base/10 px-3 py-2 text-sm text-error-base">
                    {error}
                  </div>
                )}

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>

              <div className="text-center text-sm text-text-sub-600">
                Already have an account?{' '}
                <a className="underline underline-offset-4" href="/login">
                  Sign in
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0/80 p-6 shadow-sm lg:max-w-[18rem] lg:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,98,70,0.14),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.6),transparent_40%)]" />
          <div className="relative flex h-full flex-col justify-between gap-6 text-text-strong-950">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-text-sub-600">Photo Library</p>
              <h2 className="text-2xl font-semibold leading-snug text-text-strong-950">
                Launch a clean studio workspace in minutes.
              </h2>
              <p className="text-sm text-text-sub-600">
                We will guide you through onboarding once you create your account.
              </p>
            </div>
            <div className="space-y-2 text-sm text-text-sub-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-base/80" />
                Secure studio login with future Google SSO
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-base/80" />
                Client-ready share links from day one
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-base/80" />
                Upload and organize galleries fast
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
