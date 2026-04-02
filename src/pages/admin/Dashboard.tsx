import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Settings, Plus, ArrowRight, Eye, Trash2, Edit } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { contentService } from '@/src/services/contentService';
import { PortfolioItem, PageContent } from '@/src/types';
import { formatDate } from '@/src/lib/utils';

export function AdminDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioData, pagesData] = await Promise.all([
          contentService.getPortfolioItems(false),
          contentService.getAllPages(),
        ]);
        setPortfolio(portfolioData);
        setPages(pagesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Portfolio Items', value: portfolio.length, icon: <Briefcase size={20} className="text-blue-600" /> },
    { label: 'Gepubliceerde Pagina\'s', value: pages.length, icon: <FileText size={20} className="text-green-600" /> },
    { label: 'Featured Projecten', value: portfolio.filter(p => p.featured).length, icon: <Plus size={20} className="text-purple-600" /> },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/admin/pages/new">Nieuwe Pagina</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/portfolio/new">Nieuw Project</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-zinc-50 rounded-2xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Portfolio */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Portfolio</CardTitle>
              <CardDescription>Beheer uw laatste projecten</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/portfolio/new" className="flex items-center gap-2">
                Nieuw Project <Plus size={16} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {portfolio.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200">
                      {item.coverImage && (
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
                        {item.isDemo && (
                          <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-600 text-[8px] font-bold uppercase rounded">Demo</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{formatDate(item.createdAt?.toDate())}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/admin/portfolio/edit/${item.id}`}><Edit size={16} /></Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        if (window.confirm('Weet u zeker dat u dit project wilt verwijderen?')) {
                          try {
                            await contentService.deletePortfolioItem(item.id);
                            setPortfolio(prev => prev.filter(p => p.id !== item.id));
                          } catch (error) {
                            alert('Fout bij verwijderen.');
                          }
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/portfolio/${item.slug}`} target="_blank"><Eye size={16} /></Link>
                    </Button>
                  </div>
                </div>
              ))}
              {portfolio.length === 0 && (
                <p className="text-center py-8 text-zinc-500 text-sm">Geen projecten gevonden.</p>
              )}
              {portfolio.length > 0 && (
                <Button asChild variant="ghost" className="w-full text-xs text-zinc-500">
                   <Link to="/admin/portfolio">Alle projecten bekijken</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pages */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pagina's</CardTitle>
              <CardDescription>Beheer uw website inhoud</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/pages/new" className="flex items-center gap-2">
                Nieuwe Pagina <Plus size={16} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {pages.slice(0, 5).map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FileText size={18} className="text-zinc-600" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{page.title}</p>
                      <p className="text-xs text-zinc-500">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/admin/pages/edit/${page.id}`}><Edit size={16} /></Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        if (window.confirm('Weet u zeker dat u deze pagina wilt verwijderen?')) {
                          try {
                            // Assuming contentService has deletePage or similar, but I'll check first.
                            // Actually, I'll check contentService.ts again.
                            await contentService.deletePage(page.id);
                            setPages(prev => prev.filter(p => p.id !== page.id));
                          } catch (error) {
                            alert('Fout bij verwijderen.');
                          }
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/${page.slug}`} target="_blank"><Eye size={16} /></Link>
                    </Button>
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <p className="text-center py-8 text-zinc-500 text-sm">Geen pagina's gevonden.</p>
              )}
              {pages.length > 0 && (
                <Button asChild variant="ghost" className="w-full text-xs text-zinc-500">
                   <Link to="/admin/pages">Alle pagina's bekijken</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
