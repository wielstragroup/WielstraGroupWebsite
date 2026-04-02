import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '@/src/constants';

export function OverOns() {
  return (
    <div className="pb-24 space-y-24">
      <Helmet>
        <title>Over Ons | {SITE_CONFIG.companyName}</title>
        <meta name="description" content="Leer meer over Joël Wielstra en de missie van Wielstra Group om ondernemers in Friesland te helpen." />
      </Helmet>

      {/* Hero */}
      <section className="bg-zinc-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">Over Wielstra Group</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Geen groot bureau, maar een persoonlijke aanpak. Ik ben Joël Wielstra, en ik bouw websites die werken voor Friese ondernemers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-zinc-900">Mijn Verhaal</h2>
            <p className="text-zinc-600 leading-relaxed">
              Ik zag dat veel kleine ondernemers in Friesland moeite hadden om een goede, betaalbare website te vinden. Grote bureaus vragen vaak de hoofdprijs, terwijl de persoonlijke aandacht ontbreekt. Daarom ben ik Wielstra Group gestart.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              Mijn doel is simpel: ik wil dat elke ondernemer in de regio een professionele online aanwezigheid heeft waar ze trots op kunnen zijn. Zonder dat het een fortuin kost.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-50 rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-900 text-lg">Lokaal</h4>
              <p className="text-sm text-zinc-500">Ik kom uit Friesland en ken de markt hier als geen ander.</p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-900 text-lg">Eerlijk</h4>
              <p className="text-sm text-zinc-500">Geen kleine lettertjes of onverwachte kosten achteraf.</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl bg-white flex flex-col items-center justify-center p-12 border border-zinc-100">
            <div className="text-4xl font-black tracking-tighter text-zinc-900">WIELSTRA</div>
            <div className="text-sm font-bold tracking-[0.4em] text-zinc-400 mt-2 uppercase">Group</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-zinc-900 py-24 px-6 rounded-[48px] mx-6 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Persoonlijk</h3>
            <p className="text-zinc-400 text-sm">U spreekt altijd direct met mij. Geen tussenpersonen of projectmanagers.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Kwaliteit</h3>
            <p className="text-zinc-400 text-sm">Ik gebruik de nieuwste technieken voor een snelle en veilige website.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Ondersteuning</h3>
            <p className="text-zinc-400 text-sm">Ook na de lancering sta ik voor u klaar voor vragen of aanpassingen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
