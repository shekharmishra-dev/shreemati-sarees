"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["Banarasi","Kanjivaram","Chanderi","Bandhani","Paithani","Patola","Organza","Tussar Silk","Chiffon","Georgette"];
const CAT_ORIGIN: Record<string,string> = {
  "Banarasi":"Varanasi","Kanjivaram":"Kanchipuram","Chanderi":"Madhya Pradesh",
  "Bandhani":"Rajasthan","Paithani":"Aurangabad","Patola":"Patan, Gujarat",
  "Organza":"Pan-India","Tussar Silk":"Jharkhand","Chiffon":"Pan-India","Georgette":"Pan-India"
};

export default function Home() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [view, setView] = useState<"home"|"collections"|"products">("home");
  const [activeCategory, setActiveCategory] = useState<string|null>(null);
  const [hoveredCat, setHoveredCat] = useState<string|null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState<{r:"u"|"ai", t:string}[]>([]);
  const [chatTxt, setChatTxt] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [entered, setEntered] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    supabase.from("Sarees").select("*").then(({data})=>{ if(data) setSarees(data); });
    chatEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[msgs]);

  const inventory = sarees.filter(s=>s.category===activeCategory);
  const addToCart = (s:any) => { setCart(p=>[...p,s]); setCartOpen(true); };
  const removeItem = (i:number) => setCart(p=>p.filter((_,j)=>j!==i));
  const total = cart.reduce((s,i)=>s+i.price,0);

  const sendChat = async () => {
    if(!chatTxt.trim()) return;
    const txt = chatTxt.trim(); setChatTxt(""); setChatLoading(true);
    setMsgs(p=>[...p,{r:"u",t:txt}]);
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:txt})});
      const d = await res.json();
      setMsgs(p=>[...p,{r:"ai",t:d.text}]);
    } catch {
      setMsgs(p=>[...p,{r:"ai",t:"Namaste. Tell me your occasion — I will find you the perfect weave."}]);
    }
    setChatLoading(false);
  };

  const checkout = () => {
    setOrderDone(true);
    setTimeout(()=>{ setCart([]); setCartOpen(false); setOrderDone(false); }, 4000);
  };

  const goToCategory = (cat:string) => {
    setActiveCategory(cat);
    setView("products");
  };

  const previewImg = hoveredCat
    ? sarees.find(s=>s.category===hoveredCat)?.image_url
    : null;

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Jost:wght@200;300;400&display=swap');

      *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

      :root {
        --void:    #0D0C0A;
        --deep:    #141210;
        --surface: #1C1916;
        --panel:   #221F1B;
        --edge:    #2E2923;
        --brass:   #B8892A;
        --brass2:  #D4A843;
        --amber:   #E8C97A;
        --silk:    #F5EDD8;
        --smoke:   #7A7060;
        --fog:     #4A4438;
        --serif:   'Bodoni Moda', Georgia, serif;
        --bask:    'Libre Baskerville', Georgia, serif;
        --sans:    'Jost', sans-serif;
      }

      html { height:100%; }
      body {
        font-family: var(--sans);
        background: var(--void);
        color: var(--silk);
        overflow-x: hidden;
        min-height: 100%;
      }

      ::-webkit-scrollbar { width: 2px; }
      ::-webkit-scrollbar-track { background: var(--deep); }
      ::-webkit-scrollbar-thumb { background: var(--brass); }

      /* ════════════════════════════════════
         ENTRY GATE
      ════════════════════════════════════ */
      .gate {
        position: fixed; inset: 0; z-index: 200;
        background: var(--void);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 0;
        transition: opacity .8s ease, visibility .8s;
      }
      .gate.gone { opacity: 0; visibility: hidden; pointer-events: none; }
      .gate-ornament {
        font-family: var(--serif);
        font-size: 11px; letter-spacing: .6em;
        text-transform: uppercase; color: var(--brass);
        opacity: .6; margin-bottom: 32px;
      }
      .gate-title {
        font-family: var(--serif);
        font-size: clamp(48px, 8vw, 110px);
        font-weight: 400; letter-spacing: .08em;
        text-transform: uppercase; color: var(--silk);
        line-height: 1; margin-bottom: 6px;
        text-align: center;
      }
      .gate-hindi {
        font-family: var(--bask);
        font-size: clamp(18px, 2.5vw, 28px);
        font-style: italic; color: var(--brass);
        letter-spacing: .12em; margin-bottom: 56px;
        opacity: .7;
      }
      .gate-rule {
        width: 1px; height: 60px;
        background: linear-gradient(to bottom, var(--brass), transparent);
        margin-bottom: 40px;
      }
      .gate-enter {
        font-family: var(--sans); font-size: 9px;
        font-weight: 200; letter-spacing: .65em;
        text-transform: uppercase; color: var(--smoke);
        background: none; border: 1px solid var(--fog);
        padding: 16px 40px; cursor: pointer;
        transition: border-color .3s, color .3s;
      }
      .gate-enter:hover { border-color: var(--brass); color: var(--brass2); }

      /* ════════════════════════════════════
         NAV
      ════════════════════════════════════ */
      .nav {
        position: fixed; top: 0; left: 0; right: 0;
        z-index: 100;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 52px; height: 64px;
        border-bottom: 1px solid var(--edge);
        background: rgba(13,12,10,.92);
        backdrop-filter: blur(12px);
      }
      .nav-links { display: flex; gap: 36px; list-style: none; }
      .nav-links a, .nav-links button {
        font-family: var(--sans); font-size: 9.5px;
        font-weight: 200; letter-spacing: .38em;
        text-transform: uppercase; color: var(--smoke);
        text-decoration: none; cursor: pointer;
        background: none; border: none;
        transition: color .2s;
      }
      .nav-links a:hover, .nav-links button:hover { color: var(--brass2); }
      .nav-brand {
        font-family: var(--serif); font-size: 19px;
        font-weight: 400; letter-spacing: .38em;
        text-transform: uppercase; color: var(--silk);
        cursor: pointer; text-align: center; line-height: 1;
      }
      .nav-brand span {
        display: block; font-family: var(--bask);
        font-size: 10px; font-style: italic;
        color: var(--brass); letter-spacing: .25em;
        font-weight: 400; margin-top: 2px; opacity: .7;
      }
      .nav-bag {
        font-family: var(--sans); font-size: 9.5px;
        font-weight: 200; letter-spacing: .38em;
        text-transform: uppercase; color: var(--smoke);
        background: none; border: none; cursor: pointer;
        display: flex; align-items: center; gap: 8px;
        transition: color .2s;
      }
      .nav-bag:hover { color: var(--brass2); }
      .bag-dot {
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--brass); color: var(--void);
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 9px; font-weight: 400;
      }

      /* ════════════════════════════════════
         HERO
      ════════════════════════════════════ */
      .hero {
        height: 100vh; position: relative; overflow: hidden;
        display: flex; align-items: flex-end;
      }
      .hero-bg {
        position: absolute; inset: 0;
        background: var(--void);
      }
      .hero-bg img {
        width: 100%; height: 100%; object-fit: cover;
        opacity: .35; filter: saturate(.6) brightness(.7);
        transition: opacity 1.2s ease, transform 14s ease;
      }
      .hero:hover .hero-bg img { transform: scale(1.04); }
      .hero-vignette {
        position: absolute; inset: 0;
        background: 
          radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(13,12,10,.7) 100%),
          linear-gradient(to top, var(--void) 0%, transparent 40%),
          linear-gradient(to right, rgba(13,12,10,.8) 0%, transparent 60%);
      }
      .hero-content {
        position: relative; z-index: 2;
        padding: 0 52px 80px;
        max-width: 720px;
      }
      .hero-tag {
        display: flex; align-items: center; gap: 16px;
        margin-bottom: 28px;
      }
      .hero-tag-line { width: 36px; height: 1px; background: var(--brass); }
      .hero-tag-txt {
        font-family: var(--sans); font-size: 9px;
        font-weight: 200; letter-spacing: .55em;
        text-transform: uppercase; color: var(--brass);
      }
      .hero-h1 {
        font-family: var(--serif);
        font-size: clamp(52px, 7vw, 100px);
        font-weight: 400; line-height: .95;
        letter-spacing: .01em; color: var(--silk);
        margin-bottom: 28px;
      }
      .hero-h1 em { font-style: italic; color: var(--brass2); }
      .hero-sub {
        font-family: var(--bask);
        font-size: 14px; font-style: italic;
        color: var(--smoke); line-height: 1.85;
        max-width: 400px; margin-bottom: 48px;
        font-weight: 400;
      }
      .hero-btns { display: flex; gap: 14px; }
      .btn-brass {
        font-family: var(--sans); font-size: 9px;
        font-weight: 300; letter-spacing: .44em;
        text-transform: uppercase; background: var(--brass);
        color: var(--void); border: none; padding: 15px 32px;
        cursor: pointer; transition: background .25s, transform .15s;
      }
      .btn-brass:hover { background: var(--brass2); transform: translateY(-1px); }
      .btn-ghost {
        font-family: var(--sans); font-size: 9px;
        font-weight: 200; letter-spacing: .44em;
        text-transform: uppercase; background: none;
        color: var(--smoke); border: 1px solid var(--fog);
        padding: 15px 32px; cursor: pointer;
        transition: border-color .25s, color .25s;
      }
      .btn-ghost:hover { border-color: var(--brass); color: var(--brass); }
      .hero-scroll {
        position: absolute; bottom: 36px; right: 52px;
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        cursor: pointer; z-index: 2;
      }
      .hero-scroll-txt {
        font-size: 8px; letter-spacing: .5em; text-transform: uppercase;
        color: var(--fog); font-weight: 200;
        writing-mode: vertical-rl;
      }
      .hero-scroll-line {
        width: 1px; height: 48px;
        background: linear-gradient(to bottom, var(--brass), transparent);
        animation: scrollPulse 2s ease-in-out infinite;
      }
      @keyframes scrollPulse {
        0%,100% { opacity:.3; transform: scaleY(.7); }
        50% { opacity:1; transform: scaleY(1); }
      }

      /* ════════════════════════════════════
         COLLECTIONS PAGE (MENU + PREVIEW)
      ════════════════════════════════════ */
      .coll-page {
        min-height: 100vh; padding-top: 64px;
        display: grid; grid-template-columns: 1fr 1fr;
      }
      .coll-menu {
        padding: 80px 52px;
        border-right: 1px solid var(--edge);
        display: flex; flex-direction: column; justify-content: center;
      }
      .coll-menu-header { margin-bottom: 56px; }
      .coll-menu-kicker {
        font-size: 9px; letter-spacing: .55em; text-transform: uppercase;
        color: var(--brass); font-weight: 200; margin-bottom: 12px;
      }
      .coll-menu-title {
        font-family: var(--serif);
        font-size: clamp(36px, 4vw, 56px);
        font-weight: 400; line-height: 1.05;
        color: var(--silk); letter-spacing: .01em;
      }
      .coll-menu-title em { font-style: italic; color: var(--brass2); }
      .coll-list { display: flex; flex-direction: column; }
      .coll-item {
        display: flex; align-items: baseline; justify-content: space-between;
        padding: 18px 0; border-bottom: 1px solid var(--edge);
        cursor: pointer; position: relative; overflow: hidden;
        transition: padding-left .3s;
      }
      .coll-item:first-child { border-top: 1px solid var(--edge); }
      .coll-item:hover { padding-left: 12px; }
      .coll-item-left { display: flex; align-items: baseline; gap: 20px; }
      .coll-num {
        font-family: var(--serif); font-size: 11px;
        color: var(--fog); font-weight: 400; letter-spacing: .05em;
        transition: color .3s;
      }
      .coll-item:hover .coll-num { color: var(--brass); }
      .coll-name {
        font-family: var(--serif);
        font-size: clamp(20px, 2.2vw, 28px);
        font-weight: 400; color: var(--smoke);
        letter-spacing: .02em; line-height: 1;
        transition: color .25s;
      }
      .coll-item:hover .coll-name { color: var(--silk); }
      .coll-origin {
        font-family: var(--bask); font-size: 11px;
        font-style: italic; color: var(--fog);
        font-weight: 400; transition: color .25s;
      }
      .coll-item:hover .coll-origin { color: var(--brass); }
      .coll-arrow {
        font-size: 16px; color: var(--fog);
        opacity: 0; transform: translateX(-8px);
        transition: opacity .3s, transform .3s, color .3s;
      }
      .coll-item:hover .coll-arrow { opacity: 1; transform: translateX(0); color: var(--brass); }
      /* hover underline sweep */
      .coll-item::after {
        content: '';
        position: absolute; left: 0; bottom: 0;
        width: 0; height: 1px; background: var(--brass);
        transition: width .4s cubic-bezier(.25,.46,.45,.94);
      }
      .coll-item:hover::after { width: 100%; }

      .coll-preview {
        position: sticky; top: 64px;
        height: calc(100vh - 64px);
        overflow: hidden; background: var(--deep);
        display: flex; align-items: center; justify-content: center;
      }
      .coll-preview-default {
        text-align: center; display: flex; flex-direction: column;
        align-items: center; gap: 20px;
      }
      .preview-glyph {
        font-family: var(--serif); font-size: 80px;
        color: var(--edge); font-weight: 400; line-height: 1;
      }
      .preview-hint {
        font-size: 9px; letter-spacing: .45em; text-transform: uppercase;
        color: var(--fog); font-weight: 200;
      }
      .coll-preview-img {
        position: absolute; inset: 0;
        opacity: 0; transition: opacity .5s ease;
      }
      .coll-preview-img.active { opacity: 1; }
      .coll-preview-img img {
        width: 100%; height: 100%; object-fit: cover;
        filter: brightness(.65) saturate(.8);
      }
      .coll-preview-img-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(13,12,10,.5) 0%, transparent 60%);
      }
      .preview-cat-name {
        position: absolute; bottom: 48px; left: 48px;
        font-family: var(--serif); font-size: 40px;
        font-weight: 400; font-style: italic;
        color: var(--silk); letter-spacing: .04em;
        text-shadow: 0 2px 20px rgba(0,0,0,.5);
      }
      .preview-cat-origin {
        position: absolute; bottom: 42px; right: 48px;
        font-size: 9px; letter-spacing: .48em; text-transform: uppercase;
        color: var(--brass); font-weight: 200;
        writing-mode: vertical-rl;
      }

      /* ════════════════════════════════════
         PRODUCTS PAGE
      ════════════════════════════════════ */
      .prod-page { padding-top: 64px; min-height: 100vh; }
      .prod-header {
        padding: 64px 52px 52px;
        border-bottom: 1px solid var(--edge);
        display: grid; grid-template-columns: 1fr auto;
        gap: 32px; align-items: end;
      }
      .prod-back {
        display: flex; align-items: center; gap: 12px;
        font-size: 9px; letter-spacing: .4em; text-transform: uppercase;
        color: var(--fog); background: none; border: none; cursor: pointer;
        font-family: var(--sans); font-weight: 200;
        margin-bottom: 32px; transition: color .2s;
      }
      .prod-back:hover { color: var(--brass); }
      .prod-back-rule { width: 24px; height: 1px; background: var(--fog); transition: width .25s, background .25s; }
      .prod-back:hover .prod-back-rule { width: 36px; background: var(--brass); }
      .prod-kicker {
        font-size: 9px; letter-spacing: .55em; text-transform: uppercase;
        color: var(--brass); font-weight: 200; margin-bottom: 12px;
      }
      .prod-h2 {
        font-family: var(--serif);
        font-size: clamp(40px, 6vw, 80px);
        font-weight: 400; line-height: .95;
        color: var(--silk); letter-spacing: .01em;
      }
      .prod-h2 em { font-style: italic; color: var(--brass2); }
      .prod-desc {
        font-family: var(--bask); font-size: 13px;
        font-style: italic; color: var(--smoke);
        line-height: 1.8; max-width: 380px; margin-top: 14px;
      }
      .prod-meta {
        text-align: right;
      }
      .prod-meta-num {
        font-family: var(--serif); font-size: 72px;
        font-weight: 400; color: var(--edge); line-height: 1;
      }
      .prod-meta-lbl {
        font-size: 8px; letter-spacing: .44em; text-transform: uppercase;
        color: var(--fog); font-weight: 200;
      }

      /* masonry-feel grid */
      .p-masonry {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2px;
        background: var(--edge);
      }
      .p-tile {
        position: relative; overflow: hidden;
        background: var(--surface); cursor: pointer;
      }
      .p-tile:nth-child(5n+1) .p-img-wrap { aspect-ratio: 3/4.5; }
      .p-tile:nth-child(5n+3) .p-img-wrap { aspect-ratio: 3/3.5; }
      .p-img-wrap { aspect-ratio: 3/4; overflow: hidden; position: relative; }
      .p-img {
        width: 100%; height: 100%; object-fit: cover;
        filter: brightness(.8) saturate(.85);
        transition: transform 2s cubic-bezier(.25,.46,.45,.94), filter 1s;
      }
      .p-tile:hover .p-img { transform: scale(1.07); filter: brightness(.65) saturate(1); }
      .p-burn {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(13,12,10,.9) 0%, rgba(13,12,10,.1) 45%, transparent 100%);
      }
      .p-info {
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 20px 22px;
        display: flex; justify-content: space-between; align-items: flex-end;
      }
      .p-tile-name {
        font-family: var(--serif); font-size: 16px;
        font-weight: 400; color: var(--silk);
        letter-spacing: .02em; line-height: 1.1;
        text-shadow: 0 1px 8px rgba(0,0,0,.6);
      }
      .p-tile-price {
        font-family: var(--sans); font-size: 11px;
        font-weight: 300; color: var(--brass);
        letter-spacing: .08em;
      }
      .p-tile-add {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: transparent;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity .3s;
      }
      .p-tile:hover .p-tile-add { opacity: 1; }
      .p-tile-add-btn {
        font-family: var(--sans); font-size: 9px;
        font-weight: 300; letter-spacing: .44em;
        text-transform: uppercase; background: var(--brass);
        color: var(--void); border: none; padding: 14px 28px;
        cursor: pointer; transition: background .2s, transform .2s;
        transform: translateY(6px);
        transition: background .2s, transform .3s;
      }
      .p-tile:hover .p-tile-add-btn { transform: translateY(0); }
      .p-tile-add-btn:hover { background: var(--brass2); }

      /* ════════════════════════════════════
         CART
      ════════════════════════════════════ */
      .scrim {
        position: fixed; inset: 0; z-index: 150;
        background: rgba(13,12,10,.7);
        backdrop-filter: blur(4px);
        animation: fadeIn .25s ease;
      }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      .cart-panel {
        position: absolute; right: 0; top: 0; bottom: 0;
        width: 400px; background: var(--deep);
        border-left: 1px solid var(--edge);
        display: flex; flex-direction: column;
        animation: slideIn .38s cubic-bezier(.25,.46,.45,.94);
      }
      @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
      .cart-top {
        padding: 32px 36px 22px; border-bottom: 1px solid var(--edge);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .cart-ttl { font-family: var(--serif); font-size: 22px; font-weight: 400; color: var(--silk); }
      .cart-sub { font-size: 9px; letter-spacing: .36em; text-transform: uppercase; color: var(--fog); font-weight: 200; margin-top: 2px; }
      .cart-close { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; background: none; border: none; cursor: pointer; font-family: var(--sans); color: var(--fog); font-weight: 200; transition: color .2s; }
      .cart-close:hover { color: var(--brass); }
      .cart-items { flex:1; overflow-y: auto; padding: 24px 36px; }
      .cart-item { display: flex; gap: 14px; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--edge); }
      .c-thumb { width: 58px; height: 76px; object-fit: cover; background: var(--surface); flex-shrink: 0; }
      .c-name { font-family: var(--serif); font-size: 14px; color: var(--silk); margin-bottom: 4px; }
      .c-price { font-size: 11px; color: var(--brass); font-weight: 200; letter-spacing: .06em; margin-bottom: 10px; }
      .c-rm { font-size: 8px; letter-spacing: .32em; text-transform: uppercase; background: none; border: none; cursor: pointer; font-family: var(--sans); color: var(--fog); font-weight: 200; transition: color .2s; }
      .c-rm:hover { color: var(--amber); }
      .cart-foot { padding: 20px 36px 36px; border-top: 1px solid var(--edge); }
      .c-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
      .c-total-lbl { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--fog); font-weight: 200; }
      .c-total-val { font-family: var(--serif); font-size: 26px; font-weight: 400; color: var(--silk); }
      .c-note { font-size: 10px; color: var(--fog); font-weight: 200; margin-bottom: 20px; letter-spacing: .03em; line-height: 1.5; }
      .c-pay { width: 100%; background: var(--brass); color: var(--void); border: none; padding: 15px; cursor: pointer; font-size: 9px; letter-spacing: .44em; text-transform: uppercase; font-family: var(--sans); font-weight: 300; transition: background .22s; }
      .c-pay:hover { background: var(--brass2); }
      .c-empty { flex:1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
      .c-empty-g { font-family: var(--serif); font-size: 52px; color: var(--edge); font-style: italic; }
      .c-empty-m { font-size: 9px; letter-spacing: .36em; text-transform: uppercase; color: var(--fog); font-weight: 200; }
      .c-success { flex:1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; padding: 0 36px; }
      .c-ok-ring { width: 54px; height: 54px; border-radius: 50%; border: 1px solid var(--brass); display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--brass); }
      .c-ok-ttl { font-family: var(--serif); font-size: 26px; color: var(--silk); }
      .c-ok-msg { font-size: 11px; color: var(--smoke); font-weight: 200; line-height: 1.8; max-width: 230px; }

      /* ════════════════════════════════════
         STYLIST CHAT
      ════════════════════════════════════ */
      .stylist-zone {
        position: fixed; bottom: 24px; right: 24px; z-index: 140;
        display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
      }
      .stylist-box {
        width: 330px; background: var(--deep);
        border: 1px solid var(--edge);
        box-shadow: 0 20px 60px rgba(0,0,0,.4);
        display: flex; flex-direction: column; max-height: 430px;
        animation: chatUp .3s cubic-bezier(.25,.46,.45,.94);
      }
      @keyframes chatUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      .s-hd { background: var(--surface); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; border-bottom: 1px solid var(--edge); }
      .s-lbl { font-size: 8px; letter-spacing: .48em; text-transform: uppercase; color: var(--fog); font-weight: 200; margin-bottom: 1px; }
      .s-name { font-family: var(--serif); font-size: 18px; font-weight: 400; font-style: italic; color: var(--brass2); }
      .s-x { background: none; border: none; cursor: pointer; color: var(--fog); font-size: 14px; transition: color .2s; }
      .s-x:hover { color: var(--brass); }
      .s-msgs { flex:1; overflow-y: auto; padding: 14px 16px; background: var(--void); display: flex; flex-direction: column; gap: 10px; }
      .bub { max-width: 88%; padding: 9px 13px; font-size: 12px; line-height: 1.65; }
      .bub.ai { background: var(--surface); border: 1px solid var(--edge); font-family: var(--bask); font-size: 12px; font-style: italic; color: var(--silk); align-self: flex-start; }
      .bub.u { background: var(--brass); color: var(--void); font-weight: 300; letter-spacing: .02em; align-self: flex-end; }
      .typing { display: flex; gap: 4px; align-items: center; padding: 9px 13px; background: var(--surface); border: 1px solid var(--edge); align-self: flex-start; }
      .td { width: 4px; height: 4px; background: var(--fog); border-radius: 50%; animation: tdAnim 1.2s ease-in-out infinite; }
      .td:nth-child(2){animation-delay:.2s}.td:nth-child(3){animation-delay:.4s}
      @keyframes tdAnim{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:1}}
      .s-inp-row { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--edge); background: var(--deep); flex-shrink: 0; }
      .s-inp { flex:1; border: none; outline: none; background: transparent; font-size: 11px; font-family: var(--sans); font-weight: 200; letter-spacing: .03em; color: var(--silk); }
      .s-inp::placeholder { color: var(--fog); }
      .s-send { font-size: 8px; letter-spacing: .36em; text-transform: uppercase; background: var(--brass); color: var(--void); border: none; padding: 8px 13px; cursor: pointer; font-family: var(--sans); font-weight: 300; transition: background .2s; flex-shrink: 0; }
      .s-send:hover { background: var(--brass2); }
      .s-fab { width: 48px; height: 48px; border-radius: 50%; background: var(--surface); border: 1px solid var(--edge); cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; transition: transform .2s, border-color .2s; }
      .s-fab:hover { transform: scale(1.08); border-color: var(--brass); }
      .s-fab-t { font-size: 7px; letter-spacing: .18em; text-transform: uppercase; color: var(--fog); text-align: center; line-height: 1.4; font-weight: 200; }

      /* ════════════════════════════════════
         FOOTER
      ════════════════════════════════════ */
      footer { background: var(--void); border-top: 1px solid var(--edge); padding: 72px 52px 44px; }
      .f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; max-width: 1260px; margin: 0 auto; padding-bottom: 48px; border-bottom: 1px solid var(--edge); margin-bottom: 32px; }
      .f-brand-name { font-family: var(--serif); font-size: 26px; letter-spacing: .3em; text-transform: uppercase; color: var(--silk); font-weight: 400; margin-bottom: 3px; }
      .f-brand-hi { font-family: var(--bask); font-size: 12px; font-style: italic; color: var(--brass); opacity: .65; margin-bottom: 16px; display: block; }
      .f-desc { font-size: 11px; font-weight: 200; line-height: 1.95; max-width: 265px; color: var(--fog); letter-spacing: .03em; }
      .f-col-hd { font-size: 9px; letter-spacing: .44em; text-transform: uppercase; color: var(--smoke); font-weight: 200; margin-bottom: 16px; }
      .f-lnk { display: block; font-size: 11px; font-weight: 200; letter-spacing: .03em; color: var(--fog); text-decoration: none; margin-bottom: 11px; cursor: pointer; transition: color .2s; }
      .f-lnk:hover { color: var(--brass); }
      .f-base { max-width: 1260px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .f-copy { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: var(--edge); font-weight: 200; }
      .f-orn { font-family: var(--serif); font-size: 13px; color: var(--brass); opacity: .25; letter-spacing: .3em; }

      /* ════════════════════════════════════
         RESPONSIVE
      ════════════════════════════════════ */
      @media(max-width:900px){
        .nav { padding: 0 20px; }
        .nav-links { gap: 18px; }
        .hero-content { padding: 0 20px 60px; }
        .coll-page { grid-template-columns: 1fr; }
        .coll-preview { display: none; }
        .coll-menu { padding: 48px 20px; }
        .prod-header { grid-template-columns: 1fr; padding: 40px 20px 32px; }
        .p-masonry { grid-template-columns: repeat(2,1fr); }
        footer { padding: 56px 20px 40px; }
        .f-grid { grid-template-columns: 1fr; gap: 28px; }
        .cart-panel { width: 100%; max-width: 400px; }
        .stylist-box { width: calc(100vw - 40px); }
      }
    `}</style>

    {/* ── GATE ── */}
    <div className={`gate ${entered ? "gone" : ""}`}>
      <div className="gate-ornament">✦ &nbsp; Est. 1984 &nbsp; ✦</div>
      <div className="gate-title">Shreemati</div>
      <div className="gate-hindi">श्रीमती</div>
      <div className="gate-rule"/>
      <button className="gate-enter" onClick={()=>setEntered(true)}>
        Enter the Atelier
      </button>
    </div>

    {/* ── NAV ── */}
    <nav className="nav">
      <ul className="nav-links">
        <li><a onClick={()=>setView("home")}>Home</a></li>
        <li><a onClick={()=>setView("collections")}>Collections</a></li>
        <li><a>Heritage</a></li>
      </ul>
      <div className="nav-brand" onClick={()=>setView("home")}>
        Shreemati
        <span>श्रीमती · Jodhpur</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"28px"}}>
        <ul className="nav-links">
          <li><button onClick={()=>setChatOpen(v=>!v)}>Stylist</button></li>
        </ul>
        <button className="nav-bag" onClick={()=>setCartOpen(true)}>
          Bag {cart.length>0 && <span className="bag-dot">{cart.length}</span>}
        </button>
      </div>
    </nav>

    {/* ── STYLIST ── */}
    <div className="stylist-zone">
      {chatOpen && (
        <div className="stylist-box">
          <div className="s-hd">
            <div>
              <div className="s-lbl">Personal Stylist</div>
              <div className="s-name">Radhika</div>
            </div>
            <button className="s-x" onClick={()=>setChatOpen(false)}>✕</button>
          </div>
          <div className="s-msgs">
            {msgs.length===0 && <div className="bub ai">Namaste. I'm Radhika — your personal drape consultant. What occasion are you dressing for?</div>}
            {msgs.map((m,i)=><div key={i} className={`bub ${m.r}`}>{m.t}</div>)}
            {chatLoading && <div className="typing"><div className="td"/><div className="td"/><div className="td"/></div>}
            <div ref={chatEndRef}/>
          </div>
          <div className="s-inp-row">
            <input className="s-inp" placeholder="Ask about weaves, styling…" value={chatTxt}
              onChange={e=>setChatTxt(e.target.value)} onKeyPress={e=>e.key==="Enter"&&sendChat()}/>
            <button className="s-send" onClick={sendChat}>Send</button>
          </div>
        </div>
      )}
      <button className="s-fab" onClick={()=>setChatOpen(v=>!v)}>
        <span className="s-fab-t">Your<br/>Stylist</span>
      </button>
    </div>

    {/* ── CART ── */}
    {cartOpen && (
      <div className="scrim" onClick={e=>{if(e.target===e.currentTarget)setCartOpen(false)}}>
        <div className="cart-panel">
          <div className="cart-top">
            <div>
              <div className="cart-ttl">Your Selection</div>
              <div className="cart-sub">{cart.length} {cart.length===1?"piece":"pieces"}</div>
            </div>
            <button className="cart-close" onClick={()=>setCartOpen(false)}>Close</button>
          </div>
          {orderDone ? (
            <div className="c-success">
              <div className="c-ok-ring">✓</div>
              <div className="c-ok-ttl">Order Received</div>
              <p className="c-ok-msg">Your drapes are being prepared with care. A confirmation follows shortly.</p>
            </div>
          ) : cart.length===0 ? (
            <div className="c-empty">
              <div className="c-empty-g">◇</div>
              <div className="c-empty-m">Your selection is empty</div>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item,idx)=>(
                  <div key={idx} className="cart-item">
                    <img src={item.image_url} className="c-thumb" alt={item.name}/>
                    <div style={{flex:1}}>
                      <div className="c-name">{item.name}</div>
                      <div className="c-price">₹{item.price.toLocaleString("en-IN")}</div>
                      <button className="c-rm" onClick={()=>removeItem(idx)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-foot">
                <div className="c-total-row">
                  <span className="c-total-lbl">Subtotal</span>
                  <span className="c-total-val">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="c-note">Shipping & duties at checkout</p>
                <button className="c-pay" onClick={checkout}>Proceed to Payment</button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* ══════════════════════════════════════
        VIEWS
    ══════════════════════════════════════ */}

    {/* HOME */}
    {view==="home" && (
      <>
        <section className="hero">
          <div className="hero-bg">
            <img src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1600" alt=""/>
          </div>
          <div className="hero-vignette"/>
          <div className="hero-content">
            <div className="hero-tag">
              <div className="hero-tag-line"/>
              <span className="hero-tag-txt">House of Heritage Weaves · Jodhpur</span>
            </div>
            <h1 className="hero-h1">
              Woven in<br/><em>Silence,</em><br/>Worn with Grace
            </h1>
            <p className="hero-sub">
              Forty years of safeguarding India's most sacred weaving traditions — one handcrafted drape at a time.
            </p>
            <div className="hero-btns">
              <button className="btn-brass" onClick={()=>setView("collections")}>Enter the Collections</button>
              <button className="btn-ghost" onClick={()=>setChatOpen(true)}>Speak with Radhika</button>
            </div>
          </div>
          <div className="hero-scroll" onClick={()=>setView("collections")}>
            <div className="hero-scroll-line"/>
            <div className="hero-scroll-txt">Collections</div>
          </div>
        </section>

        {/* brand statement */}
        <div style={{
          padding:"80px 52px",
          borderBottom:`1px solid var(--edge)`,
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"80px",
          alignItems:"center"
        }}>
          <div>
            <div style={{fontSize:"9px",letterSpacing:".55em",textTransform:"uppercase",color:"var(--brass)",fontWeight:200,marginBottom:"20px"}}>
              Our Philosophy
            </div>
            <div style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:400,lineHeight:1.12,color:"var(--silk)"}}>
              Every saree is a<br/><em style={{fontStyle:"italic",color:"var(--brass2)"}}>living manuscript</em><br/>of its region's soul
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"32px"}}>
            {[
              {n:"200+",l:"Master artisan families across India"},
              {n:"40",  l:"Years of preserving weaving heritage"},
              {n:"10",  l:"Distinct regional weaving traditions"},
            ].map(item=>(
              <div key={item.l} style={{display:"flex",alignItems:"baseline",gap:"24px",paddingBottom:"32px",borderBottom:"1px solid var(--edge)"}}>
                <div style={{fontFamily:"var(--serif)",fontSize:"36px",color:"var(--brass)",fontWeight:400,lineHeight:1,flexShrink:0,minWidth:"70px"}}>{item.n}</div>
                <div style={{fontSize:"12px",color:"var(--smoke)",fontWeight:200,letterSpacing:".04em",lineHeight:1.6}}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}

    {/* COLLECTIONS MENU */}
    {view==="collections" && (
      <div className="coll-page">
        <div className="coll-menu">
          <div className="coll-menu-header">
            <div className="coll-menu-kicker">The Atelier · Ten Weaves</div>
            <h2 className="coll-menu-title">Choose Your<br/><em>Weave</em></h2>
          </div>
          <div className="coll-list">
            {CATEGORIES.map((cat,i)=>(
              <div key={cat} className="coll-item"
                onMouseEnter={()=>setHoveredCat(cat)}
                onMouseLeave={()=>setHoveredCat(null)}
                onClick={()=>goToCategory(cat)}>
                <div className="coll-item-left">
                  <span className="coll-num">{String(i+1).padStart(2,"0")}</span>
                  <span className="coll-name">{cat}</span>
                </div>
                <span className="coll-origin">{CAT_ORIGIN[cat]}</span>
                <span className="coll-arrow">→</span>
              </div>
            ))}
          </div>
        </div>

        <div className="coll-preview">
          <div className="coll-preview-default" style={{opacity: hoveredCat ? 0 : 1, transition:"opacity .3s"}}>
            <div className="preview-glyph">✦</div>
            <div className="preview-hint">Hover to preview</div>
          </div>
          {CATEGORIES.map(cat=>(
            <div key={cat} className={`coll-preview-img ${hoveredCat===cat?"active":""}`}>
              <img
                src={sarees.find(s=>s.category===cat)?.image_url||"https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg"}
                alt={cat}
              />
              <div className="coll-preview-img-overlay"/>
              <div className="preview-cat-name">{cat}</div>
              <div className="preview-cat-origin">{CAT_ORIGIN[cat]}</div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* PRODUCTS */}
    {view==="products" && activeCategory && (
      <div className="prod-page">
        <div className="prod-header">
          <div>
            <button className="prod-back" onClick={()=>setView("collections")}>
              <div className="prod-back-rule"/>
              All Collections
            </button>
            <div className="prod-kicker">{CAT_ORIGIN[activeCategory]} · Handwoven</div>
            <h2 className="prod-h2"><em>{activeCategory}</em></h2>
            <p className="prod-desc">Each piece is uniquely handwoven and comes with a certificate of authenticity.</p>
          </div>
          <div className="prod-meta">
            <div className="prod-meta-num">{String(CATEGORIES.indexOf(activeCategory)+1).padStart(2,"0")}</div>
            <div className="prod-meta-lbl">{inventory.length} pieces</div>
          </div>
        </div>

        <div className="p-masonry">
          {inventory.map(s=>(
            <div key={s.id} className="p-tile">
              <div className="p-img-wrap">
                <img src={s.image_url} className="p-img" alt={s.name}/>
                <div className="p-burn"/>
                <div className="p-info">
                  <div className="p-tile-name">{s.name}</div>
                  <div className="p-tile-price">₹{s.price.toLocaleString("en-IN")}</div>
                </div>
                <div className="p-tile-add">
                  <button className="p-tile-add-btn" onClick={()=>addToCart(s)}>Add to Selection</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* FOOTER */}
    <footer>
      <div className="f-grid">
        <div>
          <div className="f-brand-name">Shreemati</div>
          <span className="f-brand-hi">श्रीमती · Jodhpur, Rajasthan</span>
          <p className="f-desc">Since 1984, a devoted custodian of India's most exquisite handwoven traditions — preserving the artistry of over 200 artisan families.</p>
        </div>
        <div>
          <div className="f-col-hd">Navigate</div>
          <a className="f-lnk" onClick={()=>setView("home")}>Home</a>
          <a className="f-lnk" onClick={()=>setView("collections")}>Collections</a>
          <a className="f-lnk">Heritage</a>
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
        <div className="f-orn">✦ ✦ ✦</div>
        <span className="f-copy">© 2026 Shreemati Heritage. All Rights Reserved.</span>
        <div className="f-orn">✦ ✦ ✦</div>
      </div>
    </footer>
    </>
  );
}