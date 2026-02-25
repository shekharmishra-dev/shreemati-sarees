"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["All", "Banarasi", "Kanjivaram", "Chanderi", "Bandhani", "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"];
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 1000000 },
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹30,000", min: 10001, max: 30000 },
  { label: "Luxury (Above ₹30,000)", min: 30001, max: 1000000 },
];

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [filteredSarees, setFilteredSarees] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePrice, setActivePrice] = useState(PRICE_RANGES[0]);
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) {
        setSarees(data);
        setFilteredSarees(data);
      }
    }
    getSarees();
  }, []);

  useEffect(() => {
    let filtered = sarees;
    if (activeCategory !== "All") filtered = filtered.filter(s => s.category === activeCategory);
    filtered = filtered.filter(s => s.price >= activePrice.min && s.price <= activePrice.max);
    setFilteredSarees(filtered);
  }, [activeCategory, activePrice, sarees]);

  const askAI = async () => {
    if (!input) return;
    setLoading(true);
    setChatResponse("Radhika is curating your selection...");
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setChatResponse(data.text);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 py-8 px-12 flex justify-between items-center">
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">EST. 2026</div>
        <h1 className="text-5xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400 italic">Heritage</div>
      </nav>

      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-6xl font-serif italic text-stone-800 mb-8">The Art of the Drape</h2>
        <div className="max-w-2xl mx-auto bg-stone-50 border border-stone-100 p-8 rounded-lg shadow-inner">
          <p className="text-sm font-serif italic text-stone-500 mb-6">"{chatResponse || "Namaste. I am Radhika. Tell me the occasion, and I shall find the weave."}"</p>
          <div className="flex gap-4 border-b border-stone-300 pb-2 max-w-md mx-auto">
            <input className="flex-1 bg-transparent text-xs focus:outline-none italic" placeholder="e.g. A cocktail party in Delhi..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askAI()} />
            <button onClick={askAI} className="text-[10px] uppercase tracking-widest font-black text-amber-800">{loading ? "..." : "Consult"}</button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 mb-16 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-[10px] uppercase tracking-widest px-5 py-2 rounded-full border ${activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'text-stone-500 border-stone-200 hover:border-stone-900'}`}>{cat}</button>
          ))}
        </div>
        <div className="flex gap-4">
          {PRICE_RANGES.map(range => (
            <button key={range.label} onClick={() => setActivePrice(range)} className={`text-[9px] uppercase tracking-tighter px-4 py-1 border-b-2 ${activePrice.label === range.label ? 'border-amber-600 text-stone-900' : 'border-transparent text-stone-400'}`}>{range.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
        {filteredSarees.map((s) => (
          <div key={s.id} className="group overflow-hidden">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
              <img src={s.image_url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={s.name} />
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 text-[10px] uppercase tracking-[0.2em]">{s.category}</div>
            </div>
            <div className="mt-6 text-center space-y-2">
              <h3 className="text-md font-serif tracking-widest uppercase">{s.name}</h3>
              <p className="text-xs text-stone-400 font-light italic">{s.description}</p>
              <p className="text-sm font-bold text-amber-900">₹{s.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}