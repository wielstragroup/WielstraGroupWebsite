import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/src/firebase';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { LogIn } from 'lucide-react';

export function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  if (loading) return null;

  if (user && isAdmin) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError('Inloggen mislukt. Probeer het opnieuw.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <Card className="w-full max-w-md shadow-2xl shadow-zinc-200 border-none rounded-[32px]">
        <CardHeader className="text-center space-y-4 p-12 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Wielstra Group</CardTitle>
          <CardDescription className="text-zinc-500">
            Log in op het beheerderspaneel om uw website te beheren.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-12 pt-6 space-y-8">
          {user && !isAdmin && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              U heeft geen toegang tot dit gedeelte. Log in met een geautoriseerd account.
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
          <Button onClick={handleLogin} className="w-full h-14 text-lg" size="lg">
            <LogIn className="mr-2" size={20} /> Log in met Google
          </Button>
          <div className="text-center">
            <Button asChild variant="ghost" size="sm">
              <a href="/">Terug naar de website</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
