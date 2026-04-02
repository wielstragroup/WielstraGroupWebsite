import { Link } from 'react-router-dom';
import { Phone, Mail, MessageSquare, Facebook, Linkedin, Instagram, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/src/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-6 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6 col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight">
            {SITE_CONFIG.companyName}
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Luxe, moderne en betaalbare websites voor kleine bedrijven in Friesland. Wij bouwen uw digitale toekomst.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Navigatie</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/over-ons" className="hover:text-white transition-colors">Over Ons</Link></li>
            <li><Link to="/diensten" className="hover:text-white transition-colors">Diensten</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Diensten</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/diensten" className="hover:text-white transition-colors">Web Design</Link></li>
            <li><Link to="/diensten" className="hover:text-white transition-colors">Web Development</Link></li>
            <li><Link to="/diensten" className="hover:text-white transition-colors">SEO Optimalisatie</Link></li>
            <li><Link to="/diensten" className="hover:text-white transition-colors">Onderhoud & Support</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-zinc-600" />
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">{SITE_CONFIG.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageSquare size={16} className="text-zinc-600" />
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="hover:text-white transition-colors">WhatsApp</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-zinc-600" />
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">{SITE_CONFIG.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-zinc-600" />
              <span>Friesland, Nederland</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© {currentYear} {SITE_CONFIG.companyName}. Alle rechten voorbehouden.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/voorwaarden" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
          <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
