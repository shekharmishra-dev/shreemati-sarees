"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi", "Kanjivaram", "Chanderi", "Bandhani", "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"];

// --- PROMOTIONAL BANNER ---
function PromotionalBanner() {
  return (
    <div className="bg-[#2C241B] text-[#E0D8CC] text-[10px] uppercase tracking-[0.25em] text-center py-3 relative z-50 font-medium border-b border-[#3E3428]">
      <p>✨ Complimentary shipping on domestic orders above ₹10,000 ✨</p>
    </div>
  );
}

export default function Home() {
  // --- STATE ---
  const [sarees, setSarees] = useState<any[]>([]);
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // --- CHAT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: "Namaste. I am Radhika, your personal stylist. Looking for a specific color or occasion today?"}
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    // Inject Fonts: Playfair Display (Serif) & Lato (Sans)
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  const categoryInventory = sarees.filter(s => s.category === viewingCategory);

  // --- ACTIONS ---
  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
    setIsCartOpen(true);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        throw new Error("Stylist unavailable");
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "My apologies, I am having trouble connecting to the inventory right now. For immediate personal assistance, please contact us on WhatsApp at +91 9252703456." }]);
    } finally {
      setIsChatLoading(false);
    }
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
    // Changed bg-white to bg-[#F5F2EB] (Raw Silk / Warm Beige)
    <main className="min-h-screen bg-[#F5F2EB] text-[#2C241B] antialiased selection:bg-[#B85C38] selection:text-white">
      <style jsx global>{`
        body { font-family: 'Lato', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
      
      <PromotionalBanner />

      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#DBCAB0] py-5 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex flex-col cursor-pointer group" onClick={() => setViewingCategory(null)}>
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-[#2C241B] group-hover:text-[#B85C38] transition-colors">Shreemati</h1>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C857E] mt-1 group-hover:text-black transition-colors">Jodhpur • Est. 2026</span>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <a href="#about" className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-[#6B5E51] hover:text-[#B85C38] transition-colors font-bold">Our Story</a>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-2.5 bg-[#2C241B] text-[#E0D8CC] hover:bg-[#B85C38] transition-all shadow-sm active:scale-95 border border-transparent"
          >
            Bag ({cart.length})
          </button>
        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      {!viewingCategory ? (
        <>
          {/* HERO SECTION: REPLACED WITH AUTHENTIC HANDLOOM IMAGE */}
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            {/*  */}
            <img 
              src="https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=2070" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[10%] sepia-[10%] scale-105" 
              alt="Handloom Weaving"
            />
            {/* Warm Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
            
            <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 font-bold text-[#DBCAB0] drop-shadow-md">Handcrafted in Jodhpur</p>
              
              <h2 className="text-5xl md:text-8xl font-serif italic mb-12 leading-tight drop-shadow-2xl">
                Weaving Heritage <br/> into Every Drape
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})} 
                  className="w-64 py-4 bg-[#F5F2EB] text-[#2C241B] text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#B85C38] hover:text-white transition-all shadow-xl"
                >
                  View Collections
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)} 
                  className="w-64 py-4 border border-[#F5F2EB]/40 backdrop-blur-sm text-[#F5F2EB] text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#F5F2EB] hover:text-[#2C241B] transition-all"
                >
                  Consult Stylist
                </button>
              </div>
            </div>
          </section>

          {/* COLLECTIONS GRID */}
          <section className="py-24 px-6 max-w-7xl mx-auto" id="collections">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif italic text-[#2C241B] mb-6">Curated Collections</h2>
              {/* Bronze Divider */}
              <div className="w-16 h-0.5 bg-[#B85C38] mx-auto opacity-60"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-y-16">
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={cat} 
                  onClick={() => setViewingCategory(cat)} 
                  className="group cursor-pointer text-center space-y-5 animate-in fade-in duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EBE5DF] shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-[#DBCAB0]/30">
                    <img 
                      src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-105"
                      alt={cat}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2C241B]/10 transition-colors duration-700" />
                    <div className="absolute bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-2 group-hover:translate-y-0">
                      <span className="bg-[#F5F2EB]/95 backdrop-blur text-[#2C241B] px-6 py-3 text-[9px] uppercase tracking-[0.25em] font-bold shadow-lg border border-[#DBCAB0]">View Edit</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-serif tracking-[0.2em] uppercase text-[#2C241B] group-hover:text-[#B85C38] transition-colors duration-500">{cat}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* TRUST INDICATORS */}
          <section className="py-20 border-t border-[#DBCAB0] bg-[#F5F2EB]" id="about">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center px-6">
              <div className="space-y-4">
                <div className="text-3xl text-[#B85C38]">✦</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C241B]">Silk Mark Certified</h3>
                <p className="text-xs text-[#6B5E51] font-light max-w-xs mx-auto leading-relaxed">100% Pure Silk authenticated by the Silk Mark Organization of India.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl text-[#B85C38]">✈</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C241B]">Global Shipping</h3>
                <p className="text-xs text-[#6B5E51] font-light max-w-xs mx-auto leading-relaxed">Insured delivery to the US, UK, UAE, and 50+ countries.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl text-[#B85C38]">↺</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C241B]">Heirloom Quality</h3>
                <p className="text-xs text-[#6B5E51] font-light max-w-xs mx-auto leading-relaxed">Hand-checked 3 times in Jodhpur before dispatch.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* COLLECTION VIEW */
        <section className="py-12 px-6 max-w-7xl mx-auto min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#DBCAB0] pb-8 sticky top-[80px] z-30 bg-[#F5F2EB]/95 backdrop-blur-md py-6 transition-all">
            <div>
              <button onClick={() => setViewingCategory(null)} className="text-[10px] uppercase tracking-[0.2em] text-[#8C857E] hover:text-[#2C241B] mb-4 flex items-center gap-2 transition-colors font-bold">
                ← Back to Collections
              </button>
              <h2 className="text-5xl md:text-7xl font-serif italic text-[#2C241B]">{viewingCategory} Edit</h2>
            </div>
            <p className="hidden md:block text-xs text-[#8C857E] font-light italic mt-4 md:mt-0">Showing {categoryInventory.length} exclusive pieces</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mt-16">
            {categoryInventory.map((s, idx) => (
              <div key={s.id} className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EBE5DF] mb-8 w-full shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-[#DBCAB0]/30">
                  <img src={s.image_url} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105" alt={s.name} />
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <button className="bg-[#F5F2EB] p-3 rounded-full shadow-lg hover:bg-[#E0D8CC] text-[#B85C38]">♡</button>
                  </div>
                </div>
                <div className="text-center w-full px-2">
                  <h3 className="text-lg font-serif tracking-wide uppercase font-medium text-[#2C241B] mb-3">{s.name}</h3>
                  <p className="text-xs text-[#6B5E51] font-light italic mb-5 line-clamp-2 leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-center gap-5 border-t border-[#DBCAB0] pt-6">
                    <p className="text-xl font-serif font-bold text-[#B85C38]">₹{s.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={() => addToCart(s)}
                      className="px-8 py-3 bg-[#2C241B] text-[#E0D8CC] text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#B85C38] hover:text-white transition-all shadow-md active:scale-95"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- FLOATING CHAT BUTTON --- */}
      <div className={`fixed bottom-8 right-8 z-[50] flex flex-col items-end transition-all duration-300 ${isChatOpen ? 'w-full md:w-[450px]' : 'w-auto'}`}>
        {isChatOpen && (
          <div className="w-full h-[550px] bg-[#F5F2EB] shadow-2xl rounded-2xl border border-[#DBCAB0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5 mb-4">
            <div className="bg-[#2C241B] p-5 text-[#E0D8CC] flex justify-between items-center shadow-md shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#DBCAB0] border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" className="object-cover w-full h-full grayscale-[20%]" alt="Radhika" />
                </div>
                <div>
                  <h3 className="font-serif italic text-xl tracking-wide">Radhika</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <p className="text-[9px] uppercase tracking-widest text-[#E0D8CC]/70">Senior Stylist</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#EBE5DF] space-y-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#2C241B] text-[#E0D8CC] rounded-l-2xl rounded-tr-2xl font-light' 
                      : 'bg-[#F5F2EB] text-[#2C241B] border border-[#DBCAB0] rounded-r-2xl rounded-tl-2xl font-light'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#F5F2EB] border border-[#DBCAB0] p-4 rounded-r-2xl rounded-tl-2xl flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-5 bg-[#F5F2EB] border-t border-[#DBCAB0] shrink-0">
              <div className="flex gap-3 relative">
                <input 
                  className="flex-1 bg-[#EBE5DF] border border-[#DBCAB0] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#B85C38] focus:ring-0 transition-all font-light placeholder:text-[#8C857E] text-[#2C241B]" 
                  placeholder="Ask Radhika..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isChatLoading}
                  className="bg-[#2C241B] text-[#E0D8CC] px-6 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#B85C38] disabled:opacity-50 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="group flex items-center gap-4 bg-[#2C241B] text-[#E0D8CC] pl-6 pr-1.5 py-1.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-white/10"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-bold">Ask Stylist</span>
            <div className="w-10 h-10 bg-[#B85C38] rounded-full flex items-center justify-center">
               <span className="text-lg text-white">💬</span>
            </div>
          </button>
        )}
      </div>

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-[#2C241B]/50 backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-[#F5F2EB] p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10 border-b border-[#DBCAB0] pb-6">
              <h2 className="text-3xl font-serif italic text-[#2C241B]">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-[#8C857E] hover:text-black uppercase tracking-widest transition-colors">Close</button>
            </div>
            
            {orderComplete ? (
              <div className="text-center py-32 space-y-6">
                <div className="w-20 h-20 bg-[#EBE5DF] rounded-full flex items-center justify-center mx-auto text-[#2C241B] text-4xl">✓</div>
                <h3 className="text-2xl font-serif text-[#2C241B]">Order Confirmed</h3>
                <p className="text-[#6B5E51] font-light px-8 leading-relaxed">Thank you for choosing Shreemati. We will contact you on WhatsApp shortly to confirm dispatch.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-32 text-[#8C857E] space-y-4">
                <p className="text-4xl opacity-30">🛍️</p>
                <p className="text-sm font-light uppercase tracking-wide">Your bag is empty.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-xs underline hover:text-[#2C241B] transition-colors">Continue Shopping</button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-5 border-b border-[#DBCAB0] pb-6 animate-in fade-in slide-in-from-bottom-2">
                    <img src={item.image_url} className="w-20 h-28 object-cover shadow-sm" />
                    <div className="flex-1 self-center space-y-2">
                      <p className="text-xs uppercase tracking-[0.1em] font-bold text-[#2C241B]">{item.name}</p>
                      <p className="text-xs text-[#8C857E]">{item.category}</p>
                      <p className="text-sm font-serif font-bold text-[#B85C38]">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button className="text-[#DBCAB0] hover:text-[#8B0000] self-start text-xl transition-colors">×</button>
                  </div>
                ))}
                <div className="pt-6 bg-[#F5F2EB] sticky bottom-0">
                  <div className="flex justify-between text-xl font-serif mb-8 border-t border-dashed border-[#DBCAB0] pt-6 text-[#2C241B]">
                    <span>Total</span>
                    <span>₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-[#2C241B] text-[#E0D8CC] py-5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#B85C38] active:scale-95 transition-all shadow-lg">
                    Secure Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#191511] text-[#8C857E] py-28 px-6 md:px-12 border-t border-[#2C241B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <div>
              <h2 className="text-4xl font-serif text-[#E0D8CC] tracking-[0.1em] mb-3">SHREEMATI</h2>
              <p className="text-xs uppercase tracking-[0.4em] text-[#5D554F]">Heritage • Jodhpur • India</p>
            </div>
            <p className="text-base font-light leading-loose max-w-md text-[#8C857E]">
              Born from the narrow lanes of Jodhpur, Shreemati is a tribute to the timeless art of Indian weaving. We bridge the gap between ancient looms and modern luxury.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#E0D8CC] text-xs uppercase tracking-[0.25em] font-bold border-b border-[#2C241B] pb-4 inline-block">Concierge</h4>
            <div className="space-y-4 text-sm font-light">
              <p className="hover:text-white transition-colors cursor-pointer">+91 9252703456</p>
              <p className="hover:text-white transition-colors cursor-pointer">hello@shreemati.com</p>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#E0D8CC] text-xs uppercase tracking-[0.25em] font-bold border-b border-[#2C241B] pb-4 inline-block">Follow Us</h4>
            <div className="flex flex-col gap-4 text-sm font-light">
              <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">Instagram ↗</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
            <p className="text-[10px] mt-12 text-[#44403C] uppercase tracking-[0.2em]">© 2026 Shreemati Heritage</p>
          </div>
        </div>
      </footer>
    </main>
  );
}