import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { contentService } from '@/src/services/contentService';
import { PortfolioItem } from '@/src/types';
import { SITE_CONFIG } from '@/src/constants';

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [activeTag, setActiveTag] = useState<string>('Alle');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await contentService.getPortfolioItems(true);
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const tags = ['Alle', ...Array.from(new Set(items.flatMap(item => item.tags)))];

  const handleFilter = (tag: string) => {
    setActiveTag(tag);
    if (tag === 'Alle') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.tags.includes(tag)));
    }
  };

  return (
    <div className="pb-24 space-y-24">
      <Helmet>
        <title>Portfolio | {SITE_CONFIG.companyName}</title>
        <meta name="description" content="Bekijk ons werk voor ondernemers in Friesland. Van webshops tot zakelijke websites." />
        <link rel="canonical" href={`${SITE_CONFIG.baseUrl}portfolio`} />
      </Helmet>

      {/* Header */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">Mijn Werk</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Een overzicht van projecten waar ik trots op ben. Van lokale ondernemers tot eigen concepten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilter(tag)}
              className="rounded-full px-6"
            >
              {tag}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/3] bg-zinc-100 rounded-2xl" />
                <div className="h-4 w-1/4 bg-zinc-100 rounded" />
                <div className="h-6 w-3/4 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/portfolio/${item.slug}`} className="group block space-y-6">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200 relative">
                    {item.coverImage && (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {item.isDemo && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                          Demo
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="outline" className="bg-white/90 backdrop-blur border-none pointer-events-none">
                        Bekijk Project
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{item.industry}</span>
                      <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{item.techStack[0]}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{item.title}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{item.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <p className="text-zinc-500 text-lg">Geen projecten gevonden in deze categorie.</p>
            <Button variant="outline" onClick={() => handleFilter('Alle')}>Toon Alles</Button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-zinc-50 rounded-[32px] p-12 md:p-24 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            Wilt u ook een nieuwe website?
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto text-lg">
            Ik help u graag met een website die echt bij uw bedrijf past. Geen gedoe, gewoon een goed resultaat.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Laten we kennismaken</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
