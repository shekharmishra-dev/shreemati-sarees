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
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const categoryInventory = sarees.filter(s => s.category === viewingCategory);

  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
    setIsCartOpen(true);
  };

  const askAI = async () => {
    if (!input) return;
    setLoading(true);
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
    setInput('');
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
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex flex-col cursor-pointer" onClick={() => setViewingCategory(null)}>
          <h1 className="text-2xl md:text-4xl font-serif tracking-[0.2em] uppercase font-light text-[#4A4036]">Shreemati</h1>
          <span className="text-[8px] uppercase tracking-[0.4em] text-stone-400">Jodhpur • Heritage • Craft</span>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative text-[10px] uppercase tracking-widest font-bold px-5 py-2 bg-stone-900 text-white rounded-sm">
          Bag ({cart.length})
        </button>
      </nav>

      {/* --- FLOATING AI STYLIST (RADHIKA) --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="w-80 md:w-96 bg-white shadow-2xl rounded-lg border border-stone-100 mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-stone-900 p-4 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70">Lead Stylist</p>
                <h3 className="font-serif italic text-lg">Radhika</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-xl">✕</button>
            </div>
            <div className="p-6 h-64 overflow-y-auto bg-stone-50 text-sm italic text-stone-600">
              {chatResponse || "Namaste. I am Radhika. Tell me the occasion, and I shall guide you to the perfect weave."}
            </div>
            <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
              <input 
                className="flex-1 text-xs focus:outline-none bg-transparent" 
                placeholder="Ask about fabrics, styling..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
              />
              <button onClick={askAI} className="text-[10px] uppercase font-bold text-amber-800">
                {loading ? "..." : "Ask"}
              </button>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-amber-800 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <span className="text-xs uppercase tracking-tighter font-bold">Stylist</span>
        </button>
      </div>

      {/* --- SIDE BAG (CART) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm">
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
                  <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-5 text-[10px] uppercase tracking-widest font-bold">
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

      {/* --- FOOTER --- */}
      <footer className="bg-stone-900 text-stone-300 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif text-white tracking-widest">SHREEMATI</h2>
            <p className="text-xs leading-relaxed max-w-sm text-stone-400 mx-auto md:mx-0">
              Handcrafting elegance in Jodhpur. We specialize in preserving heritage drapes for the modern matriarch.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Contact</h4>
            <p className="text-xs">+91 9252703456</p>
            <a href="https://maps.app.goo.gl/ZWTxmrmdtPAGRLyf9" className="text-xs block text-amber-600 underline">Jodhpur, India</a>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Social</h4>
            <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="text-xs block hover:text-white transition-colors">Instagram</a>
            <p className="text-[10px] mt-8 text-stone-500 tracking-widest uppercase">© 2026 Shreemati Heritage</p>
          </div>
        </div>
      </footer>
    </main>
  );
}