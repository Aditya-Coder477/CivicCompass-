'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { HelpCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'voting-process', label: 'Voting Process' },
  { id: 'documents', label: 'Documents' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'technology', label: 'Technology' },
  { id: 'legal', label: 'Legal' },
];

function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flip-card h-52 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className={`flip-card-inner h-full ${flipped ? 'flipped' : ''}`}>
        {/* Front — Myth */}
        <div className="flip-card-front glass p-6 flex flex-col justify-between" style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">❓ Myth</span>
              <SourceBadge label="ECI Verified Data" icon="📖" />
            </div>
            <p className="text-white font-medium leading-relaxed text-sm">{card.myth}</p>
          </div>
          <p className="text-orange-400/60 text-xs mt-3">Tap to reveal the fact →</p>
        </div>
        {/* Back — Fact */}
        <div className="flip-card-back glass p-6 flex flex-col justify-between" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-green-400">✅ Fact</span>
              <SourceBadge label="ECI Verified Data" icon="✅" />
            </div>
            <p className="text-white font-medium leading-relaxed text-sm">{card.fact}</p>
          </div>
          <p className="text-green-400/60 text-xs mt-3">← Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}

export default function MythsPage() {
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PER_PAGE = 4;

  useEffect(() => {
    setLoading(true);
    setPage(0);
    api.mythFact('en', category || undefined)
      .then(d => setCards(d.cards || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const totalPages = Math.ceil(cards.length / PER_PAGE);
  const visible = cards.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <HelpCircle className="text-orange-400" /> Myth vs Fact
          </h1>
          <p className="text-slate-400">Tap a card to reveal the truth about Indian elections.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button key={c.id} id={`cat-${c.id || 'all'}`} onClick={() => setCategory(c.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={category === c.id
                ? { background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)', color: '#FB923C' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 size={36} className="animate-spin text-orange-400" /></div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {visible.map((card, i) => <FlipCard key={card.id || i} card={card} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="p-2 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5">
                  <ChevronLeft size={20} className="text-slate-300" />
                </button>
                <span className="text-sm text-slate-400">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                  className="p-2 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5">
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
