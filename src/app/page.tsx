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
      {/* PROFESSIONAL NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 
            className="text-2xl md:text-4xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036] cursor-pointer"
            onClick={() => setViewingCategory(null)}
          >
            Shreemati
          </h1>
          <span className="text-[8px] uppercase tracking-[0.4em] text-stone-400 text-center md:text-left">Jodhpur • Heritage • Craft</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="hidden md:block text-[9px] uppercase tracking-widest text-stone-500 hover:text-amber-800 transition-colors">Instagram</a>
          <button onClick={() => setIsCartOpen(true)} className="relative text-[10px] uppercase tracking-widest font-bold px-5 py-2 bg-stone-900 text-white rounded-sm shadow-xl">
            Bag ({cart.length})
          </button>
        </div>
      </nav>

      {/* SIDE BAG (CART) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white p-8 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
              <h2 className="text-2xl font-serif italic">Your Selection</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-stone-400">Close</button>
            </div>
            {orderComplete ? (
              <div className="text-center py-20 space-y-4">
                <div className="text-4xl text-amber-600">✓</div>
                <h3 className="text-xl font-serif">Order Received</h3>
                <p className="text-sm text-stone-500 italic">Namaste! We are preparing your drapes.</p>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-sm italic text-stone-400 text-center py-10">Your luxury bag is empty.</p>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-stone-50 pb-4">
                    <img src={item.image_url} className="w-16 h-20 object-cover" />
                    <div className="flex-1 self-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold">{item.name}</p>
                      <p className="text-xs text-amber-800 font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-6">
                  <div className="flex justify-between text-lg font-serif mb-6">
                    <span>Subtotal</span>
                    <span>₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      {!viewingCategory ? (
        <>
          {/* HERO SECTION */}
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1920" 
              className="absolute inset-0 w-full h-full object-cover opacity-80" 
              alt="Shreemati Heritage"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="relative z-10 text-center text-white px-6">
              <p className="text-[10px] uppercase tracking-[0.6em] mb-4 font-bold">From the heart of Marwar</p>
              <h2 className="text-5xl md:text-8xl font-serif italic mb-8">Timeless Drapes</h2>
              <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="px-10 py-4 border border-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-all">Explore Collections</button>
            </div>
          </section>

          {/* CATEGORY GRID */}
          <section className="py-24 px-6 max-w-7xl mx-auto" id="collections">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
              {CATEGORIES.map((cat) => (
                <div key={cat} onClick={() => setViewingCategory(cat)} className="group cursor-pointer text-center space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm shadow-sm">
                    <img 
                      src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      alt={cat}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                  <h3 className="text-sm font-serif tracking-[0.2em] uppercase">{cat}</h3>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* COLLECTION VIEW */
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <button onClick={() => setViewingCategory(null)} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-black mb-8">← Back to Collections</button>
          <h2 className="text-5xl font-serif italic mb-16">{viewingCategory} Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {categoryInventory.map((s) => (
              <div key={s.id} className="group text-center">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                  <img src={s.image_url} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105" alt={s.name} />
                </div>
                <h3 className="text-sm font-serif tracking-widest uppercase mb-2">{s.name}</h3>
                <p className="text-sm font-bold text-amber-900 mb-6">₹{s.price.toLocaleString('en-IN')}</p>
                <button onClick={() => addToCart(s)} className="w-full py-4 bg-stone-900 text-white text-[9px] uppercase tracking-widest hover:bg-amber-950 transition-colors">Add to Bag</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROFESSIONAL FOOTER */}
      <footer className="bg-stone-900 text-stone-300 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif text-white tracking-widest">SHREEMATI</h2>
            <p className="text-xs leading-relaxed max-w-sm text-stone-400">
              Handcrafting elegance in the heart of Jodhpur. We specialize in preserving the heritage of Indian drapes, bringing the finest Banarasi, Kanjivaram, and Bandhani weaves to the modern matriarch.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Contact Us</h4>
            <p className="text-xs">9252703456</p>
            <p className="text-xs italic">Jodhpur, Rajasthan, India</p>
            <a href="https://maps.app.goo.gl/ZWTxmrmdtPAGRLyf9" className="text-xs block text-amber-600 underline">Visit our Store</a>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Follow Our Journey</h4>
            <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="text-xs block hover:text-white transition-colors">Instagram</a>
            <p className="text-[10px] mt-8 text-stone-500 uppercase tracking-widest">© 2026 Shreemati Sarees Jodhpur</p>
          </div>
        </div>
      </footer>
    </main>
  );
}