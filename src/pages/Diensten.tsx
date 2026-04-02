import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Laptop, Globe, Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@/src/constants';

export function Diensten() {
  const services = [
    {
      title: 'Web Design',
      description: 'Een website is uw digitale visitekaartje. Ik ontwerp moderne, overzichtelijke websites die perfect aansluiten bij uw huisstijl en de wensen van uw klanten.',
      icon: <Laptop className="w-10 h-10 text-zinc-900" />,
      features: ['Uniek ontwerp', 'Mobiel vriendelijk', 'Gebruiksvriendelijk', 'Huisstijl integratie'],
    },
    {
      title: 'Web Development',
      description: 'Ik bouw snelle en veilige websites met de nieuwste technologieën. Geen trage WordPress sites, maar maatwerk dat razendsnel laadt.',
      icon: <Globe className="w-10 h-10 text-zinc-900" />,
      features: ['Snelle laadtijden', 'Veilige hosting', 'Eenvoudig beheer', 'Maatwerk oplossingen'],
    },
    {
      title: 'SEO Optimalisatie',
      description: 'Een mooie website is niets waard als niemand hem kan vinden. Ik zorg ervoor dat uw website goed vindbaar is in Google voor de juiste zoekwoorden.',
      icon: <Search className="w-10 h-10 text-zinc-900" />,
      features: ['Zoekwoorden onderzoek', 'Technische SEO', 'Lokale vindbaarheid', 'Content advies'],
    },
    {
      title: 'Onderhoud & Support',
      description: 'Geen zorgen over updates of beveiliging. Ik houd uw website up-to-date en sta altijd klaar voor al uw vragen.',
      icon: <Zap className="w-10 h-10 text-zinc-900" />,
      features: ['Regelmatige updates', 'Backups', 'Beveiliging', 'Snelle support'],
    },
  ];

  return (
    <div className="pb-24 space-y-24">
      <Helmet>
        <title>Onze Diensten | {SITE_CONFIG.companyName}</title>
        <meta name="description" content="Ontdek wat Wielstra Group voor uw bedrijf kan betekenen: van webdesign en development tot SEO optimalisatie." />
      </Helmet>

      {/* Hero */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">Mijn Diensten</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Alles wat u nodig heeft voor een succesvolle website, van concept tot lancering. Ik regel het van A tot Z.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="max-w-7xl mx-auto px-6 space-y-24">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="flex-1 space-y-8">
              <div className="p-4 bg-zinc-50 rounded-2xl inline-block">
                {service.icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-zinc-900">{service.title}</h2>
                <p className="text-zinc-600 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                    <CheckCircle2 className="text-zinc-900 w-5 h-5" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden bg-zinc-100 shadow-xl">
               <img 
                 src={`https://picsum.photos/seed/${service.title}/1200/800`} 
                 alt={service.title} 
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-zinc-900 rounded-[48px] p-12 md:p-24 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Wilt u een project starten?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
            Neem vandaag nog contact op voor een vrijblijvend gesprek over uw nieuwe website. We kunnen eenvoudig een afspraak inplannen.
          </p>
          <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
            <Link to="/contact" className="flex items-center gap-2">
              Neem Contact Op <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
