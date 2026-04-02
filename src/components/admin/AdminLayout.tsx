import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { auth } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';

const adminNav = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { name: 'Portfolio', path: '/admin/portfolio', icon: <Briefcase size={20} /> },
  { name: 'Pagina\'s', path: '/admin/pages', icon: <FileText size={20} /> },
  { name: 'Instellingen', path: '/admin/settings', icon: <Settings size={20} /> },
];

export function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-zinc-100">
          <Link to="/" className="text-xl font-bold tracking-tight text-zinc-900">
            Wielstra Admin
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === item.path 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-3">
            <Link to="/">
              <Globe size={18} />
              Bekijk Site
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => auth.signOut()}
          >
            <LogOut size={18} />
            Uitloggen
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
