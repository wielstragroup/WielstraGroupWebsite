import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { contentService } from '@/src/services/contentService';
import { PortfolioItem } from '@/src/types';
import { SITE_CONFIG } from '@/src/constants';
import { formatDate } from '@/src/lib/utils';

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!slug) return;
      try {
        const data = await contentService.getPortfolioItemBySlug(slug);
        if (!data) {
          navigate('/portfolio');
          return;
        }
        setItem(data);
      } catch (error) {
        console.error('Error fetching portfolio item:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-12 animate-pulse">
        <div className="h-4 w-24 bg-zinc-100 rounded" />
        <div className="h-12 w-3/4 bg-zinc-100 rounded" />
        <div className="aspect-video bg-zinc-100 rounded-3xl" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="pb-24 space-y-16">
      <Helmet>
        <title>{item.title} | Portfolio | {SITE_CONFIG.companyName}</title>
        <meta name="description" content={item.excerpt} />
        <link rel="canonical" href={`${SITE_CONFIG.baseUrl}portfolio/${item.slug}`} />
      </Helmet>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12 space-y-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/portfolio" 
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={16} /> Terug naar Portfolio
          </Link>
          {item.isDemo && (
            <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
              Demo Project
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-full">
               {item.industry}
             </span>
             <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
               <Calendar size={14} /> {formatDate(item.createdAt?.toDate())}
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
            {item.title}
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl leading-relaxed">
            {item.excerpt}
          </p>
        </div>
      </section>

      {/* Cover Image */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="aspect-video overflow-hidden rounded-[32px] bg-zinc-100 shadow-2xl shadow-zinc-200">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="prose prose-zinc prose-lg max-w-none">
            <ReactMarkdown>{item.body}</ReactMarkdown>
          </div>

          {item.galleryImages && item.galleryImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {item.galleryImages.map((img, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-zinc-100">
                  {img && (
                    <img
                      src={img}
                      alt={`${item.title} gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="bg-zinc-50 rounded-3xl p-8 space-y-8 sticky top-32">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Project Details</h3>
              <div className="space-y-4">
                {item.clientName && (
                  <div className="flex justify-between items-center py-3 border-b border-zinc-200">
                    <span className="text-zinc-500 text-sm">Klant</span>
                    <span className="text-zinc-900 font-medium text-sm">{item.clientName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-zinc-200">
                  <span className="text-zinc-500 text-sm">Industrie</span>
                  <span className="text-zinc-900 font-medium text-sm">{item.industry}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-200">
                  <span className="text-zinc-500 text-sm">Datum</span>
                  <span className="text-zinc-900 font-medium text-sm">{formatDate(item.createdAt?.toDate())}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Technologieën</h3>
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-white border border-zinc-200 text-zinc-600 text-xs font-medium rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {item.liveUrl && (
                <Button asChild className="w-full">
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Bekijk Live Site <ExternalLink size={16} />
                  </a>
                </Button>
              )}
              {item.githubUrl && (
                <Button asChild variant="outline" className="w-full">
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    GitHub Repo <Github size={16} />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* Navigation */}
      <section className="max-w-7xl mx-auto px-6 pt-16 border-t border-zinc-100">
        <div className="flex justify-between items-center">
          <Link to="/portfolio" className="text-zinc-900 font-bold hover:text-zinc-600 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} /> Vorige Projecten
          </Link>
          <Button asChild variant="primary">
            <Link to="/contact">Start Uw Project</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
