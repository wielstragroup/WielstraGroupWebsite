import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Globe, Laptop, Search, Zap, Phone } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { contentService } from '@/src/services/contentService';
import { PortfolioItem, Stat } from '@/src/types';
import { SITE_CONFIG } from '@/src/constants';

export function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioData, statsData] = await Promise.all([
          contentService.getPortfolioItems(true),
          contentService.getStats(),
        ]);
        setPortfolio(portfolioData.slice(0, 3));
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const services = [
    {
      title: 'Web Design',
      description: 'Luxe, moderne ontwerpen die uw merk versterken en bezoekers converteren.',
      icon: <Laptop className="w-8 h-8 text-zinc-900" />,
    },
    {
      title: 'Web Development',
      description: 'Snelle, veilige en schaalbare websites gebouwd met de nieuwste technologieën.',
      icon: <Globe className="w-8 h-8 text-zinc-900" />,
    },
    {
      title: 'SEO Optimalisatie',
      description: 'Beter vindbaar in Google voor relevante zoektermen in Friesland en daarbuiten.',
      icon: <Search className="w-8 h-8 text-zinc-900" />,
    },
    {
      title: 'Snelle Oplevering',
      description: 'Uw nieuwe website online binnen enkele weken, zonder gedoe.',
      icon: <Zap className="w-8 h-8 text-zinc-900" />,
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      <Helmet>
        <title>{SITE_CONFIG.companyName} | Website Laten Maken Friesland</title>
        <meta name="description" content="Betaalbare, professionele en moderne websites voor ondernemers in Friesland. Wielstra Group bouwt uw digitale toekomst." />
        <link rel="canonical" href={SITE_CONFIG.baseUrl} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white z-10" />
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
            alt="Modern Office"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-zinc-100 text-zinc-600 rounded-full">
              Webdesign & Development Friesland
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
              Professionele websites voor <br />
              <span className="text-zinc-400">een eerlijke prijs.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            Hoi, ik ben Joël. Ik help ondernemers in Friesland aan een website die echt bij ze past. Geen gedoe, gewoon een goed resultaat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/contact">Laten we kennismaken</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/portfolio">Mijn werk bekijken</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Local Focus Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-zinc-50 rounded-[32px] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Gewoon lokaal, <br /> helder en duidelijk.</h2>
            <p className="text-zinc-600 text-lg leading-relaxed">
              Ik geloof niet in ingewikkelde technische praatjes. We kunnen eenvoudig een (online) afspraak maken om te bespreken hoe we uw bedrijf online beter zichtbaar kunnen maken. Ik werk vanuit Friesland en help ondernemers in de hele regio.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-zinc-700">
                <CheckCircle2 className="text-zinc-900 w-5 h-5" /> Persoonlijk contact
              </li>
              <li className="flex items-center gap-3 text-zinc-700">
                <CheckCircle2 className="text-zinc-900 w-5 h-5" /> Geen verborgen kosten
              </li>
              <li className="flex items-center gap-3 text-zinc-700">
                <CheckCircle2 className="text-zinc-900 w-5 h-5" /> Direct contact
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
             <img 
               src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" 
               alt="Meeting" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Wat ik voor u kan doen</h2>
          <p className="text-zinc-600">Van een simpele landingspagina tot een uitgebreide website. Ik regel het van A tot Z.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-none hover:bg-zinc-50 transition-colors duration-300">
              <CardContent className="p-8 space-y-6">
                <div className="p-3 bg-white rounded-xl shadow-sm inline-block">
                  {service.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">{service.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Recent Werk</h2>
              <p className="text-zinc-600">Een selectie van projecten die we onlangs hebben opgeleverd voor ondernemers in Friesland.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/portfolio" className="flex items-center gap-2">
                Bekijk Alles <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.length > 0 ? (
              portfolio.map((item) => (
                <Link key={item.id} to={`/portfolio/${item.slug}`} className="group block space-y-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200">
                    {item.coverImage && (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{item.industry}</p>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{item.title}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500">
                Geen portfolio items gevonden.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-zinc-900 rounded-[32px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Klaar om uw bedrijf <br /> online te laten groeien?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg">
              Neem vandaag nog contact op voor een vrijblijvend gesprek over uw nieuwe website.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 w-full sm:w-auto">
                <Link to="/contact">Neem Contact Op</Link>
              </Button>
              <a 
                href={`tel:${SITE_CONFIG.phone}`} 
                className="flex items-center gap-2 text-white font-medium hover:text-zinc-300 transition-colors"
              >
                <Phone size={20} /> {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
