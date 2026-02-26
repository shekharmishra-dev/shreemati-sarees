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

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
  }, []);

  // Filter sarees based on the clicked category
  const categoryInventory = sarees.filter(s => s.category === viewingCategory);

  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased px-4 md:px-12">
      {/* Header */}
      <nav className="py-8 flex justify-between items-center border-b border-stone-100 sticky top-0 bg-[#FDFCFB]/90 z-50">
        <h1 className="text-3xl font-serif tracking-widest uppercase cursor-pointer" onClick={() => setViewingCategory(null)}>Shreemati</h1>
        <button onClick={() => setIsCartOpen(true)} className="text-[10px] font-bold uppercase tracking-widest">Bag ({cart.length})</button>
      </nav>

      {/* --- VIEW 1: THE CATEGORY GALLERY --- */}
      {!viewingCategory ? (
        <section className="py-20">
          <h2 className="text-center text-4xl font-serif italic mb-16">Explore our Heritage Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat} 
                onClick={() => setViewingCategory(cat)}
                className="group cursor-pointer text-center"
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
                  {/* Each category box shows the first saree of that type as a cover */}
                  <img 
                    src={sarees.find(s => s.category === cat)?.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt={cat}
                  />
                </div>
                <h3 className="font-serif text-lg tracking-wide uppercase group-hover:text-amber-800 transition-colors">{cat}</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Explore Collection</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* --- VIEW 2: THE INDIVIDUAL SAREE INVENTORY --- */
        <section className="py-20">
          <div className="mb-12 flex items-center gap-4">
            <button onClick={() => setViewingCategory(null)} className="text-stone-400 hover:text-black">← Back</button>
            <h2 className="text-4xl font-serif italic">{viewingCategory} Collection</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {categoryInventory.map((s) => (
              <div key={s.id} className="group border border-stone-100 p-4 hover:shadow-xl transition-all bg-white">
                <div className="aspect-[3/4] overflow-hidden mb-6">
                  <img src={s.image_url} className="w-full h-full object-cover" alt={s.name} />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl tracking-tight uppercase">{s.name}</h3>
                  <p className="text-xs text-stone-500 italic px-4">{s.description}</p>
                  <p className="text-lg font-bold text-amber-900">₹{s.price.toLocaleString('en-IN')}</p>
                  <button 
                    onClick={() => addToCart(s)}
                    className="w-full py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-amber-900 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cart Sidebar remains the same as previous version */}
    </main>
  );
}