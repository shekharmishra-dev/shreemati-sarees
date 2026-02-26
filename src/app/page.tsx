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
  const [selectedSaree, setSelectedSaree] = useState<any | null>(null); // To track which saree is clicked
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
    setSelectedSaree(null); // Close the detail view
    setIsCartOpen(true);
  };

  const simulateCheckout = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setOrderComplete(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 py-4 md:py-8 px-4 md:px-12 flex justify-between items-center">
        <h1 className="text-2xl md:text-5xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
        <button onClick={() => setIsCartOpen(true)} className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-stone-200">
          Bag ({cart.length})
        </button>
      </nav>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedSaree && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col md:flex-row relative">
            <button 
              onClick={() => setSelectedSaree(null)}
              className="absolute top-4 right-4 z-10 text-stone-400 hover:text-black text-xl"
            >✕</button>
            
            {/* Saree Image in Modal */}
            <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-stone-100">
              <img src={selectedSaree.image_url} className="w-full h-full object-cover" alt={selectedSaree.name} />
            </div>

            {/* Saree Details in Modal */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700 mb-2 font-bold">{selectedSaree.category}</span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">{selectedSaree.name}</h2>
              <p className="text-sm text-stone-500 italic mb-8 leading-relaxed">{selectedSaree.description}</p>
              <div className="text-2xl font-serif mb-8 text-stone-800">₹{selectedSaree.price.toLocaleString('en-IN')}</div>
              
              <button 
                onClick={() => addToCart(selectedSaree)}
                className="w-full bg-stone-900 text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-colors"
              >
                Buy Now & Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif italic">Your Selection</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs uppercase tracking-widest text-stone-400">Close</button>
            </div>
            {orderComplete ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">✓</div>
                <p className="font-serif italic">Namaste! Your order is placed.</p>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-sm italic text-stone-400">Your bag is empty.</p>
            ) : (
              <div>
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-4 border-b border-stone-100 pb-4">
                    <img src={item.image_url} className="w-12 h-16 object-cover" />
                    <div className="text-xs uppercase tracking-widest font-bold self-center">{item.name}</div>
                  </div>
                ))}
                <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-4 mt-6 text-[10px] uppercase tracking-widest">Confirm Order</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero & Category Section */}
      <header className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif italic mb-12">The Heritage Collection</h2>
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-3 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap text-[10px] uppercase tracking-widest px-5 py-2 border transition-all ${activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'text-stone-500 border-stone-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
        {filteredSarees.map((s) => (
          <div key={s.id} className="group flex flex-col items-center">
            {/* IMAGE IS NOW CLICKABLE */}
            <div 
              onClick={() => setSelectedSaree(s)}
              className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 cursor-zoom-in w-full"
            >
              <img src={s.image_url} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt={s.name} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-sm font-serif tracking-widest uppercase">{s.name}</h3>
              <p className="text-sm font-bold text-amber-900">₹{s.price.toLocaleString('en-IN')}</p>
              <button 
                onClick={() => setSelectedSaree(s)}
                className="text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-black transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}