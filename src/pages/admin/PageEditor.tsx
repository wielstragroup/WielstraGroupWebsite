import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { contentService } from '@/src/services/contentService';
import { PageContent, Section } from '@/src/types';

export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState<Partial<PageContent>>({
    title: '',
    slug: '',
    sections: [],
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchPage = async () => {
        const pages = await contentService.getAllPages();
        const found = pages.find(p => p.id === id);
        if (found) setPage(found);
      };
      fetchPage();
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await contentService.savePage(page);
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: '',
      subtitle: '',
      content: '',
      items: [],
    };
    setPage(prev => ({ ...prev, sections: [...(prev.sections || []), newSection] }));
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections?.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const removeSection = (id: string) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections?.filter(s => s.id !== id)
    }));
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/pages"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {id === 'new' ? 'Nieuwe Pagina' : 'Pagina Bewerken'}
          </h1>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
          <Save size={18} /> Opslaan
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="p-8 pb-0">
            <CardTitle>Pagina Info</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Titel</label>
                <input
                  type="text"
                  required
                  value={page.title}
                  onChange={e => setPage(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Slug</label>
                <input
                  type="text"
                  required
                  value={page.slug}
                  onChange={e => setPage(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900">Secties</h2>
          {page.sections?.map((section, index) => (
            <Card key={section.id} className="border-none shadow-sm relative group">
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-full">
                    {section.type}
                  </span>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Sectie Titel"
                    value={section.title}
                    onChange={e => updateSection(section.id, { title: e.target.value })}
                    className="w-full text-xl font-bold bg-transparent border-none focus:outline-none placeholder:text-zinc-300"
                  />
                  <textarea
                    placeholder="Sectie Inhoud..."
                    rows={4}
                    value={section.content}
                    onChange={e => updateSection(section.id, { content: e.target.value })}
                    className="w-full bg-transparent border-none focus:outline-none resize-none placeholder:text-zinc-300"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-wrap gap-4">
            <Button type="button" variant="outline" onClick={() => addSection('hero')}>+ Hero</Button>
            <Button type="button" variant="outline" onClick={() => addSection('text')}>+ Tekst</Button>
            <Button type="button" variant="outline" onClick={() => addSection('features')}>+ Features</Button>
            <Button type="button" variant="outline" onClick={() => addSection('cta')}>+ CTA</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
