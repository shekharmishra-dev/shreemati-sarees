"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
  }, []);

  const askAI = async () => {
    if (!input) return;
    setLoading(true);
    setChatResponse("Curating your styling advice...");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setChatResponse(data.text);
    } catch (err) {
      setChatResponse("I'm unable to connect to our stylist right now. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased">
      {/* Elegant Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 py-6 px-10 flex justify-between items-center">
        <div className="text-xs uppercase tracking-[0.3em] font-medium text-stone-500">Since 2026</div>
        <h1 className="text-4xl font-serif tracking-widest uppercase font-light text-[#4A4036]">Shreemati</h1>
        <div className="text-xs uppercase tracking-[0.3em] font-medium text-stone-500 italic">The Heritage Edit</div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <p className="text-stone-400 uppercase tracking-[0.4em] text-[10px] mb-4">Curated Collection</p>
        <h2 className="text-5xl md:text-6xl font-serif italic text-stone-800 leading-tight mb-8">
          Timeless Drapes for the Modern Matriarch
        </h2>
        <div className="h-[1px] w-20 bg-amber-400 mx-auto"></div>
      </section>

      {/* Luxury Product Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
        {sarees.map((s) => (
          <div key={s.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
              <img 
                src={s.image_url || 'https://images.unsplash.com/photo-1583391733975-ac943e806f15?q=80&w=1000'} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                alt={s.name}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-serif tracking-wide text-stone-800 uppercase">{s.name}</h3>
              <p className="text-xs text-stone-400 italic mb-3">{s.description}</p>
              <p className="text-sm font-semibold tracking-wider text-amber-700">₹{s.price.toLocaleString('en-IN')}</p>
              <button className="mt-4 px-6 py-2 border border-stone-200 text-[10px] uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all duration-300">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* High-End AI Chat Interface */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <div className="bg-white shadow-2xl rounded-sm border border-stone-100 w-[350px] overflow-hidden transition-all duration-500">
          <div className="bg-[#4A4036] p-4 text-white">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-light">Boutique Stylist</h4>
          </div>
          <div className="h-[200px] overflow-y-auto p-6 text-sm leading-relaxed text-stone-600 bg-stone-50/50 italic">
            {chatResponse || "Welcome. Allow me to guide you through our textures and weaves. What occasion are you shopping for?"}
          </div>
          <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
            <input 
              className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:italic"
              placeholder="Ask our stylist..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askAI()}
            />
            <button 
              onClick={askAI}
              className="text-[10px] uppercase tracking-widest font-bold text-amber-700 hover:text-stone-900 transition-colors"
            >
              {loading ? "..." : "SEND"}
            </button>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-stone-100 py-12 text-center text-[10px] uppercase tracking-[0.5em] text-stone-400 bg-white">
        &copy; 2026 Shreemati Heritage &bull; Handcrafted in India
      </footer>
    </main>
  );
}