"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi", "Kanjivaram", "Chanderi", "Bandhani", "Paithani", "Patola", "Organza", "Tussar Silk", "Chiffon", "Georgette"];

export default function Home() {
  // --- STATE ---
  const [sarees, setSarees] = useState<any[]>([]);
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // --- CHAT STATE (New & Improved) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: "Namaste. I am Radhika, your personal stylist. Looking for a specific color or occasion today?"}
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
  }, []);

  // Auto-scroll chat to bottom
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
    
    // 1. Add User Message immediately
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // 2. Call API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await res.json();
      
      // 3. Add Bot Response
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        throw new Error("Stylist unavailable");
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "My apologies, I am having trouble connecting to the inventory right now. Please try again in a moment." }]);
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
    <main className="min-h-screen bg-[#FDFCFB] text-[#2D2926] antialiased font-sans selection:bg-amber-100">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 py-5 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex flex-col cursor-pointer group" onClick={() => setViewingCategory(null)}>
          <h1 className="text-3xl md:text-4xl font-serif tracking-[0.15em] uppercase text-[#4A4036] group-hover:text-black transition-colors">Shreemati</h1>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-stone-400 group-hover:text-amber-700 transition-colors">Jodhpur • Est. 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#about" className="hidden md:block text-[10px] uppercase tracking-widest text-stone-500 hover:text-black transition-colors">Our Story</a>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative text-[10px] uppercase tracking-widest font-bold px-6 py-3 bg-stone-900 text-white hover:bg-amber-900 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Bag ({cart.length})
          </button>
        </div>
      </nav>

      {/* --- INTELLIGENT CHAT INTERFACE (Expanded & Fixed) --- */}
      <div className={`fixed bottom-0 right-0 z-[50] flex flex-col items-end p-4 md:p-6 transition-all duration-300 ${isChatOpen ? 'w-full md:w-[450px]' : 'w-auto'}`}>
        {isChatOpen && (
          <div className="w-full h-[500px] md:h-[600px] bg-white shadow-2xl rounded-t-xl md:rounded-xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Chat Header */}
            <div className="bg-[#2D2926] p-4 text-white flex justify-between items-center shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" className="object-cover w-full h-full" alt="Radhika" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg leading-none">Radhika</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] uppercase tracking-widest opacity-80">Online • Senior Stylist</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-xl">✕</button>
            </div>

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-stone-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-stone-800 text-white rounded-l-xl rounded-tr-xl' 
                      : 'bg-white text-stone-800 border border-stone-100 rounded-r-xl rounded-tl-xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-100 p-4 rounded-r-xl rounded-tl-xl flex gap-1">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="p-4 bg-white border-t border-stone-100 shrink-0">
              <div className="flex gap-2 relative">
                <input 
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all" 
                  placeholder="Type a message (e.g., 'Show me red bridal sarees')..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isChatLoading}
                  className="bg-amber-800 text-white px-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-amber-900 disabled:opacity-50 transition-all"
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
            className="group flex items-center gap-3 bg-stone-900 text-white pl-5 pr-2 py-2 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Ask Stylist</span>
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
               <span className="text-xl">💬</span>
            </div>
          </button>
        )}
      </div>

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
              <h2 className="text-2xl font-serif italic">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-stone-400 hover:text-black uppercase tracking-widest">Close</button>
            </div>
            
            {orderComplete ? (
              <div className="text-center py-32 space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-4xl">✓</div>
                <h3 className="text-2xl font-serif">Order Confirmed</h3>
                <p className="text-stone-500 italic px-8">Thank you for choosing Shreemati. We will contact you on WhatsApp shortly.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-32 text-stone-400 space-y-4">
                <p className="text-4xl opacity-20">🛍️</p>
                <p className="text-sm italic">Your bag is currently empty.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-xs underline hover:text-stone-800">Continue Shopping</button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-stone-50 pb-4 animate-in fade-in slide-in-from-bottom-2">
                    <img src={item.image_url} className="w-20 h-24 object-cover rounded-sm shadow-sm" />
                    <div className="flex-1 self-center space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.category}</p>
                      <p className="text-sm font-bold text-amber-800">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button className="text-stone-300 hover:text-red-500 self-start text-lg">×</button>
                  </div>
                ))}
                <div className="pt-6 bg-white sticky bottom-0">
                  <div className="flex justify-between text-lg font-serif mb-6 border-t border-dashed border-stone-200 pt-6">
                    <span>Total</span>
                    <span>₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full bg-stone-900 text-white py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-stone-800 active:scale-95 transition-all">
                    Secure Checkout
                  </button>
                  <div className="flex justify-center gap-4 mt-4 opacity-50 grayscale">
                    {/* Trust Badges - Text representation for simplicity */}
                    <span className="text-[10px] border border-stone-300 px-2 py-1 rounded">VISA</span>
                    <span className="text-[10px] border border-stone-300 px-2 py-1 rounded">UPI</span>
                    <span className="text-[10px] border border-stone-300 px-2 py-1 rounded">RuPay</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      {!viewingCategory ? (
        <>
          {/* HERO SECTION */}
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1920" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105" 
              alt="Shreemati Heritage"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
            <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <p className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] mb-6 font-bold text-amber-100">Handcrafted in Jodhpur</p>
              <h2 className="text-5xl md:text-8xl font-serif italic mb-10 leading-tight">Weaving Heritage <br/> into Every Drape</h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})} className="px-10 py-4 bg-white text-stone-900 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-50 transition-colors">
                  View Collections
                </button>
                <button onClick={() => setIsChatOpen(true)} className="px-10 py-4 border border-white/30 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
                  Consult Stylist
                </button>
              </div>
            </div>
          </section>

          {/* TRUST INDICATORS (The "Production Ready" Polish) */}
          <section className="py-16 border-b border-stone-100 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
              <div className="space-y-3">
                <div className="text-2xl text-amber-800">✦</div>
                <h3 className="text-xs uppercase tracking-widest font-bold">Silk Mark Certified</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">100% Pure Silk authenticated by the Silk Mark Organization of India.</p>
              </div>
              <div className="space-y-3">
                <div className="text-2xl text-amber-800">✈</div>
                <h3 className="text-xs uppercase tracking-widest font-bold">Global Shipping</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">Insured delivery to the US, UK, UAE, and 50+ countries.</p>
              </div>
              <div className="space-y-3">
                <div className="text-2xl text-amber-800">↺</div>
                <h3 className="text-xs uppercase tracking-widest font-bold">Heirloom Quality</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">Hand-checked 3 times in Jodhpur before dispatch.</p>
              </div>
            </div>
          </section>

          {/* COLLECTIONS GRID */}
          <section className="py-24 px-6 max-w-7xl mx-auto" id="collections">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif italic text-stone-800 mb-4">Curated Collections</h2>
              <div className="w-20 h-1 bg-amber-800 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-y-16">
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={cat} 
                  onClick={() => setViewingCategory(cat)} 
                  className="group cursor-pointer text-center space-y-4 animate-in fade-in duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110"
                      alt={cat}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-6 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="bg-white/90 text-stone-900 px-4 py-2 text-[9px] uppercase tracking-widest font-bold">View Items</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-serif tracking-[0.2em] uppercase group-hover:text-amber-800 transition-colors">{cat}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS (Social Proof) */}
          <section className="py-20 bg-stone-50 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif italic mb-12">Words from our Patrons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 shadow-sm">
                  <p className="text-sm italic text-stone-600 mb-4">"The Kanjivaram I ordered for my daughter's wedding was breathtaking. The packaging was so secure, and it arrived in London within 5 days."</p>
                  <p className="text-xs font-bold uppercase tracking-widest">- Anjali M., London</p>
                </div>
                <div className="bg-white p-8 shadow-sm">
                  <p className="text-sm italic text-stone-600 mb-4">"I was hesitant to buy online, but the video call service and Radhika's suggestions were spot on. The Banarasi silk is 100% authentic."</p>
                  <p className="text-xs font-bold uppercase tracking-widest">- Priya S., Mumbai</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* COLLECTION VIEW */
        <section className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
          <div className="flex justify-between items-end mb-12 border-b border-stone-100 pb-8">
            <div>
              <button onClick={() => setViewingCategory(null)} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-black mb-6 flex items-center gap-2 transition-colors">
                ← Back to Collections
              </button>
              <h2 className="text-5xl md:text-6xl font-serif italic text-stone-900">{viewingCategory} Edit</h2>
            </div>
            <p className="hidden md:block text-xs text-stone-400 italic">Showing {categoryInventory.length} exclusive pieces</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {categoryInventory.map((s, idx) => (
              <div key={s.id} className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 w-full shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img src={s.image_url} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105" alt={s.name} />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="bg-white p-3 rounded-full shadow-lg hover:bg-amber-50">♡</button>
                  </div>
                </div>
                <div className="text-center w-full px-4">
                  <h3 className="text-base font-serif tracking-wide uppercase font-medium text-stone-900 mb-2">{s.name}</h3>
                  <p className="text-xs text-stone-500 italic mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-center gap-4 border-t border-stone-100 pt-4">
                    <p className="text-lg font-bold text-amber-900">₹{s.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={() => addToCart(s)}
                      className="px-6 py-2 bg-stone-900 text-white text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-amber-800 transition-colors"
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

      {/* --- LUXURY FOOTER --- */}
      <footer className="bg-[#1C1917] text-stone-400 py-24 px-6 md:px-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-white tracking-widest mb-2">SHREEMATI</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-50">Heritage • Jodhpur • India</p>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-stone-500">
              Born from the narrow lanes of Jodhpur, Shreemati is a tribute to the timeless art of Indian weaving. We bridge the gap between ancient looms and modern luxury, ensuring every drape tells a story.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Concierge</h4>
            <div className="space-y-2 text-sm">
              <p>+91 9252703456</p>
              <p>hello@shreemati.com</p>
              <p className="pt-4 text-stone-600 italic">Flagship Store:<br/>Old City, Jodhpur<br/>Rajasthan, 342001</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Follow Us</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
                <span>Instagram</span> ↗
              </a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            </div>
            <p className="text-[10px] mt-8 text-stone-700 uppercase tracking-widest">© 2026 Shreemati Heritage</p>
          </div>
        </div>
      </footer>
    </main>
  );
}