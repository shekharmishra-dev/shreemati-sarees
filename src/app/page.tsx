"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase connection
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

  // Fetch inventory from Supabase on load
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

  // Filter logic for Categories and Price
  useEffect(() => {
    let filtered = sarees;
    if (activeCategory !== "All") {
      filtered = filtered.filter(s => s.category === activeCategory);
    }
    filtered = filtered.filter(s => s.price >= activePrice.min && s.price <= activePrice.max);
    setFilteredSarees(filtered);
  }, [activeCategory, activePrice, sarees]);

  // AI Stylist Handler
  const askAI = async () => {
    if (!input) return;
    setLoading(true);
    setChatResponse("Radhika is curating your personal selection...");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setChatResponse(data.text);
    } catch (err) {
      setChatResponse("Namaste. Our stylist is currently assisting another client. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased">
      {/* Elegant Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 py-8 px-12 flex justify-between items-center">
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Since 2026</div>
        <h1 className="text-5xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400 italic">The Heritage Edit</div>
      </nav>

      {/* Integrated AI Stylist Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-6xl font-serif italic text-stone-800 mb-8 leading-tight">The Art of the Drape</h2>
        <div className="max-w-2xl mx-auto bg-white border border-amber-100 p-8 rounded-sm shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
             <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
             <h3 className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">Styling Consultation</h3>
          </div>
          <p className="text-sm font-serif italic text-stone-600 mb-6 leading-relaxed">
            "{chatResponse || "Namaste. I am Radhika. Tell me the occasion, and I shall guide you to the perfect weave."}"
          </p>
          <div className="flex gap-4 border-b border-stone-200 pb-2 max-w-md mx-auto">
            <input 
              className="flex-1 bg-transparent text-xs focus:outline-none italic placeholder:text-stone-300" 
              placeholder="e.g. Seeking a Banarasi for a winter wedding..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && askAI()} 
            />
            <button onClick={askAI} className="text-[10px] uppercase tracking-widest font-bold text-amber-800 hover:text-stone-900 transition-colors">
              {loading ? "..." : "Consult"}
            </button>
          </div>
        </div>
      </section>

      {/* Boutique Filters */}
      <div className="max-w-7xl mx-auto px-10 mb-16 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`text-[10px] uppercase tracking-widest px-5 py-2 transition-all border ${activeCategory === cat ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'text-stone-500 border-stone-100 hover:border-stone-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-6 border-t border-stone-100 pt-6 w-full justify-center">
          {PRICE_RANGES.map(range => (
            <button 
              key={range.label} 
              onClick={() => setActivePrice(range)} 
              className={`text-[9px] uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activePrice.label === range.label ? 'border-amber-600 text-stone-900 font-bold' : 'border-transparent text-stone-400'}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Gallery */}
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
        {filteredSarees.length > 0 ? filteredSarees.map((s) => (
          <div key={s.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
              <img 
                src={s.image_url} 
                className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110" 
                alt={s.name}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000";
                }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest text-stone-500">
                {s.category}
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-serif tracking-[0.1em] text-stone-900 uppercase font-medium">{s.name}</h3>
              <p className="text-[11px] text-stone-400 italic font-light px-6 line-clamp-2">{s.description}</p>
              <p className="text-sm font-medium tracking-wider text-amber-800">₹{s.price?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 text-stone-400 italic font-serif">
            We are currently curating more masterpieces for this selection.
          </div>
        )}
      </div>

      <footer className="border-t border-stone-100 py-20 text-center bg-white">
        <p className="text-[9px] uppercase tracking-[1em] text-stone-300">Shreemati Heritage &bull; Handcrafted in India</p>
      </footer>
    </main>
  );
}