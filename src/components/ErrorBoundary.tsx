import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Er is een onverwachte fout opgetreden.';
      
      try {
        const errorData = JSON.parse(this.state.error?.message || '{}');
        if (errorData.error && errorData.error.includes('insufficient permissions')) {
          errorMessage = 'U heeft geen toestemming om deze actie uit te voeren.';
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
          <Card className="max-w-md w-full border-none shadow-xl rounded-[32px]">
            <CardHeader className="text-center p-12 pb-6">
              <CardTitle className="text-2xl font-bold text-red-600">Oeps!</CardTitle>
            </CardHeader>
            <CardContent className="p-12 pt-6 text-center space-y-6">
              <p className="text-zinc-600">{errorMessage}</p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Pagina Vernieuwen
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <a href="/">Terug naar Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
