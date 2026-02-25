"use client"; // We need this for the chat to be interactive
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
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setChatResponse(data.text);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-stone-50 text-stone-900 font-serif">
      <h1 className="text-5xl font-bold text-amber-900 my-10">Shreemati</h1>
      
      {/* Saree List */}
      <div className="grid gap-8 w-full max-w-2xl mb-24">
        {sarees.map((s) => (
          <div key={s.id} className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-2xl font-bold">{s.name}</h2>
            <p className="text-stone-600">₹{s.price}</p>
          </div>
        ))}
      </div>

      {/* Floating AI Chatbox */}
      <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border p-4 font-sans">
        <h3 className="font-bold text-amber-900 mb-2">Stylist Assistant</h3>
        <div className="text-sm text-stone-600 mb-4 h-24 overflow-y-auto italic">
          {loading ? "Thinking..." : chatResponse || "Ask me about our collection!"}
        </div>
        <div className="flex gap-2">
          <input 
            className="flex-1 border rounded-lg px-2 py-1 text-sm"
            placeholder="Suggest a wedding saree..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={askAI}
            className="bg-amber-800 text-white px-3 py-1 rounded-lg text-sm"
          >
            Ask
          </button>
        </div>
      </div>
    </main>
  );
}