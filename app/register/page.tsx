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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2 items-center">
        <Card className="shadow-xl border border-border/80">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio Manager</p>
                <h1 className="text-2xl font-bold leading-tight">Create your studio account</h1>
                <p className="text-sm text-muted-foreground">
                  Start managing clients, uploads, and share links in one place.
                </p>
              </div>

              {googleEnabled && (
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <a href="/api/auth/google">Continue with Google</a>
                  </Button>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="h-px flex-1 bg-border/70" />
                    or
                    <span className="h-px flex-1 bg-border/70" />
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
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <a className="underline underline-offset-4" href="/login">
                  Sign in
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative hidden overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-primary/5 to-background md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="relative h-full px-8 py-10 flex flex-col justify-between text-foreground">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Photo Library</p>
              <h2 className="text-3xl font-semibold leading-tight">
                Launch a clean studio workspace in minutes.
              </h2>
              <p className="text-sm text-muted-foreground">
                We will guide you through onboarding once you create your account.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Secure studio login with future Google SSO
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Client-ready share links from day one
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Upload and organize galleries fast
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
