"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi", "Kanjivaram", "Chanderi", "Bandhani", "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"];

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
  }, []);

  const categoryInventory = sarees.filter(s => s.category === viewingCategory);

  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
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
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 py-6 px-6 md:px-12 flex justify-between items-center">
        <h1 
          className="text-2xl md:text-4xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036] cursor-pointer"
          onClick={() => setViewingCategory(null)}
        >
          Shreemati
        </h1>
        <button onClick={() => setIsCartOpen(true)} className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-stone-200 hover:bg-stone-900 hover:text-white transition-all">
          Bag ({cart.length})
        </button>
      </nav>

      {/* --- SIDE BAG (CART) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white p-8 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif italic">Your Selection</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-stone-400">Close</button>
            </div>
            {orderComplete ? (
              <div className="text-center py-20 space-y-4">
                <div className="text-4xl text-amber-600">✓</div>
                <h3 className="text-xl font-serif">Namaste</h3>
                <p className="text-sm text-stone-500">Your heritage drape is reserved.</p>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-sm italic text-stone-400">Bag is empty.</p>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-stone-50 pb-4">
                    <img src={item.image_url} className="w-16 h-20 object-cover rounded-sm" />
                    <div className="flex-1 self-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold">{item.name}</p>
                      <p className="text-xs text-amber-800">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-6">
                  <div className="flex justify-between text-lg font-serif mb-6">
                    <span>Total</span>
                    <span>₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-5 text-[10px] uppercase tracking-widest">
                    Confirm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      {!viewingCategory ? (
        /* CATEGORY GRID */
        <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 mb-4 font-bold">The Heritage Edit</p>
            <h2 className="text-4xl md:text-7xl font-serif italic text-stone-800">Signature Collections</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat} 
                onClick={() => setViewingCategory(cat)}
                className="group cursor-pointer text-center space-y-4"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm">
                  <img 
                    src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} 
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-[1s] group-hover:scale-110"
                    alt={cat}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="text-sm font-serif tracking-[0.2em] uppercase font-light">{cat}</h3>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* INDIVIDUAL PRODUCTS */
        <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16 border-b border-stone-100 pb-8">
            <div>
              <button onClick={() => setViewingCategory(null)} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-black mb-4 flex items-center gap-2">
                ← Back to Collections
              </button>
              <h2 className="text-4xl md:text-5xl font-serif italic">{viewingCategory} Edit</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
            {categoryInventory.map((s) => (
              <div key={s.id} className="group flex flex-col items-center">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-8 w-full">
                  <img src={s.image_url} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105" alt={s.name} />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-sm font-serif tracking-widest uppercase font-medium">{s.name}</h3>
                  <p className="text-[11px] text-stone-400 italic px-4 leading-relaxed line-clamp-2">{s.description}</p>
                  <p className="text-sm font-bold text-amber-900">₹{s.price.toLocaleString('en-IN')}</p>
                  <button 
                    onClick={() => addToCart(s)}
                    className="mt-4 px-10 py-3 bg-stone-900 text-white text-[9px] uppercase tracking-[0.3em] hover:bg-amber-900 transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="py-20 text-center border-t border-stone-50">
        <p className="text-[9px] uppercase tracking-[1em] text-stone-300">Shreemati Heritage &bull; Handcrafted in India</p>
      </footer>
    </main>
  );
}