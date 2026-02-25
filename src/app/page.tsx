"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["All", "Banarasi", "Kanjivaram", "Chanderi", "Bandhani", "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"];

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [filteredSarees, setFilteredSarees] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) { setSarees(data); setFilteredSarees(data); }
    }
    getSarees();
  }, []);

  useEffect(() => {
    let filtered = sarees;
    if (activeCategory !== "All") filtered = filtered.filter(s => s.category === activeCategory);
    setFilteredSarees(filtered);
  }, [activeCategory, sarees]);

  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const simulateCheckout = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setOrderComplete(false);
    }, 4000);
  };

  const askAI = async () => {
    if (!input) return;
    setLoading(true);
    setChatResponse("Radhika is curating your selection...");
    try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        setChatResponse(data.text);
    } catch (e) {
        setChatResponse("Namaste. I am here to help. What occasion are you shopping for?");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 py-8 px-12 flex justify-between items-center">
        <h1 className="text-4xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
        <button onClick={() => setIsCartOpen(true)} className="relative text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-stone-200 hover:bg-stone-50 transition-colors">
          Bag ({cart.length})
        </button>
      </nav>

      {/* Side Cart UI */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-10 shadow-2xl transition-transform duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif italic">Your Selection</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs uppercase tracking-widest text-stone-400">Close</button>
            </div>
            
            {orderComplete ? (
              <div className="text-center py-20 space-y-4">
                <div className="text-4xl text-amber-600">✓</div>
                <h3 className="text-xl font-serif">Order Received</h3>
                <p className="text-sm text-stone-500 italic">Namaste! We are preparing your heritage drapes.</p>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-sm italic text-stone-400">Your bag is currently empty.</p>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-stone-100 pb-4">
                    <img src={item.image_url} className="w-16 h-20 object-cover bg-stone-100" />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest font-bold">{item.name}</p>
                      <p className="text-xs text-amber-800">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-6">
                  <div className="flex justify-between text-lg font-serif mb-6">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800">
                    Place Order
                  </button>
                  <p className="text-[9px] text-center mt-4 text-stone-400 italic">Standard Razorpay Gateway will be integrated here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-6xl font-serif italic text-stone-800 mb-8">The Art of the Drape</h2>
        <div className="max-w-2xl mx-auto bg-stone-50 border border-stone-100 p-8 rounded-sm">
          <p className="text-sm font-serif italic text-stone-600 mb-6 italic">"{chatResponse || "Namaste. I am Radhika. Tell me the occasion, and I shall guide you."}"</p>
          <div className="flex gap-4 border-b border-stone-200 pb-2 max-w-md mx-auto">
            <input className="flex-1 bg-transparent text-xs focus:outline-none italic" placeholder="Ask Radhika..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askAI()} />
            <button onClick={askAI} className="text-[10px] uppercase tracking-widest font-bold text-amber-800">{loading ? "..." : "Consult"}</button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
        {filteredSarees.map((s) => (
          <div key={s.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
              <img src={s.image_url} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt={s.name} />
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[9px] uppercase tracking-widest text-stone-500">{s.category}</div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-sm font-serif tracking-widest uppercase">{s.name}</h3>
              <p className="text-sm text-amber-800 font-bold">₹{s.price.toLocaleString('en-IN')}</p>
              <button onClick={() => addToCart(s)} className="px-6 py-2 border border-stone-900 text-[9px] uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all">Add to Bag</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}