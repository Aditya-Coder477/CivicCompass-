'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { Calendar, Loader2, AlertCircle, Clock } from 'lucide-react';

const EVENT_COLORS = ['#6366F1','#3B82F6','#0EA5E9','#F97316','#10B981'];
const EVENT_ICONS = ['📢','📋','🚫','🗳️','📊'];

export default function TimelinePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('civicProfile');
    const p = stored ? JSON.parse(stored) : { state: 'delhi', stateName: 'Delhi' };
    setProfile(p);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    api.timeline(profile.state || 'delhi', 'en')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [profile]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <Calendar className="text-blue-400" /> Election Timeline
          </h1>
          <p className="text-slate-400">Election schedule for {profile?.stateName || 'your state'}</p>
        </div>

        {error && <div className="glass p-4 mb-6 flex items-center gap-3 text-red-300"><AlertCircle size={18}/>{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-32"><Loader2 size={36} className="animate-spin text-blue-400" /></div>
        ) : data && (
          <>
            {data.timeline.isFallback && (
              <div className="glass p-3 mb-6 text-sm text-yellow-300 flex items-center gap-2" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                <span>⚠️</span> Showing sample timeline data.
              </div>
            )}

            {/* Summary card */}
            <div className="glass p-5 mb-8" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-semibold text-blue-300">💡 Summary</span>
                <SourceBadge label="ECI Official Data" icon="📊" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{data.geminiSummary}</p>
            </div>

            {/* Poll proximity badge */}
            {data.timeline.pollProximityDays !== undefined && (
              <div className="flex items-center gap-3 mb-8">
                <Clock size={16} className="text-orange-400" />
                <span className="text-sm text-slate-300">
                  {data.timeline.pollProximityDays > 0
                    ? <><span className="text-orange-300 font-semibold">{data.timeline.pollProximityDays} days</span> until polling day</>
                    : <span className="text-slate-400">Election results have been declared</span>
                  }
                </span>
              </div>
            )}

            {/* Timeline events */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: 'rgba(255,255,255,0.06)' }} />

              <div className="space-y-6">
                {data.timeline.events.map((event, i) => (
                  <div key={i} className="flex gap-5 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative z-10 text-lg"
                      style={{ background: `${EVENT_COLORS[i]}20`, border: `2px solid ${EVENT_COLORS[i]}50`, boxShadow: `0 0 15px ${EVENT_COLORS[i]}30` }}>
                      {EVENT_ICONS[i]}
                    </div>

                    {/* Content */}
                    <div className="glass p-4 flex-1 card-hover">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-white text-sm">{event.event}</h3>
                        <SourceBadge label="ECI Official Data" icon="📅" />
                      </div>
                      <p className="text-xs font-mono mb-2" style={{ color: EVENT_COLORS[i] }}>{event.date}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
