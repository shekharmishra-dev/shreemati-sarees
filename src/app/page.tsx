"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi","Kanjivaram","Chanderi","Bandhani","Paithani","Patola","Organza","Tussar Silk","Chiffon","Georgette"];

const CATEGORY_DESC: Record<string,string> = {
  "Banarasi": "Woven in Varanasi with gold & silver zari threads",
  "Kanjivaram": "The queen of silks, from Tamil Nadu's temple looms",
  "Chanderi": "Featherweight weaves from the banks of the Betwa",
  "Bandhani": "Tie-dyed heritage of Rajasthan & Gujarat",
  "Paithani": "Peacock-motif silks from Maharashtra's Aurangabad",
  "Patola": "Double ikat masterwork from Patan, Gujarat",
  "Organza": "Translucent finesse with crisp, luminous drape",
  "Tussar Silk": "Wild silk with a natural golden-honey sheen",
  "Chiffon": "Weightless fabric for the modern silhouette",
  "Georgette": "Matte crinkle weave, fluid and effortlessly draped",
};

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [viewingCategory, setViewingCategory] = useState<string|null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role:'user'|'ai', text:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({x:-100,y:-100});
  const [heroVisible, setHeroVisible] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();
    setTimeout(() => setHeroVisible(true), 80);
    const moveCursor = (e: MouseEvent) => setCursorPos({x: e.clientX, y: e.clientY});
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const categoryInventory = sarees.filter(s => s.category === viewingCategory);
  const addToCart = (saree: any) => { setCart(prev => [...prev, saree]); setIsCartOpen(true); };
  const removeFromCart = (idx: number) => setCart(prev => prev.filter((_,i) => i !== idx));

  const askAI = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg }) });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Namaste. I am here to help you find the perfect drape. What occasion are you dressing for?" }]);
    }
    setLoading(false);
  };

  const simulateCheckout = () => {
    setOrderComplete(true);
    setTimeout(() => { setCart([]); setIsCartOpen(false); setOrderComplete(false); }, 4000);
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@200;300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bone:   #F5F0E8;
        --ivory:  #FDFBF7;
        --ink:    #1A1714;
        --indigo: #2C3157;
        --copper: #9B6A3C;
        --cop2:   #C4865A;
        --dust:   #C8BBA8;
        --mist:   #EDE8DF;
        --rule:   #DDD8CE;
        --serif:  'Playfair Display', Georgia, serif;
        --sans:   'DM Sans', sans-serif;
      }

      html { cursor: none; }
      body { font-family: var(--sans); background: var(--ivory); color: var(--ink); overflow-x: hidden; }

      /* CURSOR */
      .cursor {
        position: fixed; pointer-events: none; z-index: 9999;
        transform: translate(-50%,-50%);
        width: 9px; height: 9px; border-radius: 50%;
        background: var(--copper); mix-blend-mode: multiply;
        transition: width .22s ease, height .22s ease, background .22s;
      }

      /* TOP STRIP */
      .strip { height: 34px; background: var(--indigo); overflow: hidden; display: flex; align-items: center; }
      .strip-track { display: flex; animation: stripRun 22s linear infinite; white-space: nowrap; }
      @keyframes stripRun { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .strip-item { font-size: 10px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: rgba(245,240,232,.65); padding: 0 52px; font-family: var(--sans); }
      .strip-gem { color: var(--cop2); opacity: .55; }

      /* NAV */
      .nav {
        display: grid; grid-template-columns: 1fr auto 1fr;
        align-items: center; padding: 0 56px; height: 70px;
        border-bottom: 1px solid var(--rule); background: var(--ivory);
        position: sticky; top: 0; z-index: 50;
      }
      .nav-l { display: flex; gap: 36px; list-style: none; }
      .nav-r { display: flex; gap: 28px; justify-content: flex-end; align-items: center; list-style: none; }
      .nav-l a, .nav-r a, .nav-bag-btn {
        font-size: 10px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase;
        color: #777168; text-decoration: none; cursor: none; transition: color .2s;
        background: none; border: none; font-family: var(--sans);
      }
      .nav-l a:hover, .nav-r a:hover, .nav-bag-btn:hover { color: var(--ink); }
      .nav-center { text-align: center; cursor: none; }
      .nav-wm { font-family: var(--serif); font-size: 21px; font-weight: 400; letter-spacing: .38em; text-transform: uppercase; color: var(--ink); line-height: 1; }
      .nav-sub { font-size: 7px; letter-spacing: .55em; text-transform: uppercase; color: var(--dust); font-weight: 300; margin-top: 3px; }
      .bag-badge { display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; background: var(--indigo); color: var(--bone); border-radius: 50%; font-size: 9px; margin-left: 7px; }

      /* HERO */
      .hero { display: grid; grid-template-columns: 1fr 1fr; height: calc(100vh - 104px); min-height: 560px; opacity: 0; transition: opacity .9s ease; }
      .hero.vis { opacity: 1; }
      .hero-l {
        display: flex; flex-direction: column; justify-content: flex-end;
        padding: 64px 72px 64px 56px; border-right: 1px solid var(--rule);
        position: relative; overflow: hidden;
      }
      .hero-l::before {
        content: 'श्रीमती';
        position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
        font-family: var(--serif); font-size: clamp(80px,11vw,160px); font-weight: 700;
        color: transparent; -webkit-text-stroke: 1px var(--mist);
        line-height: 1; pointer-events: none; user-select: none; white-space: nowrap;
        letter-spacing: .05em;
      }
      .hero-kicker { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; position: relative; }
      .hero-kicker-line { width: 30px; height: 1px; background: var(--copper); }
      .hero-kicker-txt { font-size: 9px; letter-spacing: .5em; text-transform: uppercase; color: var(--copper); font-weight: 400; }
      .hero-h1 { font-family: var(--serif); font-size: clamp(40px,5vw,72px); font-weight: 400; line-height: 1.07; color: var(--ink); margin-bottom: 24px; position: relative; }
      .hero-h1 em { font-style: italic; color: var(--indigo); }
      .hero-p { font-size: 12px; font-weight: 300; line-height: 1.95; letter-spacing: .03em; color: #7A7060; max-width: 310px; margin-bottom: 44px; position: relative; }
      .hero-btns { display: flex; gap: 12px; position: relative; }
      .btn-primary { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; background: var(--ink); color: var(--bone); border: none; padding: 14px 30px; cursor: none; font-family: var(--sans); font-weight: 400; transition: background .22s, transform .15s; }
      .btn-primary:hover { background: var(--indigo); transform: translateY(-1px); }
      .btn-ghost { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; background: none; color: var(--ink); border: 1px solid var(--rule); padding: 14px 30px; cursor: none; font-family: var(--sans); font-weight: 300; transition: border-color .2s; }
      .btn-ghost:hover { border-color: var(--ink); }
      .hero-r { position: relative; overflow: hidden; }
      .hero-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: transform 10s ease; }
      .hero:hover .hero-img { transform: scale(1.04); }
      .hero-cap { position: absolute; bottom: 28px; right: 24px; writing-mode: vertical-rl; font-size: 8px; letter-spacing: .48em; text-transform: uppercase; color: rgba(253,251,247,.45); font-weight: 300; }

      /* STAT BAR */
      .statbar { display: flex; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
      .stat-item { flex: 1; text-align: center; padding: 36px 20px; border-right: 1px solid var(--rule); }
      .stat-item:last-child { border-right: none; }
      .stat-n { font-family: var(--serif); font-size: 36px; font-weight: 400; color: var(--ink); line-height: 1; margin-bottom: 6px; }
      .stat-label { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--dust); font-weight: 300; }

      /* COLLECTIONS */
      .coll-section { padding: 80px 0 0; }
      .coll-hdr { padding: 0 56px 48px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid var(--rule); }
      .sec-kicker { font-size: 9px; letter-spacing: .5em; text-transform: uppercase; color: var(--copper); font-weight: 400; margin-bottom: 10px; }
      .sec-h2 { font-family: var(--serif); font-size: clamp(30px,4vw,50px); font-weight: 400; line-height: 1.1; color: var(--ink); }
      .sec-h2 em { font-style: italic; }
      .coll-cnt { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: var(--dust); font-weight: 300; }

      /* BROADSHEET */
      .broadsheet { }
      .bs-row { display: grid; grid-template-columns: repeat(5,1fr); border-bottom: 1px solid var(--rule); }
      .bs-row:last-child { border-bottom: none; }
      .bs-cell { border-right: 1px solid var(--rule); overflow: hidden; cursor: none; position: relative; }
      .bs-cell:last-child { border-right: none; }
      .bs-row:first-child .bs-cell:first-child { grid-column: span 2; }
      .bs-inner { position: relative; height: 340px; overflow: hidden; }
      .bs-row:first-child .bs-cell:first-child .bs-inner { height: 480px; }
      .bs-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.82) saturate(.88); transition: transform 1.4s cubic-bezier(.25,.46,.45,.94), filter .8s; }
      .bs-cell:hover .bs-img { transform: scale(1.07); filter: brightness(.72) saturate(1.05); }
      .bs-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,23,20,.78) 0%, rgba(26,23,20,.05) 55%, transparent 100%); }
      .bs-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 22px; }
      .bs-name { font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--ivory); letter-spacing: .04em; margin-bottom: 5px; }
      .bs-row:first-child .bs-cell:first-child .bs-name { font-size: 22px; }
      .bs-desc { font-size: 9px; letter-spacing: .06em; line-height: 1.6; color: rgba(245,240,232,.55); font-weight: 300; max-width: 220px; opacity: 0; transform: translateY(5px); transition: opacity .35s, transform .35s; }
      .bs-cell:hover .bs-desc { opacity: 1; transform: translateY(0); }
      .bs-tag { position: absolute; top: 16px; right: 16px; width: 28px; height: 28px; border: 1px solid rgba(245,240,232,.2); display: flex; align-items: center; justify-content: center; font-size: 11px; color: rgba(245,240,232,.5); opacity: 0; transform: translate(4px,-4px); transition: opacity .3s, transform .3s; }
      .bs-cell:hover .bs-tag { opacity: 1; transform: translate(0,0); }

      /* PRODUCT PAGE */
      .prod-page { padding: 56px 56px 100px; }
      .crumb { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
      .crumb-back { font-size: 9px; letter-spacing: .38em; text-transform: uppercase; color: var(--dust); background: none; border: none; cursor: none; font-family: var(--sans); font-weight: 300; transition: color .2s; }
      .crumb-back:hover { color: var(--ink); }
      .crumb-slash { color: var(--rule); }
      .crumb-here { font-size: 9px; letter-spacing: .38em; text-transform: uppercase; color: var(--copper); font-weight: 400; }
      .prod-hdr { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px; border-bottom: 1px solid var(--rule); margin-bottom: 52px; }
      .prod-title { font-family: var(--serif); font-size: clamp(32px,5vw,56px); font-weight: 400; line-height: 1.1; }
      .prod-title em { font-style: italic; color: var(--indigo); }
      .prod-right-meta { text-align: right; }
      .prod-ct { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--dust); font-weight: 300; margin-bottom: 4px; }
      .prod-hint { font-family: var(--serif); font-size: 14px; font-style: italic; color: var(--copper); }

      /* PRODUCT GRID */
      .p-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
      .p-card { background: var(--mist); overflow: hidden; cursor: none; }
      .p-img-wrap { aspect-ratio: 3/4; overflow: hidden; position: relative; }
      .p-grid > .p-card:nth-child(1) .p-img-wrap { aspect-ratio: 2/2.5; }
      .p-img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.9); transition: transform 1.8s cubic-bezier(.25,.46,.45,.94), filter .8s; }
      .p-card:hover .p-img { transform: scale(1.06); filter: saturate(1.05); }
      .p-panel { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(26,23,20,.88); padding: 18px 20px; transform: translateY(100%); transition: transform .4s cubic-bezier(.25,.46,.45,.94); display: flex; align-items: center; justify-content: space-between; }
      .p-card:hover .p-panel { transform: translateY(0); }
      .p-panel-name { font-family: var(--serif); font-size: 14px; font-weight: 400; color: var(--ivory); }
      .p-add-btn { font-size: 8px; letter-spacing: .35em; text-transform: uppercase; background: var(--copper); color: var(--ivory); border: none; padding: 9px 16px; cursor: none; font-family: var(--sans); font-weight: 400; transition: background .2s; }
      .p-add-btn:hover { background: var(--cop2); }
      .p-foot { padding: 14px 16px; background: var(--ivory); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; }
      .p-name { font-family: var(--serif); font-size: 13px; font-weight: 400; letter-spacing: .03em; }
      .p-price { font-size: 12px; font-weight: 300; color: var(--copper); letter-spacing: .06em; }

      /* CART */
      .cart-scrim { position: fixed; inset: 0; z-index: 110; background: rgba(26,23,20,.45); backdrop-filter: blur(4px); animation: fi .25s ease; }
      @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
      .cart-panel { position: absolute; right: 0; top: 0; bottom: 0; width: 430px; background: var(--ivory); display: flex; flex-direction: column; animation: sr .38s cubic-bezier(.25,.46,.45,.94); }
      @keyframes sr { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .cart-head { padding: 34px 38px 22px; border-bottom: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: flex-start; }
      .cart-ttl { font-family: var(--serif); font-size: 25px; font-weight: 400; margin-bottom: 3px; }
      .cart-sub { font-size: 9px; letter-spacing: .35em; text-transform: uppercase; color: var(--dust); font-weight: 300; }
      .cart-close { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; background: none; border: none; cursor: none; font-family: var(--sans); color: var(--dust); transition: color .2s; }
      .cart-close:hover { color: var(--ink); }
      .cart-items { flex: 1; overflow-y: auto; padding: 28px 38px; }
      .cart-item { display: flex; gap: 16px; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--rule); }
      .cart-thumb { width: 64px; height: 84px; object-fit: cover; background: var(--bone); flex-shrink: 0; }
      .c-name { font-family: var(--serif); font-size: 15px; font-weight: 400; margin-bottom: 4px; }
      .c-price { font-size: 12px; color: var(--copper); font-weight: 300; letter-spacing: .05em; margin-bottom: 12px; }
      .c-rm { font-size: 8px; letter-spacing: .32em; text-transform: uppercase; background: none; border: none; cursor: none; font-family: var(--sans); color: var(--dust); transition: color .2s; }
      .c-rm:hover { color: var(--ink); }
      .cart-foot { padding: 22px 38px 38px; border-top: 1px solid var(--rule); }
      .cart-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
      .c-t-label { font-size: 9px; letter-spacing: .38em; text-transform: uppercase; color: var(--dust); font-weight: 300; }
      .c-t-val { font-family: var(--serif); font-size: 27px; font-weight: 400; }
      .cart-note-txt { font-size: 10px; color: var(--dust); font-weight: 300; letter-spacing: .04em; margin-bottom: 22px; line-height: 1.5; }
      .pay-btn { width: 100%; background: var(--indigo); color: var(--bone); border: none; padding: 16px; cursor: none; font-size: 9px; letter-spacing: .42em; text-transform: uppercase; font-family: var(--sans); font-weight: 400; transition: background .2s; }
      .pay-btn:hover { background: var(--ink); }
      .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
      .empty-glyph { font-family: var(--serif); font-size: 52px; color: var(--rule); font-style: italic; }
      .empty-msg { font-size: 10px; letter-spacing: .3em; text-transform: uppercase; color: var(--dust); font-weight: 300; }
      .success-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; padding: 0 38px; }
      .success-circle { width: 58px; height: 58px; border: 1px solid var(--copper); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--copper); }
      .success-ttl { font-family: var(--serif); font-size: 28px; font-weight: 400; }
      .success-msg { font-size: 11px; color: var(--dust); font-weight: 300; line-height: 1.8; max-width: 250px; }

      /* STYLIST */
      .stylist-area { position: fixed; bottom: 26px; right: 26px; z-index: 100; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
      .stylist-window { width: 344px; background: var(--ivory); border: 1px solid var(--rule); box-shadow: 0 20px 60px rgba(26,23,20,.13); display: flex; flex-direction: column; max-height: 450px; animation: fu .3s cubic-bezier(.25,.46,.45,.94); }
      @keyframes fu { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .s-hd { background: var(--indigo); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
      .s-hd-lbl { font-size: 8px; letter-spacing: .48em; text-transform: uppercase; color: rgba(245,240,232,.5); font-weight: 300; margin-bottom: 2px; }
      .s-hd-name { font-family: var(--serif); font-size: 19px; font-weight: 400; font-style: italic; color: var(--bone); }
      .s-close { background: none; border: none; cursor: none; color: rgba(245,240,232,.35); font-size: 15px; transition: color .2s; }
      .s-close:hover { color: rgba(245,240,232,.9); }
      .s-msgs { flex: 1; overflow-y: auto; padding: 18px 20px; background: var(--bone); display: flex; flex-direction: column; gap: 12px; }
      .msg { max-width: 86%; padding: 10px 14px; line-height: 1.65; }
      .msg.ai { background: var(--ivory); border: 1px solid var(--rule); font-family: var(--serif); font-size: 13px; font-style: italic; color: var(--ink); align-self: flex-start; }
      .msg.user { background: var(--indigo); color: var(--bone); font-size: 11px; font-weight: 300; letter-spacing: .03em; align-self: flex-end; }
      .typing { display: flex; gap: 4px; align-items: center; padding: 10px 14px; background: var(--ivory); border: 1px solid var(--rule); align-self: flex-start; }
      .td { width: 5px; height: 5px; background: var(--dust); border-radius: 50%; animation: tb 1.2s ease-in-out infinite; }
      .td:nth-child(2) { animation-delay: .2s; } .td:nth-child(3) { animation-delay: .4s; }
      @keyframes tb { 0%,80%,100% { transform: translateY(0); opacity: .4; } 40% { transform: translateY(-5px); opacity: 1; } }
      .s-input-row { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--rule); background: var(--ivory); flex-shrink: 0; }
      .s-input { flex: 1; border: none; outline: none; background: transparent; font-size: 11px; font-family: var(--sans); font-weight: 300; letter-spacing: .03em; color: var(--ink); }
      .s-input::placeholder { color: var(--dust); }
      .s-send { font-size: 8px; letter-spacing: .36em; text-transform: uppercase; background: var(--copper); color: var(--ivory); border: none; padding: 9px 14px; cursor: none; font-family: var(--sans); font-weight: 400; transition: background .2s; flex-shrink: 0; }
      .s-send:hover { background: var(--cop2); }
      .s-fab { width: 50px; height: 50px; border-radius: 50%; background: var(--indigo); border: none; cursor: none; box-shadow: 0 6px 26px rgba(44,49,87,.32); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; transition: transform .2s, box-shadow .2s; }
      .s-fab:hover { transform: scale(1.08); box-shadow: 0 10px 36px rgba(44,49,87,.4); }
      .fab-t { font-size: 7px; letter-spacing: .17em; text-transform: uppercase; color: rgba(245,240,232,.72); font-weight: 300; text-align: center; line-height: 1.4; }

      /* FOOTER */
      footer { background: var(--ink); color: rgba(245,240,232,.48); padding: 80px 56px 48px; }
      .f-grid { display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr; gap: 52px; max-width: 1280px; margin: 0 auto; padding-bottom: 52px; border-bottom: 1px solid rgba(245,240,232,.07); margin-bottom: 36px; }
      .f-wm { font-family: var(--serif); font-size: 26px; font-weight: 400; letter-spacing: .3em; text-transform: uppercase; color: var(--bone); margin-bottom: 4px; }
      .f-origin { font-size: 8px; letter-spacing: .52em; text-transform: uppercase; color: var(--cop2); opacity: .75; margin-bottom: 18px; }
      .f-desc { font-size: 11px; line-height: 1.9; font-weight: 300; max-width: 270px; color: rgba(245,240,232,.35); }
      .f-col-hd { font-size: 9px; letter-spacing: .44em; text-transform: uppercase; color: rgba(245,240,232,.78); font-weight: 400; margin-bottom: 18px; }
      .f-lnk { display: block; font-size: 11px; font-weight: 300; letter-spacing: .03em; color: rgba(245,240,232,.35); text-decoration: none; margin-bottom: 12px; cursor: none; transition: color .2s; }
      .f-lnk:hover { color: var(--cop2); }
      .f-base { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .f-copy { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: rgba(245,240,232,.18); }
      .f-rule { width: 44px; height: 1px; background: var(--copper); opacity: .28; }

      @media (max-width: 900px) {
        .nav { grid-template-columns: 1fr auto; padding: 0 20px; }
        .nav-l { display: none; }
        .hero { grid-template-columns: 1fr; height: auto; }
        .hero-r { height: 55vw; }
        .hero-l { padding: 44px 20px; }
        .hero-l::before { display: none; }
        .statbar { flex-wrap: wrap; }
        .stat-item { min-width: 50%; border-bottom: 1px solid var(--rule); }
        .coll-hdr { padding: 0 20px 36px; }
        .bs-row { grid-template-columns: repeat(2,1fr); }
        .bs-row .bs-cell:nth-child(n) { grid-column: span 1; }
        .bs-row:first-child .bs-cell:first-child { grid-column: span 2; }
        .prod-page { padding: 40px 20px 80px; }
        .p-grid { grid-template-columns: repeat(2,1fr); }
        .cart-panel { width: 100%; max-width: 420px; }
        .stylist-window { width: calc(100vw - 40px); }
        footer { padding: 56px 20px 40px; }
        .f-grid { grid-template-columns: 1fr; gap: 28px; }
      }
    `}</style>

    {/* CURSOR */}
    <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />

    {/* TOP STRIP */}
    <div className="strip">
      <div className="strip-track">
        {[...Array(8)].map((_,i) => (
          <span key={i} className="strip-item">
            Free Shipping above ₹15,000 <span className="strip-gem">✦</span> Handwoven by Master Artisans <span className="strip-gem">✦</span> Authenticity Certificate with Every Saree <span className="strip-gem">✦</span>
          </span>
        ))}
      </div>
    </div>

    {/* NAV */}
    <nav className="nav">
      <ul className="nav-l">
        <li><a onClick={() => setViewingCategory(null)}>Collections</a></li>
        <li><a>Heritage</a></li>
        <li><a>Atelier</a></li>
      </ul>
      <div className="nav-center" onClick={() => setViewingCategory(null)}>
        <div className="nav-wm">Shreemati</div>
        <div className="nav-sub">Jodhpur · Est. 1984</div>
      </div>
      <ul className="nav-r">
        <li><a>Care Guide</a></li>
        <li>
          <button className="nav-bag-btn" onClick={() => setIsCartOpen(true)}>
            Bag {cart.length > 0 && <span className="bag-badge">{cart.length}</span>}
          </button>
        </li>
      </ul>
    </nav>

    {/* STYLIST */}
    <div className="stylist-area">
      {isChatOpen && (
        <div className="stylist-window">
          <div className="s-hd">
            <div>
              <div className="s-hd-lbl">Personal Stylist</div>
              <div className="s-hd-name">Radhika</div>
            </div>
            <button className="s-close" onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="s-msgs">
            {chatMessages.length === 0 && (
              <div className="msg ai">Namaste. I'm Radhika — your personal drape consultant. Tell me the occasion, and I shall guide you to the perfect weave.</div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="typing"><div className="td"/><div className="td"/><div className="td"/></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="s-input-row">
            <input className="s-input" placeholder="Ask about weaves, occasions…" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && askAI()} />
            <button className="s-send" onClick={askAI}>Send</button>
          </div>
        </div>
      )}
      <button className="s-fab" onClick={() => setIsChatOpen(v => !v)}>
        <span className="fab-t">Your<br/>Stylist</span>
      </button>
    </div>

    {/* CART */}
    {isCartOpen && (
      <div className="cart-scrim" onClick={e => { if(e.target === e.currentTarget) setIsCartOpen(false); }}>
        <div className="cart-panel">
          <div className="cart-head">
            <div>
              <div className="cart-ttl">Selection</div>
              <div className="cart-sub">{cart.length} {cart.length === 1 ? 'piece' : 'pieces'}</div>
            </div>
            <button className="cart-close" onClick={() => setIsCartOpen(false)}>Close</button>
          </div>
          {orderComplete ? (
            <div className="success-state">
              <div className="success-circle">✓</div>
              <div className="success-ttl">Order Received</div>
              <p className="success-msg">Your drapes are being prepared with the utmost care. A confirmation will follow shortly.</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-glyph">◇</div>
              <div className="empty-msg">Your selection is empty</div>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <img src={item.image_url} className="cart-thumb" alt={item.name} />
                    <div style={{flex:1}}>
                      <div className="c-name">{item.name}</div>
                      <div className="c-price">₹{item.price.toLocaleString('en-IN')}</div>
                      <button className="c-rm" onClick={() => removeFromCart(idx)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-foot">
                <div className="cart-total-row">
                  <span className="c-t-label">Subtotal</span>
                  <span className="c-t-val">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="cart-note-txt">Shipping & duties calculated at checkout</p>
                <button className="pay-btn" onClick={simulateCheckout}>Proceed to Payment</button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* PAGE */}
    {!viewingCategory ? (
      <>
        {/* HERO */}
        <section className={`hero ${heroVisible ? 'vis' : ''}`}>
          <div className="hero-l">
            <div className="hero-kicker">
              <div className="hero-kicker-line"/>
              <span className="hero-kicker-txt">The House of Handwoven Heritage</span>
            </div>
            <h1 className="hero-h1">
              Where <em>Thread</em><br/>Becomes<br/>Legacy
            </h1>
            <p className="hero-p">
              Forty years of preserving India's most exquisite weaves — curated for the woman who understands craft.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => document.getElementById('coll')?.scrollIntoView({behavior:'smooth'})}>View Collections</button>
              <button className="btn-ghost" onClick={() => setIsChatOpen(true)}>Speak with Radhika</button>
            </div>
          </div>
          <div className="hero-r">
            <img src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1200" className="hero-img" alt="Heritage Sarees" />
            <div className="hero-cap">Jodhpur · Rajasthan · 1984</div>
          </div>
        </section>

        {/* STAT BAR */}
        <div className="statbar">
          {[{val:'40+',lbl:'Years of Heritage'},{val:'200+',lbl:'Artisan Families'},{val:'10',lbl:'Distinct Weaves'},{val:'∞',lbl:'Stories Woven'}].map(s => (
            <div key={s.lbl} className="stat-item">
              <div className="stat-n">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* COLLECTIONS */}
        <section id="coll" className="coll-section">
          <div className="coll-hdr">
            <div>
              <div className="sec-kicker">Our Collections</div>
              <h2 className="sec-h2">The <em>Weaves</em></h2>
            </div>
            <div className="coll-cnt">{CATEGORIES.length} Collections</div>
          </div>
          <div className="broadsheet">
            <div className="bs-row">
              {CATEGORIES.slice(0,4).map(cat => (
                <div key={cat} className="bs-cell" onClick={() => setViewingCategory(cat)}>
                  <div className="bs-inner">
                    <img src={sarees.find(s=>s.category===cat)?.image_url||'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} className="bs-img" alt={cat}/>
                    <div className="bs-grad"/>
                    <div className="bs-tag">↗</div>
                    <div className="bs-body">
                      <div className="bs-name">{cat}</div>
                      <div className="bs-desc">{CATEGORY_DESC[cat]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bs-row">
              {CATEGORIES.slice(4).map(cat => (
                <div key={cat} className="bs-cell" onClick={() => setViewingCategory(cat)}>
                  <div className="bs-inner">
                    <img src={sarees.find(s=>s.category===cat)?.image_url||'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'} className="bs-img" alt={cat}/>
                    <div className="bs-grad"/>
                    <div className="bs-tag">↗</div>
                    <div className="bs-body">
                      <div className="bs-name">{cat}</div>
                      <div className="bs-desc">{CATEGORY_DESC[cat]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    ) : (
      /* PRODUCTS */
      <section className="prod-page">
        <div className="crumb">
          <button className="crumb-back" onClick={() => setViewingCategory(null)}>← Collections</button>
          <span className="crumb-slash">/</span>
          <span className="crumb-here">{viewingCategory}</span>
        </div>
        <div className="prod-hdr">
          <div>
            <div className="sec-kicker">{CATEGORY_DESC[viewingCategory!] || viewingCategory}</div>
            <h2 className="prod-title">The <em>{viewingCategory}</em><br/>Collection</h2>
          </div>
          <div className="prod-right-meta">
            <div className="prod-ct">{categoryInventory.length} Pieces</div>
            <div className="prod-hint">Each made by hand</div>
          </div>
        </div>
        <div className="p-grid">
          {categoryInventory.map(s => (
            <div key={s.id} className="p-card">
              <div className="p-img-wrap">
                <img src={s.image_url} className="p-img" alt={s.name}/>
                <div className="p-panel">
                  <span className="p-panel-name">{s.name}</span>
                  <button className="p-add-btn" onClick={() => addToCart(s)}>Add</button>
                </div>
              </div>
              <div className="p-foot">
                <span className="p-name">{s.name}</span>
                <span className="p-price">₹{s.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* FOOTER */}
    <footer>
      <div className="f-grid">
        <div>
          <div className="f-wm">Shreemati</div>
          <div className="f-origin">Heritage Weaves · Jodhpur</div>
          <p className="f-desc">Since 1984, Shreemati has been a devoted custodian of India's handwoven traditions, preserving the artistry of over 200 artisan families across Rajasthan.</p>
        </div>
        <div>
          <div className="f-col-hd">Navigate</div>
          <a className="f-lnk" onClick={() => setViewingCategory(null)}>Collections</a>
          <a className="f-lnk">Heritage</a>
          <a className="f-lnk">Atelier</a>
          <a className="f-lnk">Care Guide</a>
        </div>
        <div>
          <div className="f-col-hd">Contact</div>
          <a className="f-lnk">+91 9252703456</a>
          <a className="f-lnk" href="https://maps.app.goo.gl/ZWTxmrmdtPAGRLyf9" target="_blank">Jodhpur, Rajasthan</a>
          <a className="f-lnk" href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank">Instagram</a>
        </div>
        <div>
          <div className="f-col-hd">Legal</div>
          <a className="f-lnk">Shipping Policy</a>
          <a className="f-lnk">Returns</a>
          <a className="f-lnk">Authenticity</a>
          <a className="f-lnk">Privacy</a>
        </div>
      </div>
      <div className="f-base">
        <div className="f-rule"/>
        <span className="f-copy">© 2026 Shreemati Heritage. All Rights Reserved.</span>
        <div className="f-rule"/>
      </div>
    </footer>
    </>
  );
}