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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function getSarees() {
      const { data } = await supabase.from('Sarees').select('*');
      if (data) setSarees(data);
    }
    getSarees();

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryInventory = sarees.filter(s => s.category === viewingCategory);

  const addToCart = (saree: any) => {
    setCart([...cart, saree]);
    setIsCartOpen(true);
  };

  const removeFromCart = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
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
      setChatResponse("Namaste. I am here to help you find the perfect drape for your occasion. What are you celebrating?");
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --cream: #F8F4EE;
          --warm-white: #FDFAF6;
          --gold: #BFA16A;
          --gold-light: #D4B882;
          --gold-dark: #9A7D4A;
          --charcoal: #1C1916;
          --brown: #3D2E20;
          --muted: #8A7968;
          --border: #E8DED0;
          --card-bg: #FEFCF9;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--warm-white);
          color: var(--charcoal);
          overflow-x: hidden;
        }

        /* ── MARQUEE ── */
        .marquee-wrapper {
          background: var(--charcoal);
          overflow: hidden;
          white-space: nowrap;
          padding: 10px 0;
        }
        .marquee-track {
          display: inline-block;
          animation: marquee 28s linear infinite;
        }
        .marquee-text {
          display: inline-block;
          color: var(--gold);
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          padding: 0 40px;
        }
        .marquee-dot {
          color: var(--gold-light);
          opacity: 0.5;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 0 48px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(253, 250, 246, 0.97);
          backdrop-filter: blur(12px);
          border-bottom-color: var(--border);
          box-shadow: 0 1px 30px rgba(0,0,0,0.04);
        }
        .navbar:not(.scrolled) {
          background: rgba(253, 250, 246, 0.92);
          backdrop-filter: blur(8px);
          border-bottom-color: var(--border);
        }
        .nav-logo {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-logo-main {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: var(--charcoal);
          text-transform: uppercase;
          line-height: 1;
        }
        .nav-logo-sub {
          font-size: 8px;
          letter-spacing: 0.45em;
          color: var(--gold);
          text-transform: uppercase;
          font-weight: 300;
        }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }
        .nav-links a {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-links a:hover { color: var(--charcoal); }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-bag-btn {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: var(--charcoal);
          color: var(--cream);
          border: none;
          padding: 10px 22px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          transition: background 0.2s, transform 0.15s;
          position: relative;
        }
        .nav-bag-btn:hover { background: var(--brown); }
        .bag-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 18px;
          height: 18px;
          background: var(--gold);
          color: white;
          border-radius: 50%;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          height: 92vh;
          min-height: 620px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(20,15,10,0.72) 0%,
            rgba(20,15,10,0.35) 55%,
            rgba(20,15,10,0.1) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 0 48px;
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .hero-line {
          width: 40px;
          height: 1px;
          background: var(--gold);
          opacity: 0.8;
        }
        .hero-eyebrow-text {
          font-size: 9px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--gold-light);
          font-weight: 300;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 8vw, 110px);
          font-weight: 300;
          color: #FDFAF6;
          line-height: 0.95;
          letter-spacing: -0.01em;
          margin-bottom: 12px;
        }
        .hero-title em {
          font-style: italic;
          color: var(--gold-light);
        }
        .hero-subtitle {
          font-size: 12px;
          letter-spacing: 0.2em;
          color: rgba(253,250,246,0.6);
          text-transform: uppercase;
          font-weight: 300;
          margin-bottom: 48px;
          max-width: 340px;
          line-height: 2;
        }
        .hero-cta-row {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .btn-primary {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          background: var(--gold);
          color: var(--charcoal);
          border: none;
          padding: 16px 36px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          transition: all 0.25s;
        }
        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(191,161,106,0.35);
        }
        .btn-ghost {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          background: transparent;
          color: rgba(253,250,246,0.8);
          border: 1px solid rgba(253,250,246,0.3);
          padding: 16px 36px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          transition: all 0.25s;
        }
        .btn-ghost:hover {
          border-color: rgba(253,250,246,0.7);
          color: #FDFAF6;
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
          cursor: pointer;
        }
        .scroll-dot {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(191,161,106,0.8), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        .scroll-label {
          font-size: 8px;
          letter-spacing: 0.4em;
          color: rgba(253,250,246,0.5);
          text-transform: uppercase;
          transform: rotate(90deg);
          transform-origin: center;
          margin-top: 4px;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        /* ── PHILOSOPHY STRIP ── */
        .philosophy {
          padding: 80px 48px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 0;
        }
        .philosophy-item {
          text-align: center;
          padding: 0 32px;
        }
        .philosophy-numeral {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 300;
          color: var(--gold);
          opacity: 0.6;
          line-height: 1;
          margin-bottom: 8px;
        }
        .philosophy-label {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 300;
        }
        .philosophy-divider {
          width: 1px;
          height: 50px;
          background: var(--border);
        }

        /* ── SECTION HEADER ── */
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: var(--gold); }
        .eyebrow-text {
          font-size: 9px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          color: var(--charcoal);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .section-title em { font-style: italic; }

        /* ── CATEGORIES GRID ── */
        .collections-section {
          padding: 0 48px 100px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2px;
        }
        .category-card {
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background: var(--charcoal);
        }
        .category-card:nth-child(1),
        .category-card:nth-child(6) {
          grid-column: span 2;
        }
        .category-card-inner {
          aspect-ratio: 3/4;
          position: relative;
          overflow: hidden;
        }
        .category-card:nth-child(1) .category-card-inner,
        .category-card:nth-child(6) .category-card-inner {
          aspect-ratio: 2/2.2;
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      filter 0.8s ease;
          filter: brightness(0.75) saturate(0.9);
        }
        .category-card:hover .category-img {
          transform: scale(1.08);
          filter: brightness(0.65) saturate(1.1);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.1) 50%, transparent 100%);
        }
        .category-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .category-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 400;
          color: #FDFAF6;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
        }
        .category-explore {
          font-size: 8px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold-light);
          font-weight: 300;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.3s ease;
        }
        .category-card:hover .category-explore {
          opacity: 1;
          transform: translateY(0);
        }
        .category-corner {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 22px;
          height: 22px;
          border-top: 1px solid rgba(191,161,106,0.5);
          border-right: 1px solid rgba(191,161,106,0.5);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .category-card:hover .category-corner { opacity: 1; }

        /* ── PRODUCT GRID ── */
        .product-section {
          padding: 0 48px 100px;
          max-width: 1300px;
          margin: 0 auto;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 56px;
        }
        .breadcrumb-back {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          border: none;
          background: none;
          font-family: 'Jost', sans-serif;
          transition: color 0.2s;
        }
        .breadcrumb-back:hover { color: var(--charcoal); }
        .breadcrumb-arrow { font-size: 14px; }
        .breadcrumb-sep {
          width: 24px;
          height: 1px;
          background: var(--border);
        }
        .breadcrumb-current {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
        }
        .product-collection-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 300;
          color: var(--charcoal);
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }
        .product-collection-subtitle {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
          font-weight: 300;
          margin-bottom: 56px;
          text-transform: uppercase;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px 32px;
        }
        .product-card { cursor: default; }
        .product-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--cream);
          margin-bottom: 20px;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .product-img-wrap:hover .product-img { transform: scale(1.06); }
        .product-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          font-size: 7px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          background: var(--gold);
          color: var(--charcoal);
          padding: 5px 10px;
          font-weight: 500;
        }
        .product-quick-add {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(28,25,22,0.92);
          color: var(--gold-light);
          border: none;
          padding: 16px;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          cursor: pointer;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .product-img-wrap:hover .product-quick-add { transform: translateY(0); }
        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-price {
          font-size: 13px;
          font-weight: 400;
          color: var(--gold-dark);
          letter-spacing: 0.05em;
        }
        .product-add-btn {
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 8px 16px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          transition: all 0.2s;
        }
        .product-add-btn:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--cream);
        }

        /* ── CART PANEL ── */
        .cart-backdrop {
          position: fixed;
          inset: 0;
          z-index: 110;
          background: rgba(20,15,10,0.5);
          backdrop-filter: blur(6px);
          animation: fadeIn 0.25s ease;
        }
        .cart-panel {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          max-width: 480px;
          background: var(--warm-white);
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 36px 40px 28px;
          border-bottom: 1px solid var(--border);
        }
        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.05em;
        }
        .cart-count {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--muted);
          margin-top: 2px;
          text-transform: uppercase;
        }
        .cart-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          font-family: 'Jost', sans-serif;
          transition: color 0.2s;
        }
        .cart-close:hover { color: var(--charcoal); }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 32px 40px;
        }
        .cart-item {
          display: flex;
          gap: 20px;
          padding-bottom: 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border);
        }
        .cart-item-img {
          width: 72px;
          height: 96px;
          object-fit: cover;
          background: var(--cream);
          flex-shrink: 0;
        }
        .cart-item-info { flex: 1; }
        .cart-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 400;
          margin-bottom: 4px;
          letter-spacing: 0.03em;
        }
        .cart-item-price {
          font-size: 13px;
          color: var(--gold-dark);
          font-weight: 400;
          margin-bottom: 12px;
        }
        .cart-item-remove {
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: color 0.2s;
        }
        .cart-item-remove:hover { color: var(--charcoal); }
        .cart-footer {
          padding: 28px 40px 40px;
          border-top: 1px solid var(--border);
        }
        .cart-subtotal {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .cart-subtotal-label {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .cart-subtotal-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: var(--charcoal);
        }
        .cart-note {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          font-weight: 300;
        }
        .checkout-btn {
          width: 100%;
          background: var(--charcoal);
          color: var(--cream);
          border: none;
          padding: 18px;
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.2s;
        }
        .checkout-btn:hover { background: var(--brown); }
        .cart-empty {
          text-align: center;
          padding: 80px 20px;
        }
        .cart-empty-icon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          color: var(--border);
          margin-bottom: 16px;
        }
        .cart-empty-text {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .order-success {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 40px;
          text-align: center;
        }
        .success-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--gold);
        }
        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 0.05em;
        }
        .success-sub {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
          font-weight: 300;
          max-width: 260px;
          line-height: 1.8;
        }

        /* ── AI STYLIST CHAT ── */
        .chat-fab-area {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }
        .chat-window {
          width: 360px;
          background: var(--warm-white);
          box-shadow: 0 20px 80px rgba(20,15,10,0.18);
          border: 1px solid var(--border);
          overflow: hidden;
          animation: fadeSlideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-header {
          background: var(--charcoal);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-header-info {}
        .chat-label {
          font-size: 8px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--gold-light);
          opacity: 0.8;
          font-weight: 300;
          margin-bottom: 2px;
        }
        .chat-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: #FDFAF6;
          font-style: italic;
        }
        .chat-close-btn {
          background: none;
          border: none;
          color: rgba(253,250,246,0.5);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 4px;
          transition: color 0.2s;
        }
        .chat-close-btn:hover { color: rgba(253,250,246,0.9); }
        .chat-body {
          padding: 24px;
          min-height: 160px;
          max-height: 220px;
          overflow-y: auto;
          background: #F9F5F0;
          border-bottom: 1px solid var(--border);
        }
        .chat-response {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-style: italic;
          color: var(--brown);
          line-height: 1.7;
          font-weight: 300;
        }
        .chat-input-area {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
          background: var(--warm-white);
        }
        .chat-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 11px;
          color: var(--charcoal);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          letter-spacing: 0.05em;
        }
        .chat-input::placeholder { color: var(--muted); }
        .chat-send-btn {
          font-size: 8px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          background: var(--gold);
          color: var(--charcoal);
          border: none;
          padding: 9px 16px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .chat-send-btn:hover { background: var(--gold-light); }
        .chat-fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--charcoal);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(20,15,10,0.25);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          flex-direction: column;
          gap: 2px;
        }
        .chat-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 40px rgba(20,15,10,0.3);
          background: var(--brown);
        }
        .chat-fab-text {
          font-size: 7px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-light);
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          text-align: center;
          line-height: 1.3;
        }

        /* ── EDITORIAL STRIP ── */
        .editorial-strip {
          background: var(--charcoal);
          padding: 80px 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 80px;
          overflow: hidden;
          position: relative;
        }
        .editorial-strip::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(191,161,106,0.06) 0%, transparent 70%);
        }
        .editorial-item {
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .editorial-numeral {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 8px;
        }
        .editorial-label-main {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(253,250,246,0.7);
          font-weight: 300;
        }
        .editorial-divider-v {
          width: 1px;
          height: 60px;
          background: rgba(191,161,106,0.25);
        }

        /* ── FOOTER ── */
        footer {
          background: #141210;
          color: rgba(253,250,246,0.6);
          padding: 80px 48px 48px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 40px;
        }
        .footer-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 0.25em;
          color: #FDFAF6;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .footer-brand-tagline {
          font-size: 8px;
          letter-spacing: 0.45em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .footer-brand-desc {
          font-size: 11px;
          line-height: 1.9;
          color: rgba(253,250,246,0.45);
          max-width: 300px;
          font-weight: 300;
        }
        .footer-col-title {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(253,250,246,0.9);
          font-weight: 400;
          margin-bottom: 20px;
        }
        .footer-link {
          display: block;
          font-size: 11px;
          color: rgba(253,250,246,0.45);
          text-decoration: none;
          margin-bottom: 12px;
          font-weight: 300;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          cursor: pointer;
        }
        .footer-link:hover { color: var(--gold-light); }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-copyright {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(253,250,246,0.25);
        }
        .footer-gold-line {
          width: 40px;
          height: 1px;
          background: var(--gold);
          opacity: 0.4;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .nav-links { display: none; }
          .hero-content { padding: 0 20px; }
          .hero-title { font-size: 48px; }
          .philosophy { grid-template-columns: 1fr; gap: 32px; padding: 60px 20px; }
          .philosophy-divider { display: none; }
          .collections-section { padding: 0 16px 60px; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .category-card:nth-child(1), .category-card:nth-child(6) { grid-column: span 1; }
          .product-section { padding: 0 20px 60px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 16px; }
          .editorial-strip { flex-direction: column; gap: 40px; padding: 60px 20px; }
          .editorial-divider-v { display: none; }
          footer { padding: 60px 20px 40px; }
          .footer-top { grid-template-columns: 1fr; }
          .chat-window { width: calc(100vw - 48px); }
        }
      `}</style>

      {/* MARQUEE */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee-text">
              Handwoven Heritage <span className="marquee-dot">◆</span> Free Shipping Above ₹15,000 <span className="marquee-dot">◆</span> Authentic Weaves <span className="marquee-dot">◆</span> Jodhpur, Rajasthan
            </span>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => setViewingCategory(null)}>
          <span className="nav-logo-main">Shreemati</span>
          <span className="nav-logo-sub">Jodhpur · Est. 1984</span>
        </div>
        <ul className="nav-links">
          <li><a onClick={() => setViewingCategory(null)}>Collections</a></li>
          <li><a>Heritage</a></li>
          <li><a>Atelier</a></li>
          <li><a>Care</a></li>
        </ul>
        <div className="nav-actions">
          <button className="nav-bag-btn" onClick={() => setIsCartOpen(true)}>
            Bag
            {cart.length > 0 && <span className="bag-badge">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* FLOATING AI STYLIST */}
      <div className="chat-fab-area">
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-label">Personal Stylist</div>
                <div className="chat-name">Radhika</div>
              </div>
              <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>✕</button>
            </div>
            <div className="chat-body">
              <p className="chat-response">
                {chatResponse || "Namaste. I am Radhika, your personal drape consultant. Share the occasion — I shall guide you to the perfect weave."}
              </p>
            </div>
            <div className="chat-input-area">
              <input
                className="chat-input"
                placeholder="Ask about weaves, occasions, styling…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && askAI()}
              />
              <button className="chat-send-btn" onClick={askAI}>
                {loading ? "···" : "Ask"}
              </button>
            </div>
          </div>
        )}
        <button className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
          <span className="chat-fab-text">Your<br/>Stylist</span>
        </button>
      </div>

      {/* CART PANEL */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={e => { if (e.target === e.currentTarget) setIsCartOpen(false); }}>
          <div className="cart-panel">
            <div className="cart-header">
              <div>
                <div className="cart-title">Your Selection</div>
                <div className="cart-count">{cart.length} {cart.length === 1 ? 'piece' : 'pieces'}</div>
              </div>
              <button className="cart-close" onClick={() => setIsCartOpen(false)}>Close</button>
            </div>

            {orderComplete ? (
              <div className="order-success">
                <div className="success-circle">✓</div>
                <div className="success-title">Order Received</div>
                <p className="success-sub">Namaste! Your drapes are being prepared with care. Expect a confirmation shortly.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="cart-items">
                <div className="cart-empty">
                  <div className="cart-empty-icon">◇</div>
                  <div className="cart-empty-text">Your selection is empty</div>
                </div>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item, idx) => (
                    <div key={idx} className="cart-item">
                      <img src={item.image_url} className="cart-item-img" alt={item.name} />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(idx)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span className="cart-subtotal-label">Subtotal</span>
                    <span className="cart-subtotal-value">₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="cart-note">Duties & shipping calculated at checkout</p>
                  <button className="checkout-btn" onClick={simulateCheckout}>
                    Proceed to Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!viewingCategory ? (
        <>
          {/* HERO */}
          <section className="hero">
            <img
              src="https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg?auto=compress&w=1920"
              className="hero-img"
              alt="Shreemati Heritage Sarees"
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-eyebrow">
                <div className="hero-line" />
                <span className="hero-eyebrow-text">From the Heart of Marwar</span>
              </div>
              <h2 className="hero-title">
                Timeless<br /><em>Drapes</em>
              </h2>
              <p className="hero-subtitle">
                Heritage weaves, curated<br />for the discerning woman
              </p>
              <div className="hero-cta-row">
                <button className="btn-primary" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Collections
                </button>
                <button className="btn-ghost" onClick={() => setIsChatOpen(true)}>
                  Speak with Radhika
                </button>
              </div>
            </div>
            <div className="hero-scroll-indicator" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="scroll-dot" />
            </div>
          </section>

          {/* PHILOSOPHY STRIP */}
          <section className="philosophy">
            <div className="philosophy-item">
              <div className="philosophy-numeral">40+</div>
              <div className="philosophy-label">Years of Heritage</div>
            </div>
            <div className="philosophy-divider" />
            <div className="philosophy-item">
              <div className="philosophy-numeral">200+</div>
              <div className="philosophy-label">Artisan Families</div>
            </div>
            <div className="philosophy-divider" />
            <div className="philosophy-item">
              <div className="philosophy-numeral">10</div>
              <div className="philosophy-label">Distinct Weaves</div>
            </div>
          </section>

          {/* COLLECTIONS */}
          <section id="collections" className="collections-section">
            <div className="section-header">
              <div className="section-eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">The Collections</span>
                <div className="eyebrow-line" />
              </div>
              <h3 className="section-title">Curated <em>Weaves</em></h3>
            </div>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <div key={cat} className="category-card" onClick={() => setViewingCategory(cat)}>
                  <div className="category-card-inner">
                    <img
                      src={sarees.find(s => s.category === cat)?.image_url || 'https://images.pexels.com/photos/15725333/pexels-photo-15725333.jpeg'}
                      className="category-img"
                      alt={cat}
                    />
                    <div className="category-overlay" />
                    <div className="category-corner" />
                    <div className="category-info">
                      <span className="category-name">{cat}</span>
                      <span className="category-explore">Explore →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EDITORIAL STRIP */}
          <section className="editorial-strip">
            <div className="editorial-item">
              <div className="editorial-numeral">I</div>
              <div className="editorial-label-main">Handwoven</div>
            </div>
            <div className="editorial-divider-v" />
            <div className="editorial-item">
              <div className="editorial-numeral">II</div>
              <div className="editorial-label-main">Authenticated</div>
            </div>
            <div className="editorial-divider-v" />
            <div className="editorial-item">
              <div className="editorial-numeral">III</div>
              <div className="editorial-label-main">Delivered</div>
            </div>
            <div className="editorial-divider-v" />
            <div className="editorial-item">
              <div className="editorial-numeral">IV</div>
              <div className="editorial-label-main">Cherished</div>
            </div>
          </section>
        </>
      ) : (
        /* PRODUCT LISTING */
        <section className="product-section" style={{ paddingTop: '56px' }}>
          <div className="breadcrumb">
            <button className="breadcrumb-back" onClick={() => setViewingCategory(null)}>
              <span className="breadcrumb-arrow">←</span>
              Collections
            </button>
            <div className="breadcrumb-sep" />
            <span className="breadcrumb-current">{viewingCategory}</span>
          </div>
          <div className="section-header" style={{ textAlign: 'left' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'flex-start' }}>
              <span className="eyebrow-text">{viewingCategory} Sarees</span>
            </div>
            <h2 className="product-collection-title">
              The <em>{viewingCategory}</em><br />Collection
            </h2>
            <p className="product-collection-subtitle">
              {categoryInventory.length} Pieces Available
            </p>
          </div>
          <div className="products-grid">
            {categoryInventory.map((s, idx) => (
              <div key={s.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={s.image_url} className="product-img" alt={s.name} />
                  <div className="product-tag">{viewingCategory}</div>
                  <button className="product-quick-add" onClick={() => addToCart(s)}>
                    Add to Selection
                  </button>
                </div>
                <div className="product-name">{s.name}</div>
                <div className="product-meta">
                  <span className="product-price">₹{s.price.toLocaleString('en-IN')}</span>
                  <button className="product-add-btn" onClick={() => addToCart(s)}>Add to Bag</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Shreemati</div>
              <div className="footer-brand-tagline">Heritage · Craft · Jodhpur</div>
              <p className="footer-brand-desc">
                Since 1984, Shreemati has been a custodian of India's finest handwoven traditions — preserving the artistry of 200+ artisan families across Rajasthan.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Navigate</div>
              <a className="footer-link" onClick={() => setViewingCategory(null)}>Collections</a>
              <a className="footer-link">Heritage</a>
              <a className="footer-link">Care Guide</a>
              <a className="footer-link">Atelier</a>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <a className="footer-link">+91 9252703456</a>
              <a className="footer-link" href="https://maps.app.goo.gl/ZWTxmrmdtPAGRLyf9" target="_blank">
                Jodhpur, Rajasthan
              </a>
              <a className="footer-link" href="https://www.instagram.com/shreemati_sarees_jodhpur/" target="_blank">
                Instagram
              </a>
            </div>
            <div>
              <div className="footer-col-title">Policies</div>
              <a className="footer-link">Shipping</a>
              <a className="footer-link">Returns</a>
              <a className="footer-link">Authenticity</a>
              <a className="footer-link">Privacy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-gold-line" />
            <span className="footer-copyright">© 2026 Shreemati Heritage. All Rights Reserved.</span>
            <div className="footer-gold-line" />
          </div>
        </div>
      </footer>
    </>
  );
}