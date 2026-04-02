import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Upload, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { contentService } from '@/src/services/contentService';
import { PortfolioItem } from '@/src/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/src/firebase';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

export function PortfolioEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [item, setItem] = useState<Partial<PortfolioItem>>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    coverImage: '',
    galleryImages: [],
    tags: [],
    techStack: [],
    isDemo: false,
    featured: false,
    published: true,
    clientName: '',
    industry: '',
    liveUrl: '',
    githubUrl: '',
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchItem = async () => {
        const items = await contentService.getPortfolioItems(false);
        const found = items.find(i => i.id === id);
        if (found) setItem(found);
      };
      fetchItem();
    }
  }, [id]);

  const handleAIGenerate = async () => {
    if (!item.galleryImages || item.galleryImages.length === 0) {
      alert('Upload eerst wat screenshots in de galerij om de AI te gebruiken.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Convert images to generative parts
      const imageParts = await Promise.all(
        item.galleryImages.slice(0, 3).map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = (reader.result as string).split(',')[1];
              resolve({
                inlineData: {
                  data: base64data,
                  mimeType: blob.type
                }
              });
            };
            reader.readAsDataURL(blob);
          });
        })
      );

      const prompt = `Analyseer deze screenshots van een webproject. 
      Genereer de volgende informatie in het Nederlands, met een persoonlijke en lokale (Friesland) toon:
      1. Een pakkende titel voor het project.
      2. Een korte samenvatting (excerpt) van max 2 zinnen.
      3. Een uitgebreide beschrijving in Markdown formaat, inclusief secties over de uitdaging, de oplossing en het resultaat. Gebruik een persoonlijke toon ("Ik heb...", "Voor deze klant...").
      4. Een lijst met gebruikte technologieën (techStack) als een JSON array van strings.
      5. Een suggestie voor de industrie (bijv. Horeca, E-commerce, etc.).

      Antwoord ALTIJD in het volgende JSON formaat:
      {
        "title": "...",
        "excerpt": "...",
        "body": "...",
        "techStack": ["...", "..."],
        "industry": "..."
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [...(imageParts as any), { text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text);
      
      setItem(prev => ({
        ...prev,
        title: result.title || prev.title,
        excerpt: result.excerpt || prev.excerpt,
        body: result.body || prev.body,
        techStack: result.techStack || prev.techStack,
        industry: result.industry || prev.industry,
      }));

    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Er is iets misgegaan bij het genereren van de content. Probeer het later opnieuw.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!item.slug) {
        item.slug = item.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      await contentService.savePortfolioItem(item);
      navigate('/admin/portfolio');
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'new') return;
    if (!window.confirm('Weet u zeker dat u dit project wilt verwijderen?')) return;
    
    setIsDeleting(true);
    try {
      await contentService.deletePortfolioItem(id);
      navigate('/admin/portfolio');
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Er is iets misgegaan bij het verwijderen.');
    } finally {
      setIsDeleting(false);
    }
  };

  const compressImage = (file: File, maxWidth = 1600, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob failed'));
            },
            'image/jpeg',
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Compress image before upload
        const compressedBlob = await compressImage(file);
        const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name.split('.')[0]}.jpg`);
        await uploadBytes(storageRef, compressedBlob);
        return getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      
      if (isCover) {
        setItem(prev => ({ ...prev, coverImage: urls[0] }));
      } else {
        setItem(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), ...urls] }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Er is iets misgegaan bij het uploaden van de afbeelding(en). Controleer of u bent ingelogd en probeer het opnieuw.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setItem(prev => ({
      ...prev,
      galleryImages: prev.galleryImages?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/portfolio"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {id === 'new' ? 'Nieuw Project' : 'Project Bewerken'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {id !== 'new' && (
            <Button 
              variant="ghost" 
              onClick={handleDelete} 
              isLoading={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
            >
              <Trash2 size={18} /> Verwijderen
            </Button>
          )}
          <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
            <Save size={18} /> Opslaan
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm bg-zinc-900 text-white">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-3">
                <Sparkles className="text-zinc-400" />
                <CardTitle>AI Project Assistent</CardTitle>
              </div>
              <CardDescription className="text-zinc-400">
                Upload screenshots in de galerij en laat AI de titel, beschrijving en technologieën voor je genereren.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Button 
                type="button"
                onClick={handleAIGenerate} 
                disabled={isGenerating || !item.galleryImages?.length}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Project analyseren...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Genereer Project Details
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle>Basis Informatie</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Titel</label>
                <input
                  type="text"
                  required
                  value={item.title}
                  onChange={e => setItem(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Project Titel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Slug (URL)</label>
                <input
                  type="text"
                  value={item.slug}
                  onChange={e => setItem(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="project-titel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Korte Beschrijving (Excerpt)</label>
                <textarea
                  required
                  rows={3}
                  value={item.excerpt}
                  onChange={e => setItem(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
                  placeholder="Korte samenvatting voor de portfolio lijst..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Inhoud (Markdown)</label>
                <textarea
                  required
                  rows={15}
                  value={item.body}
                  onChange={e => setItem(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-mono text-sm"
                  placeholder="# Project Details..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle>Galerij</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {item.galleryImages?.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 group">
                    {img && (
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors">
                  {isUploading ? (
                    <Loader2 size={24} className="text-zinc-400 animate-spin" />
                  ) : (
                    <Plus size={24} className="text-zinc-400" />
                  )}
                  <span className="text-xs font-medium text-zinc-500">
                    {isUploading ? 'Uploaden...' : 'Toevoegen'}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={e => handleImageUpload(e, false)} 
                    accept="image/*" 
                    multiple 
                    disabled={isUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle>Cover Afbeelding</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 relative group">
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
                    <Loader2 size={32} className="text-zinc-400 animate-spin" />
                  </div>
                ) : item.coverImage ? (
                  <>
                    <img src={item.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="p-3 bg-white rounded-full cursor-pointer">
                        <Upload size={20} className="text-zinc-900" />
                        <input type="file" className="hidden" onChange={e => handleImageUpload(e, true)} accept="image/*" disabled={isUploading} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer">
                    <ImageIcon size={40} className="text-zinc-300" />
                    <span className="text-sm font-medium text-zinc-500">Upload Cover</span>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, true)} accept="image/*" disabled={isUploading} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle>Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-900">Gepubliceerd</label>
                <input
                  type="checkbox"
                  checked={item.published}
                  onChange={e => setItem(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-900">Demo Project</label>
                <input
                  type="checkbox"
                  checked={item.isDemo}
                  onChange={e => setItem(prev => ({ ...prev, isDemo: e.target.checked }))}
                  className="w-5 h-5 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-900">Featured</label>
                <input
                  type="checkbox"
                  checked={item.featured}
                  onChange={e => setItem(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Klant</label>
                <input
                  type="text"
                  value={item.clientName}
                  onChange={e => setItem(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Klant Naam"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Industrie</label>
                <input
                  type="text"
                  value={item.industry}
                  onChange={e => setItem(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Bijv. Horeca, MKB"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Live URL</label>
                <input
                  type="url"
                  value={item.liveUrl}
                  onChange={e => setItem(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-900">Technologieën (komma gescheiden)</label>
                <input
                  type="text"
                  value={item.techStack?.join(', ')}
                  onChange={e => setItem(prev => ({ ...prev, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="React, Tailwind, Firebase..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
