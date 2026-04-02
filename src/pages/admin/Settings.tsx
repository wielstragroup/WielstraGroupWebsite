import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { contentService } from '@/src/services/contentService';
import { SiteSettings } from '@/src/types';

export function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    whatsapp: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    address: '',
    footerText: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await contentService.getSettings();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await contentService.saveSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Instellingen</h1>
        <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
          <Save size={18} /> Opslaan
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="border-none shadow-sm">
          <CardHeader className="p-8 pb-0">
            <CardTitle>Bedrijfsgegevens</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Bedrijfsnaam</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={e => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Eigenaar</label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={e => setSettings(prev => ({ ...prev, ownerName: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="p-8 pb-0">
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook}
                onChange={e => setSettings(prev => ({ ...prev, facebook: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={e => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram}
                onChange={e => setSettings(prev => ({ ...prev, instagram: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
