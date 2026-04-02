import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { SITE_CONFIG } from '@/src/constants';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    honeypot: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Anti-spam

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pb-24 space-y-24">
      <Helmet>
        <title>Contact | {SITE_CONFIG.companyName}</title>
        <meta name="description" content="Neem contact op met Wielstra Group voor een vrijblijvende offerte of advies over uw nieuwe website." />
        <link rel="canonical" href={`${SITE_CONFIG.baseUrl}contact`} />
      </Helmet>

      {/* Header */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">Contact</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Klaar om uw digitale aanwezigheid naar een hoger niveau te tillen? Neem contact met ons op voor een vrijblijvend gesprek.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900">Laten we praten</h2>
            <p className="text-zinc-600 leading-relaxed">
              Heeft u een vraag of wilt u een project starten? Wij staan klaar om u te helpen. U kunt ons bellen, mailen of een bericht sturen via WhatsApp.
            </p>
          </div>

          <div className="space-y-6">
            <a 
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
            >
              <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Phone className="text-zinc-900" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Telefoon</p>
                <p className="text-lg font-bold text-zinc-900">{SITE_CONFIG.phone}</p>
              </div>
            </a>

            <a 
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
            >
              <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare className="text-zinc-900" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="text-lg font-bold text-zinc-900">Stuur een bericht</p>
              </div>
            </a>

            <a 
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
            >
              <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Mail className="text-zinc-900" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email</p>
                <p className="text-lg font-bold text-zinc-900">{SITE_CONFIG.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <MapPin className="text-zinc-900" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Locatie</p>
                <p className="text-lg font-bold text-zinc-900">Friesland, Nederland</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-2xl shadow-zinc-100 rounded-[32px] overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-900">Bedankt!</h3>
                  <p className="text-zinc-600 max-w-sm mx-auto leading-relaxed">
                    Uw bericht is succesvol verzonden. Wij nemen zo spoedig mogelijk contact met u op.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Nieuw Bericht
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-zinc-900">Naam</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="Uw naam"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-zinc-900">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="uw@email.nl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-bold text-zinc-900">Telefoon (optioneel)</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="06 12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-bold text-zinc-900">Bedrijfsnaam (optioneel)</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="Uw bedrijf"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-zinc-900">Bericht</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-none"
                      placeholder="Vertel ons over uw project..."
                    />
                  </div>

                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                    Verstuur Bericht <Send size={18} className="ml-2" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
