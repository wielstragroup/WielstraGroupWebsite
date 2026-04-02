import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { SITE_CONFIG } from '@/src/constants';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Over Ons', path: '/over-ons' },
  { name: 'Diensten', path: '/diensten' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-200 py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            {SITE_CONFIG.companyName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-zinc-900',
                location.pathname === link.path ? 'text-zinc-900' : 'text-zinc-500'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild variant="primary" size="sm" className="ml-4">
            <Link to="/contact">Offerte Aanvragen</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40 p-6 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-lg font-medium py-2 border-b border-zinc-100',
                  location.pathname === link.path ? 'text-zinc-900' : 'text-zinc-500'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 pt-4">
              <Button asChild className="w-full">
                <Link to="/contact">Offerte Aanvragen</Link>
              </Button>
              <div className="flex items-center justify-center gap-6 pt-4">
                <a href={`tel:${SITE_CONFIG.phone}`} className="p-3 bg-zinc-100 rounded-full text-zinc-600">
                  <Phone size={20} />
                </a>
                <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="p-3 bg-zinc-100 rounded-full text-zinc-600">
                  <MessageSquare size={20} />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
