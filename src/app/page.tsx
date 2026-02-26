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
    <div className="bg-[#2D2926] text-white text-[10px] uppercase tracking-[0.25em] text-center py-2 relative z-50 font-medium">
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
    // Inject Fonts: Using Playfair Display (Serif) & Lato (Sans)
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
    <main className="min-h-screen bg-[#FDFCFB] text-[#1C1917] antialiased selection:bg-[#E67E22] selection:text-white">
      {/* GLOBAL STYLES */}
      <style jsx global>{`
        body { font-family: 'Lato', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
      
      <PromotionalBanner />

      {/* --- HEADER (Inspired by image_7094b5.jpg) --- */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E0DA] py-5 px-6 md:px-12 flex justify-between items-center transition-all">
        {/* Left Aligned Logo Stack */}
        <div className="flex flex-col cursor-pointer group" onClick={() => setViewingCategory(null)}>
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-[#1C1917] group-hover:text-[#A67C52] transition-colors">Shreemati</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C857E] mt-1 group-hover:text-black transition-colors">Jodhpur • Est. 2026</span>
        </div>

        {/* Right Aligned Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          <a href="#about" className="hidden md:block text-[11px] uppercase tracking-[0.2em] text-[#5D554F] hover:text-[#E67E22] transition-colors font-bold">Our Story</a>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-2.5 bg-[#1C1917] text-white hover:bg-[#E67E22] transition-all shadow-sm active:scale-95"
          >
            Bag ({cart.length})
          </button>
        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      {!viewingCategory ? (
        <>
          {/* HERO SECTION (Inspired by image_70ab04.jpg) */}
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background: Using a nature/texture image to match the 'branch' vibe from your inspiration */}
            <img 
              src="https://images.unsplash.com/photo-1628135805218-d51676230f80?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[30%] scale-105" 
              alt="Heritage Texture"
            />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
            
            <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000">
              <p className="text-xs md:text-sm uppercase tracking-[0.5em] mb-6 font-bold text-[#E67E22] drop-shadow-md">Handcrafted in Jodhpur</p>
              
              {/* The Big Serif Headline */}
              <h2 className="text-5xl md:text-8xl font-serif italic mb-12 leading-tight drop-shadow-lg">
                Weaving Heritage <br/> into Every Drape
              </h2>
              
              {/* Two Distinct Buttons */}
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})} 
                  className="w-64 py-4 bg-white text-[#1C1917] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#E67E22] hover:text-white transition-all shadow-xl"
                >
                  View Collections
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)} 
                  className="w-64 py-4 border border-white/50 backdrop-blur-sm text-white text-xs uppercase tracking-[0.25em] font-bold hover:bg-white hover:text-[#1C1917] transition-all"
                >
                  Consult Stylist
                </button>
              </div>
            </div>
          </section>

          {/* COLLECTIONS GRID */}
          <section className="py-24 px-6 max-w-7xl mx-auto" id="collections">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#1C1917] mb-6">Curated Collections</h2>
              <div className="w-16 h-1 bg-[#E67E22] mx-auto opacity-80"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-y-16">
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={cat} 
                  onClick={() => setViewingCategory(cat)} 
                  className="group cursor-pointer text-center space-y-5 animate-in fade-in duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F0EB] shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img 
                      src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-105"
                      alt={cat}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                    <div className="absolute bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white/95 backdrop-blur text-[#1C1917] px-6 py-3 text-[10px] uppercase tracking-[0.25em] font-bold shadow-lg">View Edit</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-serif tracking-[0.25em] uppercase text-[#1C1917] group-hover:text-[#E67E22] transition-colors duration-500">{cat}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* TRUST INDICATORS */}
          <section className="py-20 border-t border-[#E5E0DA] bg-white" id="about">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center px-6">
              <div className="space-y-4">
                <div className="text-3xl text-[#E67E22]">✦</div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C1917]">Silk Mark Certified</h3>
                <p className="text-xs text-[#5D554F] font-light max-w-xs mx-auto leading-relaxed">100% Pure Silk authenticated by the Silk Mark Organization of India.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl text-[#E67E22]">✈</div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C1917]">Global Shipping</h3>
                <p className="text-xs text-[#5D554F] font-light max-w-xs mx-auto leading-relaxed">Insured delivery to the US, UK, UAE, and 50+ countries.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl text-[#E67E22]">↺</div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C1917]">Heirloom Quality</h3>
                <p className="text-xs text-[#5D554F] font-light max-w-xs mx-auto leading-relaxed">Hand-checked 3 times in Jodhpur before dispatch.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* COLLECTION VIEW (Inspired by image_7094b5.jpg) */
        <section className="py-12 px-6 max-w-7xl mx-auto min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#E5E0DA] pb-8 sticky top-[80px] z-30 bg-[#FDFCFB]/95 backdrop-blur-md py-6 transition-all">
            <div>
              <button onClick={() => setViewingCategory(null)} className="text-[10px] uppercase tracking-[0.2em] text-[#8C857E] hover:text-[#1C1917] mb-4 flex items-center gap-2 transition-colors font-bold">
                ← Back to Collections
              </button>
              <h2 className="text-5xl md:text-7xl font-serif italic text-[#1C1917]">{viewingCategory} Edit</h2>
            </div>
            <p className="hidden md:block text-xs text-[#8C857E] font-light italic mt-4 md:mt-0">Showing {categoryInventory.length} exclusive pieces</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mt-16">
            {categoryInventory.map((s, idx) => (
              <div key={s.id} className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F0EB] mb-8 w-full shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img src={s.image_url} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105" alt={s.name} />
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <button className="bg-white p-3 rounded-full shadow-lg hover:bg-[#F2F0EB] text-[#E67E22]">♡</button>
                  </div>
                </div>
                <div className="text-center w-full px-2">
                  <h3 className="text-lg font-serif tracking-wide uppercase font-medium text-[#1C1917] mb-3">{s.name}</h3>
                  <p className="text-xs text-[#5D554F] font-light italic mb-5 line-clamp-2 leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-center gap-5 border-t border-[#E5E0DA] pt-6">
                    <p className="text-xl font-serif font-bold text-[#E67E22]">₹{s.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={() => addToCart(s)}
                      className="px-8 py-3 bg-[#1C1917] text-white text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#E67E22] transition-all shadow-md active:scale-95"
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

      {/* --- FLOATING CHAT BUTTON (Inspired by image_70ab04.jpg) --- */}
      <div className={`fixed bottom-8 right-8 z-[50] flex flex-col items-end transition-all duration-300 ${isChatOpen ? 'w-full md:w-[450px]' : 'w-auto'}`}>
        {isChatOpen && (
          <div className="w-full h-[550px] bg-white shadow-2xl rounded-2xl border border-[#E5E0DA] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5 mb-4">
            {/* Chat Header */}
            <div className="bg-[#1C1917] p-5 text-white flex justify-between items-center shadow-md shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#D4C4B5] border border-white/20 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" className="object-cover w-full h-full grayscale-[20%]" alt="Radhika" />
                </div>
                <div>
                  <h3 className="font-serif italic text-xl tracking-wide">Radhika</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <p className="text-[9px] uppercase tracking-widest text-white/80">Senior Stylist</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity text-xl">✕</button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F9F8F6] space-y-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1C1917] text-white rounded-l-2xl rounded-tr-2xl font-light' 
                      : 'bg-white text-[#1C1917] border border-[#E5E0DA] rounded-r-2xl rounded-tl-2xl font-light'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E0DA] p-4 rounded-r-2xl rounded-tl-2xl flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C857E] rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-5 bg-white border-t border-[#E5E0DA] shrink-0">
              <div className="flex gap-3 relative">
                <input 
                  className="flex-1 bg-[#F9F8F6] border border-[#E5E0DA] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#E67E22] focus:ring-0 transition-all font-light placeholder:text-[#8C857E]" 
                  placeholder="Ask Radhika..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isChatLoading}
                  className="bg-[#1C1917] text-white px-6 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#E67E22] disabled:opacity-50 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* THE FLOATING "PILL" BUTTON (Inspired by image_70ab04.jpg) */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="group flex items-center gap-3 bg-[#1C1917] text-white pl-6 pr-1.5 py-1.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-white/10"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Ask Stylist</span>
            {/* Orange Icon Circle */}
            <div className="w-10 h-10 bg-[#E67E22] rounded-full flex items-center justify-center">
               <span className="text-lg text-white">💬</span>
            </div>
          </button>
        )}
      </div>

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-[#1C1917]/50 backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10 border-b border-[#E5E0DA] pb-6">
              <h2 className="text-3xl font-serif italic text-[#1C1917]">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-[#8C857E] hover:text-black uppercase tracking-widest transition-colors">Close</button>
            </div>
            
            {orderComplete ? (
              <div className="text-center py-32 space-y-6">
                <div className="w-20 h-20 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto text-[#4A4036] text-4xl">✓</div>
                <h3 className="text-2xl font-serif">Order Confirmed</h3>
                <p className="text-[#5D554F] font-light px-8 leading-relaxed">Thank you for choosing Shreemati. We will contact you on WhatsApp shortly to confirm dispatch.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-32 text-[#8C857E] space-y-4">
                <p className="text-4xl opacity-30">🛍️</p>
                <p className="text-sm font-light uppercase tracking-wide">Your bag is empty.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-xs underline hover:text-[#1C1917] transition-colors">Continue Shopping</button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-5 border-b border-[#E5E0DA] pb-6 animate-in fade-in slide-in-from-bottom-2">
                    <img src={item.image_url} className="w-20 h-28 object-cover shadow-sm" />
                    <div className="flex-1 self-center space-y-2">
                      <p className="text-xs uppercase tracking-[0.1em] font-bold text-[#1C1917]">{item.name}</p>
                      <p className="text-xs text-[#8C857E]">{item.category}</p>
                      <p className="text-sm font-serif font-bold text-[#E67E22]">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button className="text-[#D4C4B5] hover:text-[#8B0000] self-start text-xl transition-colors">×</button>
                  </div>
                ))}
                <div className="pt-6 bg-white sticky bottom-0">
                  <div className="flex justify-between text-xl font-serif mb-8 border-t border-dashed border-[#E5E0DA] pt-6 text-[#1C1917]">
                    <span>Total</span>
                    <span>₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-[#1C1917] text-white py-5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#E67E22] active:scale-95 transition-all shadow-lg">
                    Secure Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LUXURY FOOTER --- */}
      <footer className="bg-[#1C1917] text-[#8C857E] py-28 px-6 md:px-12 border-t border-[#2D2926]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <div>
              <h2 className="text-4xl font-serif text-white tracking-[0.1em] mb-3">SHREEMATI</h2>
              <p className="text-xs uppercase tracking-[0.4em] text-[#5D554F]">Heritage • Jodhpur • India</p>
            </div>
            <p className="text-base font-light leading-loose max-w-md text-[#A8A29E]">
              Born from the narrow lanes of Jodhpur, Shreemati is a tribute to the timeless art of Indian weaving. We bridge the gap between ancient looms and modern luxury, ensuring every drape tells a story.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-white text-xs uppercase tracking-[0.25em] font-bold border-b border-[#2D2926] pb-4 inline-block">Concierge</h4>
            <div className="space-y-4 text-sm font-light">
              <p className="hover:text-white transition-colors cursor-pointer">+91 9252703456</p>
              <p className="hover:text-white transition-colors cursor-pointer">hello@shreemati.com</p>
              <p className="pt-4 text-[#5D554F] italic leading-relaxed">Flagship Store:<br/>Old City, Jodhpur<br/>Rajasthan, 342001</p>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-white text-xs uppercase tracking-[0.25em] font-bold border-b border-[#2D2926] pb-4 inline-block">Follow Us</h4>
            <div className="flex flex-col gap-4 text-sm font-light">
              <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Instagram</span> ↗
              </a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            </div>
            <p className="text-[10px] mt-12 text-[#44403C] uppercase tracking-[0.2em]">© 2026 Shreemati Heritage</p>
          </div>
        </div>
      </footer>
    </main>
  );
}