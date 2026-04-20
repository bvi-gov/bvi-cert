'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Government top bar */}
      <div className="w-full py-1.5 px-4 text-center" style={{ backgroundColor: '#0C1B2A' }}>
        <p className="text-[11px] sm:text-xs font-medium tracking-widest uppercase text-white/70">
          Government of the Virgin Islands
        </p>
      </div>
      <div className="h-0.5" style={{ backgroundColor: '#FFD100' }} />

      {/* Main area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafc 50%, #f0f4f8 100%)' }}>
        <Card className="w-full max-w-md border-0 shadow-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5" style={{ backgroundColor: '#009B3A' }} />

          <CardHeader className="text-center pb-4 pt-8 px-8">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#009B3A' }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow" style={{ backgroundColor: '#FFD100' }}>
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#0C1B2A' }} />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: '#0C1B2A' }}>
              BVI <span style={{ color: '#009B3A' }}>CERT</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Royal Virgin Islands Police Force
            </CardDescription>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Administrative Portal</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@gov.vg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-white border-0 shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: '#009B3A' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase" style={{ backgroundColor: '#f0fdf4', color: '#009B3A' }}>
                <ShieldCheck className="w-3 h-3" />
                Official Government System
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                Authorized personnel only. All access is monitored and logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
