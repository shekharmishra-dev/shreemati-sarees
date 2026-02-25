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
    setChatResponse("Thinking...");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setChatResponse(data.text || "I'm here to help! Ask me anything about our sarees.");
    } catch (err) {
      setChatResponse("Connection issue. Please check your API key in Vercel.");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-stone-50 font-serif">
      <h1 className="text-5xl font-bold text-amber-900 my-10">Shreemati</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-24 font-sans">
        {sarees.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200">
            <div className="aspect-[4/5] bg-stone-100">
              <img 
                src={s.image_url || 'https://via.placeholder.com/400x500?text=Direct+Link+Needed'} 
                className="w-full h-full object-cover"
                alt={s.name}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-stone-800">{s.name}</h2>
              <p className="text-amber-800 font-bold text-xl mt-2">₹{s.price}</p>
              <p className="text-stone-500 text-sm mt-1">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border-2 border-amber-100 p-4 font-sans">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-amber-900">Stylist Assistant</h3>
        </div>
        <div className="text-sm text-stone-700 mb-4 h-32 overflow-y-auto bg-stone-50 p-3 rounded-lg border">
          {chatResponse || "Namaste! How can I help you choose a saree today?"}
        </div>
        <div className="flex gap-2">
          <input 
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ask about silk sarees..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && askAI()}
          />
          <button 
            onClick={askAI}
            disabled={loading}
            className="bg-amber-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-900 disabled:bg-stone-400"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </main>
  );
}