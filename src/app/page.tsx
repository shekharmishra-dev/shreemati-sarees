"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = [
  "All", "Banarasi", "Kanjivaram", "Chanderi", "Bandhani", 
  "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 1000000 },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹15,000", min: 5001, max: 15000 },
  { label: "Luxury (Above ₹15,000)", min: 15001, max: 1000000 },
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

  // Filtering Logic
  useEffect(() => {
    let filtered = sarees;
    if (activeCategory !== "All") {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    filtered = filtered.filter(s => s.price >= activePrice.min && s.price <= activePrice.max);
    setFilteredSarees(filtered);
  }, [activeCategory, activePrice, sarees]);

  const askAI = async () => {
    if (!input) return;
    setLoading(true);
    setChatResponse("Radhika is curating your personal edit...");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setChatResponse(data.text);
    } catch (err) {
      setChatResponse("Our stylist is currently unavailable. Please try again shortly.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-stone-200 py-6 px-10 flex justify-between items-center">
        <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-stone-500">Since 2026</div>
        <h1 className="text-4xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
        <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-stone-500 italic">The Heritage Edit</div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <p className="text-amber-700 uppercase tracking-[0.5em] text-[10px] mb-6 font-bold">Handcrafted Elegance</p>
        <h2 className="text-6xl md:text-7xl font-serif italic text-stone-800 leading-tight mb-8">
          A Legacy Woven in Silk
        </h2>
        <div className="h-[1px] w-32 bg-amber-400 mx-auto mb-12"></div>
        
        {/* Integrated AI Stylist Section */}
        <div className="max-w-3xl mx-auto bg-white border border-amber-100 p-8 shadow-sm rounded-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Consult with Radhika, Lead Stylist</h3>
          </div>
          <p className="text-sm font-serif italic text-stone-600 mb-6 leading-relaxed">
            "{chatResponse || "Namaste. I am here to help you find the perfect drape for your special occasion. What are you looking for today?"}"
          </p>
          <div className="flex gap-2 border-b border-stone-200 pb-2 max-w-md mx-auto">
            <input 
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:italic"
              placeholder="Ask about fabrics, occasions, or styling..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askAI()}
            />
            <button onClick={askAI} className="text-[10px] uppercase tracking-widest font-bold text-amber-700">
              {loading ? "..." : "Consult"}
            </button>
          </div>
        </div>
      </section>

      {/* Boutique Filters */}
      <section className="max-w-7xl mx-auto px-10 mb-12">
        <div className="flex flex-wrap justify-center gap-8 border-y border-stone-100 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-widest px-4 py-2 transition-all ${activeCategory === cat ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full h-px bg-stone-50 md:hidden"></div>
          <div className="flex gap-4">
            {PRICE_RANGES.map(range => (
              <button 
                key={range.label}
                onClick={() => setActivePrice(range)}
                className={`text-[10px] uppercase tracking-widest px-4 py-2 border border-stone-100 ${activePrice.label === range.label ? 'border-amber-400 text-amber-800' : 'text-stone-400'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
        {filteredSarees.length > 0 ? filteredSarees.map((s) => (
          <div key={s.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-8">
              <img 
                src={s.image_url || 'https://images.unsplash.com/photo-1610030469668-93510cb66c73?q=80&w=1000'} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                alt={s.name}
              />
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[9px] uppercase tracking-widest text-stone-600">
                {s.category || 'Heritage'}
              </div>
            </div>
            <div className="space-y-3 text-center">
              <h3 className="text-sm font-serif tracking-[0.2em] text-stone-800 uppercase">{s.name}</h3>
              <p className="text-[11px] text-stone-400 italic font-light px-4">{s.description}</p>
              <p className="text-sm font-medium tracking-wider text-amber-700">₹{s.price?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 text-stone-400 italic font-serif">
            Currently curating more pieces for this selection...
          </div>
        )}
      </div>

      <footer className="border-t border-stone-100 py-16 text-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.8em] text-stone-400">Shreemati Heritage &bull; Handcrafted in India</p>
      </footer>
    </main>
  );
}