"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi","Kanjivaram","Chanderi","Bandhani","Paithani","Patola","Organza","Tussar Silk","Chiffon","Georgette"];

const CAT_META: Record<string,{origin:string,craft:string}> = {
  "Banarasi":   { origin:"Varanasi, UP",      craft:"Zari brocade weaving" },
  "Kanjivaram": { origin:"Kanchipuram, TN",   craft:"Temple-motif silk" },
  "Chanderi":   { origin:"Chanderi, MP",      craft:"Sheer cotton-silk blend" },
  "Bandhani":   { origin:"Jaipur, Rajasthan", craft:"Tie-dye resist work" },
  "Paithani":   { origin:"Aurangabad, MH",    craft:"Tapestry-woven silk" },
  "Patola":     { origin:"Patan, Gujarat",    craft:"Double-ikat silk" },
  "Organza":    { origin:"Pan-India",         craft:"Plain-weave crisp silk" },
  "Tussar Silk":{ origin:"Jharkhand",         craft:"Wild-silk hand-loom" },
  "Chiffon":    { origin:"Pan-India",         craft:"Lightweight crêpe weave" },
  "Georgette":  { origin:"Pan-India",         craft:"Crinkle-twist weave" },
};

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [viewingCategory, setViewingCategory] = useState<string|null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{who:"u"|"r",text:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const catRefs = useRef<(HTMLDivElement|null)[]>([]);

  useEffect(() => {
    supabase.from("Sarees").select("*").then(({data}) => { if (data) setSarees(data); });
    setMounted(true);
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const inventory = sarees.filter(s => s.category === viewingCategory);
  const addToCart = (s:any) => { setCart(p=>[...p,s]); setCartOpen(true); };
  const removeFromCart = (i:number) => setCart(p=>p.filter((_,j)=>j!==i));

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const txt = chatInput.trim(); setChatInput(""); setChatLoading(true);
    setMessages(p=>[...p,{who:"u",text:txt}]);
    try {
      const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:txt})});
      const d = await r.json();
      setMessages(p=>[...p,{who:"r",text:d.text}]);
    } catch { setMessages(p=>[...p,{who:"r",text:"Namaste. What occasion are you dressing for? I shall find you the perfect drape."}]); }
    setChatLoading(false);
  };

  const checkout = () => {
    setOrderDone(true);
    setTimeout(()=>{ setCart([]); setCartOpen(false); setOrderDone(false); },4200);
  };

  const total = cart.reduce((s,i)=>s+i.price,0);

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Epilogue:wght@200;300;400;500&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      :root{
        --saffron:#F2E8D5;
        --paper:  #FBF7F0;
        --turmeric:#C8922A;
        --clay:   #8B3A2A;
        --indigo: #1B2B52;
        --smoke:  #6B6255;
        --rule:   #E0D8CC;
        --ink:    #1C1712;
        --white:  #FEFDFB;
      }
      html,body{height:100%}
      body{font-family:'Epilogue',sans-serif;background:var(--paper);color:var(--ink);overflow-x:hidden}

      /* ─── SCROLLBAR ─── */
      ::-webkit-scrollbar{width:3px}
      ::-webkit-scrollbar-track{background:var(--saffron)}
      ::-webkit-scrollbar-thumb{background:var(--turmeric)}

      /* ─── TOP RIBBON ─── */
      .ribbon{
        background:var(--indigo);
        height:32px;display:flex;align-items:center;overflow:hidden;
      }
      .ribbon-inner{
        display:flex;white-space:nowrap;
        animation:ribbonMove 24s linear infinite;
      }
      @keyframes ribbonMove{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .ribbon-seg{
        font-family:'Epilogue',sans-serif;font-size:9px;font-weight:300;
        letter-spacing:.42em;text-transform:uppercase;
        color:rgba(251,247,240,.55);padding:0 56px;
      }
      .ribbon-gem{color:var(--turmeric);opacity:.7;margin:0 2px}

      /* ─── NAV ─── */
      .nav{
        display:flex;align-items:center;justify-content:space-between;
        padding:0 52px;height:68px;
        border-bottom:1px solid var(--rule);
        background:var(--paper);
        position:sticky;top:0;z-index:60;
      }
      .nav-logo{cursor:pointer;text-align:center}
      .nav-logo-en{
        font-family:'Italiana',serif;font-size:26px;font-weight:400;
        letter-spacing:.28em;text-transform:uppercase;color:var(--ink);
        line-height:1;
      }
      .nav-logo-hi{
        font-size:11px;letter-spacing:.25em;color:var(--turmeric);
        font-family:'EB Garamond',serif;font-style:italic;
        margin-top:1px;display:block;opacity:.8;
      }
      .nav-side{display:flex;gap:32px;list-style:none;align-items:center}
      .nav-side a,.nav-side button{
        font-size:9.5px;font-weight:300;letter-spacing:.32em;
        text-transform:uppercase;color:var(--smoke);
        text-decoration:none;cursor:pointer;
        background:none;border:none;font-family:'Epilogue',sans-serif;
        transition:color .2s;
      }
      .nav-side a:hover,.nav-side button:hover{color:var(--ink)}
      .bag-pill{
        display:inline-flex;align-items:center;gap:7px;
        font-size:9.5px;font-weight:300;letter-spacing:.32em;
        text-transform:uppercase;color:var(--smoke);
        background:none;border:none;cursor:pointer;
        font-family:'Epilogue',sans-serif;transition:color .2s;
      }
      .bag-pill:hover{color:var(--ink)}
      .bag-num{
        display:inline-flex;align-items:center;justify-content:center;
        width:18px;height:18px;background:var(--clay);color:var(--white);
        border-radius:50%;font-size:9px;
      }

      /* ─── HERO ─── */
      .hero{
        display:grid;grid-template-columns:45fr 55fr;
        height:calc(100vh - 100px);min-height:560px;
      }
      .hero-text{
        display:flex;flex-direction:column;justify-content:center;
        padding:72px 64px 72px 52px;border-right:1px solid var(--rule);
        position:relative;
      }
      .hero-year{
        font-size:9px;letter-spacing:.58em;text-transform:uppercase;
        color:var(--turmeric);font-weight:300;margin-bottom:36px;
        display:flex;align-items:center;gap:14px;
      }
      .hero-year::before{content:'';display:block;width:24px;height:1px;background:var(--turmeric)}
      .hero-h1{
        font-family:'Italiana',serif;
        font-size:clamp(52px,7vw,96px);
        font-weight:400;line-height:.96;
        letter-spacing:.01em;color:var(--ink);
        margin-bottom:32px;
      }
      .hero-h1 .accent{color:var(--clay)}
      .hero-body{
        font-size:12px;font-weight:300;line-height:2;
        color:var(--smoke);max-width:340px;
        margin-bottom:52px;letter-spacing:.03em;
      }
      .hero-actions{display:flex;gap:12px;align-items:center}
      .cta-fill{
        font-size:9px;letter-spacing:.4em;text-transform:uppercase;
        background:var(--indigo);color:var(--saffron);
        border:none;padding:14px 28px;cursor:pointer;
        font-family:'Epilogue',sans-serif;font-weight:300;
        transition:background .25s,transform .15s;
      }
      .cta-fill:hover{background:var(--clay);transform:translateY(-1px)}
      .cta-line{
        font-size:9px;letter-spacing:.4em;text-transform:uppercase;
        background:none;color:var(--smoke);
        border:1px solid var(--rule);padding:14px 28px;cursor:pointer;
        font-family:'Epilogue',sans-serif;font-weight:300;
        transition:border-color .2s,color .2s;
      }
      .cta-line:hover{border-color:var(--smoke);color:var(--ink)}
      .hero-footnote{
        position:absolute;bottom:40px;left:52px;
        font-size:8px;letter-spacing:.45em;text-transform:uppercase;
        color:var(--rule);font-weight:300;
      }
      .hero-img-col{position:relative;overflow:hidden;background:var(--saffron)}
      .hero-img{
        width:100%;height:100%;object-fit:cover;
        object-position:center top;
        transition:transform 12s ease;
        opacity:0;transition:opacity .6s ease,transform 12s ease;
      }
      .hero-img.loaded{opacity:1}
      .hero-img-col:hover .hero-img{transform:scale(1.04)}
      .hero-fold{
        position:absolute;top:0;left:0;bottom:0;width:1px;
        background:linear-gradient(to bottom,transparent 0%,rgba(28,23,18,.1) 50%,transparent 100%);
      }
      .hero-number{
        position:absolute;top:40px;right:40px;
        font-family:'Italiana',serif;font-size:120px;font-weight:400;
        color:transparent;-webkit-text-stroke:1px rgba(251,247,240,.2);
        line-height:1;pointer-events:none;user-select:none;
      }

      /* ─── LOOKBOOK STRIPS (HOME CATEGORIES) ─── */
      .lookbook{display:flex;flex-direction:column}
      .lb-divider{
        display:flex;align-items:center;justify-content:space-between;
        padding:28px 52px;border-bottom:1px solid var(--rule);
      }
      .lb-section-label{
        font-size:9px;letter-spacing:.52em;text-transform:uppercase;
        color:var(--turmeric);font-weight:300;
      }
      .lb-count{
        font-size:9px;letter-spacing:.35em;text-transform:uppercase;
        color:var(--rule);font-weight:300;
      }

      /* each category row */
      .lb-row{
        display:grid;grid-template-columns:1fr 1fr;
        border-bottom:1px solid var(--rule);
        min-height:440px;cursor:pointer;
        position:relative;overflow:hidden;
      }
      .lb-row:nth-child(even){direction:rtl}
      .lb-row:nth-child(even) .lb-row-text{direction:ltr}
      .lb-row-img{
        position:relative;overflow:hidden;
        background:var(--saffron);
      }
      .lb-row-img img{
        width:100%;height:100%;object-fit:cover;
        filter:brightness(.88) saturate(.9);
        transition:transform 1.6s cubic-bezier(.25,.46,.45,.94),filter 1s;
      }
      .lb-row:hover .lb-row-img img{
        transform:scale(1.07);
        filter:brightness(.78) saturate(1.05);
      }
      .lb-row-text{
        display:flex;flex-direction:column;justify-content:center;
        padding:64px 72px;border-left:1px solid var(--rule);
        position:relative;background:var(--paper);
        transition:background .4s;
      }
      .lb-row:nth-child(even) .lb-row-text{border-left:none;border-right:1px solid var(--rule)}
      .lb-row:hover .lb-row-text{background:var(--saffron)}
      .lb-idx{
        font-family:'Italiana',serif;font-size:72px;font-weight:400;
        color:var(--rule);line-height:1;margin-bottom:16px;
        transition:color .3s;
      }
      .lb-row:hover .lb-idx{color:var(--turmeric)}
      .lb-cat{
        font-family:'Italiana',serif;
        font-size:clamp(32px,3.5vw,52px);
        font-weight:400;color:var(--ink);
        letter-spacing:.02em;margin-bottom:10px;line-height:1.1;
      }
      .lb-origin{
        font-size:9px;letter-spacing:.42em;text-transform:uppercase;
        color:var(--turmeric);font-weight:300;margin-bottom:18px;
      }
      .lb-craft{
        font-size:12px;font-weight:300;color:var(--smoke);
        line-height:1.8;letter-spacing:.03em;max-width:260px;
        margin-bottom:32px;
      }
      .lb-arrow{
        display:inline-flex;align-items:center;gap:12px;
        font-size:9px;letter-spacing:.4em;text-transform:uppercase;
        color:var(--ink);font-weight:300;
        opacity:0;transform:translateX(-8px);
        transition:opacity .35s,transform .35s;
      }
      .lb-row:hover .lb-arrow{opacity:1;transform:translateX(0)}
      .lb-arrow-line{
        width:0;height:1px;background:var(--clay);
        transition:width .4s cubic-bezier(.25,.46,.45,.94);
      }
      .lb-row:hover .lb-arrow-line{width:32px}

      /* ─── INTERLUDE BAND ─── */
      .interlude{
        display:grid;grid-template-columns:1fr 1fr 1fr;
        border-bottom:1px solid var(--rule);
      }
      .int-cell{
        padding:48px 52px;border-right:1px solid var(--rule);
        display:flex;flex-direction:column;gap:8px;
      }
      .int-cell:last-child{border-right:none}
      .int-num{
        font-family:'Italiana',serif;font-size:48px;font-weight:400;
        color:var(--turmeric);line-height:1;
      }
      .int-label{
        font-size:9px;letter-spacing:.42em;text-transform:uppercase;
        color:var(--smoke);font-weight:300;
      }
      .int-desc{
        font-family:'EB Garamond',serif;font-size:14px;font-style:italic;
        color:var(--smoke);line-height:1.7;margin-top:4px;
      }

      /* ─── PRODUCT PAGE ─── */
      .prod-wrapper{padding:0}
      .prod-top-bar{
        display:flex;align-items:center;justify-content:space-between;
        padding:24px 52px;border-bottom:1px solid var(--rule);
      }
      .back-btn{
        display:flex;align-items:center;gap:10px;
        font-size:9px;letter-spacing:.38em;text-transform:uppercase;
        color:var(--smoke);background:none;border:none;cursor:pointer;
        font-family:'Epilogue',sans-serif;font-weight:300;transition:color .2s;
      }
      .back-btn:hover{color:var(--ink)}
      .back-line{width:24px;height:1px;background:var(--rule);transition:width .25s}
      .back-btn:hover .back-line{width:36px;background:var(--ink)}
      .prod-count{
        font-size:9px;letter-spacing:.4em;text-transform:uppercase;
        color:var(--rule);font-weight:300;
      }

      .prod-title-section{
        padding:56px 52px 48px;
        border-bottom:1px solid var(--rule);
        display:grid;grid-template-columns:1fr auto;
        align-items:end;gap:40px;
      }
      .prod-kicker{
        font-size:9px;letter-spacing:.52em;text-transform:uppercase;
        color:var(--turmeric);font-weight:300;margin-bottom:12px;
      }
      .prod-h2{
        font-family:'Italiana',serif;
        font-size:clamp(40px,6vw,80px);
        font-weight:400;line-height:.96;color:var(--ink);
      }
      .prod-subtext{
        font-family:'EB Garamond',serif;font-size:15px;font-style:italic;
        color:var(--smoke);line-height:1.7;max-width:400px;
        margin-top:16px;
      }
      .prod-tag-pair{text-align:right}
      .prod-tag-num{
        font-family:'Italiana',serif;font-size:64px;font-weight:400;
        color:var(--rule);line-height:1;
      }
      .prod-tag-lbl{
        font-size:8px;letter-spacing:.42em;text-transform:uppercase;
        color:var(--rule);font-weight:300;display:block;
      }

      /* product grid */
      .p-grid{
        display:grid;grid-template-columns:repeat(3,1fr);
        gap:1px;background:var(--rule);
      }
      .p-card{background:var(--paper);overflow:hidden;cursor:pointer;position:relative}
      .p-img-wrap{
        aspect-ratio:3/4;overflow:hidden;position:relative;
        background:var(--saffron);
      }
      .p-img{
        width:100%;height:100%;object-fit:cover;
        filter:saturate(.88);
        transition:transform 1.8s cubic-bezier(.25,.46,.45,.94),filter .8s;
      }
      .p-card:hover .p-img{transform:scale(1.06);filter:saturate(1.05)}
      .p-overlay{
        position:absolute;inset:0;
        background:rgba(28,23,18,0);
        transition:background .4s;
        display:flex;align-items:flex-end;
      }
      .p-card:hover .p-overlay{background:rgba(28,23,18,.55)}
      .p-cta{
        padding:20px;width:100%;
        transform:translateY(100%);
        transition:transform .38s cubic-bezier(.25,.46,.45,.94);
        display:flex;justify-content:space-between;align-items:center;
      }
      .p-card:hover .p-cta{transform:translateY(0)}
      .p-cta-name{
        font-family:'Italiana',serif;font-size:16px;color:var(--saffron);
        font-weight:400;
      }
      .p-cta-btn{
        font-size:8px;letter-spacing:.36em;text-transform:uppercase;
        background:var(--turmeric);color:var(--white);
        border:none;padding:9px 16px;cursor:pointer;
        font-family:'Epilogue',sans-serif;font-weight:300;
        transition:background .2s;
      }
      .p-cta-btn:hover{background:var(--clay)}
      .p-card-foot{
        padding:16px 18px;display:flex;justify-content:space-between;align-items:center;
        border-top:1px solid var(--rule);
      }
      .p-card-name{
        font-family:'Italiana',serif;font-size:15px;font-weight:400;
        color:var(--ink);letter-spacing:.03em;
      }
      .p-card-price{
        font-size:12px;font-weight:300;color:var(--turmeric);letter-spacing:.05em;
      }

      /* ─── CART DRAWER ─── */
      .scrim{
        position:fixed;inset:0;z-index:120;
        background:rgba(28,23,18,.5);
        backdrop-filter:blur(3px);
        animation:scrimIn .28s ease;
      }
      @keyframes scrimIn{from{opacity:0}to{opacity:1}}
      .drawer{
        position:absolute;right:0;top:0;bottom:0;
        width:420px;background:var(--paper);
        display:flex;flex-direction:column;
        border-left:1px solid var(--rule);
        animation:drawIn .38s cubic-bezier(.25,.46,.45,.94);
      }
      @keyframes drawIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
      .d-head{
        padding:32px 36px 22px;border-bottom:1px solid var(--rule);
        display:flex;justify-content:space-between;align-items:flex-start;
      }
      .d-title{
        font-family:'Italiana',serif;font-size:24px;font-weight:400;margin-bottom:3px;
      }
      .d-sub{
        font-size:9px;letter-spacing:.36em;text-transform:uppercase;
        color:var(--smoke);font-weight:300;
      }
      .d-close{
        font-size:9px;letter-spacing:.32em;text-transform:uppercase;
        background:none;border:none;cursor:pointer;
        font-family:'Epilogue',sans-serif;color:var(--smoke);
        transition:color .2s;
      }
      .d-close:hover{color:var(--ink)}
      .d-items{flex:1;overflow-y:auto;padding:24px 36px}
      .d-item{
        display:flex;gap:14px;padding-bottom:22px;margin-bottom:22px;
        border-bottom:1px solid var(--rule);
      }
      .d-thumb{width:62px;height:80px;object-fit:cover;background:var(--saffron);flex-shrink:0}
      .d-name{font-family:'Italiana',serif;font-size:15px;margin-bottom:4px}
      .d-price{font-size:11px;color:var(--turmeric);font-weight:300;letter-spacing:.05em;margin-bottom:10px}
      .d-rm{
        font-size:8px;letter-spacing:.32em;text-transform:uppercase;
        background:none;border:none;cursor:pointer;
        font-family:'Epilogue',sans-serif;color:var(--smoke);transition:color .2s;
      }
      .d-rm:hover{color:var(--clay)}
      .d-foot{padding:20px 36px 36px;border-top:1px solid var(--rule)}
      .d-total-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
      .d-total-lbl{font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--smoke);font-weight:300}
      .d-total-val{font-family:'Italiana',serif;font-size:28px;font-weight:400}
      .d-note{font-size:10px;color:var(--smoke);font-weight:300;margin-bottom:20px;line-height:1.5;letter-spacing:.03em}
      .d-pay{
        width:100%;background:var(--indigo);color:var(--saffron);
        border:none;padding:16px;cursor:pointer;
        font-size:9px;letter-spacing:.44em;text-transform:uppercase;
        font-family:'Epilogue',sans-serif;font-weight:300;
        transition:background .22s;
      }
      .d-pay:hover{background:var(--clay)}
      .d-empty{
        flex:1;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:10px;
      }
      .d-empty-glyph{
        font-family:'Italiana',serif;font-size:60px;color:var(--rule);
      }
      .d-empty-msg{font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:var(--smoke);font-weight:300}
      .d-success{
        flex:1;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:16px;text-align:center;padding:0 36px;
      }
      .d-ok{
        width:56px;height:56px;border-radius:50%;
        border:1px solid var(--turmeric);display:flex;align-items:center;justify-content:center;
        font-size:20px;color:var(--turmeric);
      }
      .d-ok-title{font-family:'Italiana',serif;font-size:28px}
      .d-ok-msg{font-size:11px;color:var(--smoke);font-weight:300;line-height:1.85;max-width:240px}

      /* ─── STYLIST CHAT ─── */
      .stylist-wrap{
        position:fixed;bottom:24px;right:24px;z-index:110;
        display:flex;flex-direction:column;align-items:flex-end;gap:10px;
      }
      .chat-card{
        width:340px;background:var(--paper);
        border:1px solid var(--rule);
        box-shadow:0 16px 56px rgba(28,23,18,.12);
        display:flex;flex-direction:column;max-height:440px;
        animation:chatUp .3s cubic-bezier(.25,.46,.45,.94);
      }
      @keyframes chatUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .chat-hd{
        background:var(--indigo);padding:16px 20px;
        display:flex;justify-content:space-between;align-items:center;flex-shrink:0;
      }
      .chat-lbl{font-size:8px;letter-spacing:.48em;text-transform:uppercase;color:rgba(251,247,240,.45);font-weight:300;margin-bottom:2px}
      .chat-name{font-family:'Italiana',serif;font-size:20px;font-weight:400;color:var(--saffron)}
      .chat-x{background:none;border:none;cursor:pointer;color:rgba(251,247,240,.35);font-size:16px;transition:color .2s}
      .chat-x:hover{color:rgba(251,247,240,.85)}
      .chat-body{
        flex:1;overflow-y:auto;padding:16px 18px;
        background:var(--saffron);
        display:flex;flex-direction:column;gap:10px;
      }
      .bubble{max-width:88%;padding:10px 13px;line-height:1.65;font-size:12px}
      .bubble.r{
        background:var(--paper);border:1px solid var(--rule);
        font-family:'EB Garamond',serif;font-size:13px;font-style:italic;
        color:var(--ink);align-self:flex-start;
      }
      .bubble.u{
        background:var(--indigo);color:rgba(251,247,240,.88);
        font-weight:300;letter-spacing:.02em;align-self:flex-end;
      }
      .typing-row{display:flex;gap:4px;align-items:center;padding:10px 13px;background:var(--paper);border:1px solid var(--rule);align-self:flex-start}
      .t-d{width:5px;height:5px;background:var(--rule);border-radius:50%;animation:td 1.2s ease-in-out infinite}
      .t-d:nth-child(2){animation-delay:.2s}.t-d:nth-child(3){animation-delay:.4s}
      @keyframes td{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
      .chat-input-row{
        display:flex;align-items:center;gap:8px;padding:12px 14px;
        border-top:1px solid var(--rule);background:var(--paper);flex-shrink:0;
      }
      .chat-inp{
        flex:1;border:none;outline:none;background:transparent;
        font-size:11px;font-family:'Epilogue',sans-serif;font-weight:300;
        letter-spacing:.03em;color:var(--ink);
      }
      .chat-inp::placeholder{color:var(--rule)}
      .chat-send{
        font-size:8px;letter-spacing:.36em;text-transform:uppercase;
        background:var(--turmeric);color:var(--white);border:none;padding:8px 14px;
        cursor:pointer;font-family:'Epilogue',sans-serif;font-weight:300;
        transition:background .2s;flex-shrink:0;
      }
      .chat-send:hover{background:var(--clay)}
      .chat-fab{
        width:50px;height:50px;border-radius:50%;
        background:var(--indigo);border:none;cursor:pointer;
        box-shadow:0 6px 24px rgba(27,43,82,.3);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;
        transition:transform .2s,box-shadow .2s,background .2s;
      }
      .chat-fab:hover{transform:scale(1.1);background:var(--clay);box-shadow:0 10px 32px rgba(139,58,42,.35)}
      .fab-lbl{font-size:7px;letter-spacing:.18em;text-transform:uppercase;color:rgba(251,247,240,.65);font-weight:300;text-align:center;line-height:1.4}

      /* ─── FOOTER ─── */
      footer{background:var(--ink);color:rgba(251,247,240,.45);padding:80px 52px 48px}
      .f-top{
        display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
        gap:52px;max-width:1260px;margin:0 auto;
        padding-bottom:52px;border-bottom:1px solid rgba(251,247,240,.07);margin-bottom:36px;
      }
      .f-logo-en{font-family:'Italiana',serif;font-size:28px;letter-spacing:.28em;text-transform:uppercase;color:var(--saffron);line-height:1;margin-bottom:3px}
      .f-logo-hi{font-family:'EB Garamond',serif;font-size:13px;font-style:italic;color:var(--turmeric);opacity:.75;margin-bottom:18px;display:block}
      .f-about{font-size:11px;font-weight:300;line-height:1.95;max-width:280px;color:rgba(251,247,240,.32);letter-spacing:.02em}
      .f-hd{font-size:9px;letter-spacing:.44em;text-transform:uppercase;color:rgba(251,247,240,.72);font-weight:300;margin-bottom:18px}
      .f-link{display:block;font-size:11px;font-weight:300;letter-spacing:.03em;color:rgba(251,247,240,.32);text-decoration:none;margin-bottom:12px;cursor:pointer;transition:color .2s}
      .f-link:hover{color:var(--turmeric)}
      .f-base{max-width:1260px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
      .f-copy{font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:rgba(251,247,240,.15)}
      .f-ornament{font-family:'Italiana',serif;font-size:14px;color:var(--turmeric);opacity:.3;letter-spacing:.2em}

      /* ─── RESPONSIVE ─── */
      @media(max-width:900px){
        .nav{padding:0 20px}
        .nav-side{gap:18px}
        .hero{grid-template-columns:1fr;height:auto}
        .hero-img-col{height:55vw}
        .hero-text{padding:44px 20px 44px}
        .lb-row{grid-template-columns:1fr;min-height:auto}
        .lb-row-text{padding:36px 20px;border:none;border-top:1px solid var(--rule)}
        .lb-row:nth-child(even){direction:ltr}
        .interlude{grid-template-columns:1fr}
        .int-cell{border-right:none;border-bottom:1px solid var(--rule)}
        .prod-title-section{grid-template-columns:1fr;padding:36px 20px 28px}
        .p-grid{grid-template-columns:repeat(2,1fr)}
        .prod-top-bar{padding:20px}
        .drawer{width:100%;max-width:420px}
        .chat-card{width:calc(100vw - 40px)}
        footer{padding:56px 20px 40px}
        .f-top{grid-template-columns:1fr;gap:28px}
        .lb-divider{padding:24px 20px}
      }
    `}</style>

    {/* RIBBON */}
    <div className="ribbon">
      <div className="ribbon-inner">
        {[...Array(8)].map((_,i)=>(
          <span key={i} className="ribbon-seg">
            Handwoven Heritage Since 1984
            <span className="ribbon-gem"> ✦ </span>
            Free Shipping Above ₹15,000
            <span className="ribbon-gem"> ✦ </span>
            Authentic Weaves with Certificate
            <span className="ribbon-gem"> ✦ </span>
          </span>
        ))}
      </div>
    </div>

    {/* NAV */}
    <nav className="nav">
      <ul className="nav-side">
        <li><a onClick={()=>setViewingCategory(null)}>Collections</a></li>
        <li><a>Heritage</a></li>
        <li><a>Atelier</a></li>
      </ul>

      <div className="nav-logo" onClick={()=>setViewingCategory(null)}>
        <span className="nav-logo-en">Shreemati</span>
        <span className="nav-logo-hi">श्रीमती — Jodhpur</span>
      </div>

      <ul className="nav-side" style={{justifyContent:"flex-end"}}>
        <li><a onClick={()=>setChatOpen(v=>!v)}>Stylist</a></li>
        <li>
          <button className="bag-pill" onClick={()=>setCartOpen(true)}>
            Bag {cart.length>0 && <span className="bag-num">{cart.length}</span>}
          </button>
        </li>
      </ul>
    </nav>

    {/* STYLIST */}
    <div className="stylist-wrap">
      {chatOpen && (
        <div className="chat-card">
          <div className="chat-hd">
            <div>
              <div className="chat-lbl">Personal Stylist</div>
              <div className="chat-name">Radhika</div>
            </div>
            <button className="chat-x" onClick={()=>setChatOpen(false)}>✕</button>
          </div>
          <div className="chat-body">
            {messages.length===0 && (
              <div className="bubble r">Namaste. I'm Radhika, your personal drape consultant. What occasion are you dressing for?</div>
            )}
            {messages.map((m,i)=>(
              <div key={i} className={`bubble ${m.who}`}>{m.text}</div>
            ))}
            {chatLoading && <div className="typing-row"><div className="t-d"/><div className="t-d"/><div className="t-d"/></div>}
            <div ref={chatEnd}/>
          </div>
          <div className="chat-input-row">
            <input className="chat-inp" placeholder="Ask about weaves, occasions…" value={chatInput}
              onChange={e=>setChatInput(e.target.value)} onKeyPress={e=>e.key==="Enter"&&sendChat()}/>
            <button className="chat-send" onClick={sendChat}>Send</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={()=>setChatOpen(v=>!v)}>
        <span className="fab-lbl">Your<br/>Stylist</span>
      </button>
    </div>

    {/* CART */}
    {cartOpen && (
      <div className="scrim" onClick={e=>{if(e.target===e.currentTarget)setCartOpen(false)}}>
        <div className="drawer">
          <div className="d-head">
            <div>
              <div className="d-title">Your Selection</div>
              <div className="d-sub">{cart.length} {cart.length===1?"piece":"pieces"}</div>
            </div>
            <button className="d-close" onClick={()=>setCartOpen(false)}>Close</button>
          </div>

          {orderDone ? (
            <div className="d-success">
              <div className="d-ok">✓</div>
              <div className="d-ok-title">Order Received</div>
              <p className="d-ok-msg">Your drapes are being prepared with care. A confirmation follows shortly.</p>
            </div>
          ) : cart.length===0 ? (
            <div className="d-empty">
              <div className="d-empty-glyph">◇</div>
              <div className="d-empty-msg">Your selection is empty</div>
            </div>
          ) : (
            <>
              <div className="d-items">
                {cart.map((item,idx)=>(
                  <div key={idx} className="d-item">
                    <img src={item.image_url} className="d-thumb" alt={item.name}/>
                    <div style={{flex:1}}>
                      <div className="d-name">{item.name}</div>
                      <div className="d-price">₹{item.price.toLocaleString("en-IN")}</div>
                      <button className="d-rm" onClick={()=>removeFromCart(idx)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-foot">
                <div className="d-total-row">
                  <span className="d-total-lbl">Subtotal</span>
                  <span className="d-total-val">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="d-note">Shipping & duties calculated at checkout</p>
                <button className="d-pay" onClick={checkout}>Proceed to Payment</button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* ─── MAIN CONTENT ─── */}
    {!viewingCategory ? (
      <>
        {/* HERO */}
        <section className="hero" style={{opacity: mounted ? 1 : 0, transition:"opacity .9s ease"}}>
          <div className="hero-text">
            <div className="hero-year">Est. 1984 · Jodhpur, Rajasthan</div>
            <h1 className="hero-h1">
              The Art of<br/>
              the <span className="accent">Sacred</span><br/>
              Drape
            </h1>
            <p className="hero-body">
              Heritage weaves, handcrafted by master artisans across India's most storied textile belts. Every thread carries memory. Every drape tells a story.
            </p>
            <div className="hero-actions">
              <button className="cta-fill" onClick={()=>document.getElementById("lookbook")?.scrollIntoView({behavior:"smooth"})}>
                Explore Collections
              </button>
              <button className="cta-line" onClick={()=>setChatOpen(true)}>
                Speak with Radhika
              </button>
            </div>
            <div className="hero-footnote">Jodhpur · Heritage · Craft · 1984</div>
          </div>
          <div className="hero-img-col">
            <img
              className={`hero-img ${mounted?"loaded":""}`}
              src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1400"
              alt="Shreemati Heritage"
              onLoad={e=>(e.target as HTMLImageElement).classList.add("loaded")}
            />
            <div className="hero-fold"/>
            <div className="hero-number">I</div>
          </div>
        </section>

        {/* INTERLUDE */}
        <div className="interlude">
          {[
            {num:"40+", label:"Years of Heritage", desc:"Four decades of preserving India's finest handwoven traditions."},
            {num:"200+", label:"Artisan Families",  desc:"Master weavers across Rajasthan, Tamil Nadu, Gujarat & beyond."},
            {num:"10",  label:"Distinct Weaves",   desc:"From Banarasi zari to Patola double-ikat — each a world apart."},
          ].map(it=>(
            <div key={it.label} className="int-cell">
              <div className="int-num">{it.num}</div>
              <div className="int-label">{it.label}</div>
              <div className="int-desc">{it.desc}</div>
            </div>
          ))}
        </div>

        {/* LOOKBOOK STRIPS */}
        <section id="lookbook" className="lookbook">
          <div className="lb-divider">
            <div className="lb-section-label">The Collections</div>
            <div className="lb-count">{CATEGORIES.length} Weaves</div>
          </div>

          {CATEGORIES.map((cat, i) => (
            <div
              key={cat}
              className="lb-row"
              ref={el=>catRefs.current[i]=el}
              onClick={()=>setViewingCategory(cat)}
            >
              <div className="lb-row-img">
                <img
                  src={sarees.find(s=>s.category===cat)?.image_url || "https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg"}
                  alt={cat}
                />
              </div>
              <div className="lb-row-text">
                <div className="lb-idx">{String(i+1).padStart(2,"0")}</div>
                <div className="lb-cat">{cat}</div>
                <div className="lb-origin">{CAT_META[cat]?.origin}</div>
                <div className="lb-craft">{CAT_META[cat]?.craft}</div>
                <div className="lb-arrow">
                  <div className="lb-arrow-line"/>
                  View Collection
                </div>
              </div>
            </div>
          ))}
        </section>
      </>
    ) : (
      /* ─── PRODUCT PAGE ─── */
      <div className="prod-wrapper">
        <div className="prod-top-bar">
          <button className="back-btn" onClick={()=>setViewingCategory(null)}>
            <div className="back-line"/>
            Back to Collections
          </button>
          <div className="prod-count">{inventory.length} Pieces Available</div>
        </div>

        <div className="prod-title-section">
          <div>
            <div className="prod-kicker">{CAT_META[viewingCategory]?.origin} · {CAT_META[viewingCategory]?.craft}</div>
            <h2 className="prod-h2">{viewingCategory}</h2>
            <p className="prod-subtext">Each piece is handwoven, unique, and comes with an authenticity certificate.</p>
          </div>
          <div className="prod-tag-pair">
            <div className="prod-tag-num">{String(CATEGORIES.indexOf(viewingCategory)+1).padStart(2,"0")}</div>
            <span className="prod-tag-lbl">Collection</span>
          </div>
        </div>

        <div className="p-grid">
          {inventory.map(s=>(
            <div key={s.id} className="p-card">
              <div className="p-img-wrap">
                <img src={s.image_url} className="p-img" alt={s.name}/>
                <div className="p-overlay">
                  <div className="p-cta">
                    <span className="p-cta-name">{s.name}</span>
                    <button className="p-cta-btn" onClick={()=>addToCart(s)}>Add</button>
                  </div>
                </div>
              </div>
              <div className="p-card-foot">
                <span className="p-card-name">{s.name}</span>
                <span className="p-card-price">₹{s.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* FOOTER */}
    <footer>
      <div className="f-top">
        <div>
          <div className="f-logo-en">Shreemati</div>
          <span className="f-logo-hi">श्रीमती</span>
          <p className="f-about">Since 1984, Shreemati has been a devoted custodian of India's handwoven traditions — preserving the artistry of over 200 artisan families across Rajasthan and beyond.</p>
        </div>
        <div>
          <div className="f-hd">Explore</div>
          <a className="f-link" onClick={()=>setViewingCategory(null)}>Collections</a>
          <a className="f-link">Heritage</a>
          <a className="f-link">Atelier</a>
          <a className="f-link">Care Guide</a>
        </div>
        <div>
          <div className="f-hd">Contact</div>
          <a className="f-link">+91 9252703456</a>
          <a className="f-link" href="https://maps.app.goo.gl/ZWTxmrmdtPAGRLyf9" target="_blank">Jodhpur, Rajasthan</a>
          <a className="f-link" href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank">Instagram</a>
        </div>
        <div>
          <div className="f-hd">Policies</div>
          <a className="f-link">Shipping</a>
          <a className="f-link">Returns</a>
          <a className="f-link">Authenticity</a>
          <a className="f-link">Privacy</a>
        </div>
      </div>
      <div className="f-base">
        <div className="f-ornament">✦ ✦ ✦</div>
        <span className="f-copy">© 2026 Shreemati Heritage. All Rights Reserved.</span>
        <div className="f-ornament">✦ ✦ ✦</div>
      </div>
    </footer>
    </>
  );
}