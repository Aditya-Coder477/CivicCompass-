'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { CheckSquare, Square, Loader2, CheckCircle2 } from 'lucide-react';

const TYPES = [
  { id: 'first_time', label: '🌟 First-Time Voter' },
  { id: 'registered', label: '✅ Registered Voter' },
  { id: 'polling_day', label: '🗳️ Polling Day' },
];

export default function ChecklistPage() {
  const [userType, setUserType] = useState('first_time');
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('civicProfile');
    if (stored) {
      const p = JSON.parse(stored);
      setUserType(p.registered ? 'registered' : 'first_time');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    api.checklist(userType, 'en')
      .then(d => { setData(d); setChecked({}); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userType]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = data?.items?.length || 0;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <CheckSquare className="text-green-400" /> My Checklist
          </h1>
          <p className="text-slate-400">Track your pre-election preparation tasks.</p>
        </div>

        {/* Type selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TYPES.map(t => (
            <button key={t.id} id={`type-${t.id}`} onClick={() => setUserType(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all`}
              style={userType === t.id
                ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 size={36} className="animate-spin text-blue-400" /></div>
        ) : data && (
          <>
            {/* Progress */}
            <div className="glass p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-semibold text-white">{data.title}</h2>
                <SourceBadge label="ECI Guidelines" icon="🏛️" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10B981, #3B82F6)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                </div>
                <span className="text-sm font-semibold text-green-400">{pct}%</span>
              </div>
              <p className="text-slate-400 text-xs">{doneCount} of {total} tasks completed</p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {data.items.map((item, i) => {
                const done = !!checked[item.id];
                return (
                  <button key={item.id} id={`checklist-item-${item.id}`} onClick={() => toggle(item.id)}
                    className="glass p-4 w-full flex items-center gap-4 card-hover text-left transition-all animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms`, borderColor: done ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)' }}>
                    {done ? <CheckCircle2 size={22} className="text-green-400 flex-shrink-0" /> : <Square size={22} className="text-slate-600 flex-shrink-0" />}
                    <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.task}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.priority === 'high' ? 'bg-red-500/10 text-red-400' : item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-slate-500/10 text-slate-500'}`}>
                      {item.priority}
                    </span>
                  </button>
                );
              })}
            </div>

            {pct === 100 && (
              <div className="glass mt-6 p-5 text-center animate-fade-in" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
                <span className="text-3xl mb-2 block">🎉</span>
                <p className="font-heading font-bold text-green-300 text-lg">All done! You are ready to vote.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
