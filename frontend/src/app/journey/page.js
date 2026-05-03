'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { STAGE_COLORS, STAGE_ICONS, STAGE_STEPPER_LABELS, TOTAL_STAGES, EXPLAIN_STYLES } from '../../lib/constants';
import { CheckCircle, ArrowRight, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function JourneyPage() {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState(null);
  const [nextSteps, setNextSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [style, setStyle] = useState('summary');

  useEffect(() => {
    const stored = localStorage.getItem('civicProfile');
    if (stored) setProfile(JSON.parse(stored));
    else setError('Profile not found. Please start from the home page.');
  }, []);

  useEffect(() => {
    if (!profile) return;
    loadData();
  }, [profile, style]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [journeyData, stepsData] = await Promise.all([
        api.journey({ ...profile, language: 'en', style }),
        api.nextSteps(profile),
      ]);
      setData(journeyData);
      setNextSteps(stepsData.steps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stageIndex = data?.stage?.index ?? 0;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 relative z-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">
            {profile ? `Hello, ${profile.name} 👋` : 'Election Journey'}
          </h1>
          <p className="text-slate-400">Your personalized election roadmap — step by step.</p>
        </div>

        {error && (
          <div role="alert" className="glass p-4 mb-6 flex items-center gap-3 text-red-300" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
            <AlertCircle size={18} aria-hidden="true" />
            <span>{error}</span>
            {!profile && <Link href="/" className="ml-auto text-blue-400 underline text-sm">Go Home</Link>}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center" role="status" aria-label="Loading your journey">
              <Loader2 size={40} className="animate-spin text-blue-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-slate-400">Loading your journey...</p>
            </div>
          </div>
        ) : data && (
          <>
            {/* Progress Bar */}
            <div className="glass p-6 mb-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">Stage {stageIndex + 1} of {TOTAL_STAGES}</span>
                <SourceBadge label={data.sourceBadge} icon="⚙️" />
              </div>

              {/* Stage stepper — keyboard navigable */}
              <nav aria-label="Journey Stages">
                <div className="relative flex items-start justify-between mb-6 overflow-x-auto pb-2">
                  {Array.from({ length: TOTAL_STAGES }).map((_, i) => {
                    const done = i < stageIndex;
                    const active = i === stageIndex;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 min-w-[60px] relative">
                        {i < TOTAL_STAGES - 1 && (
                          <div className="absolute top-5 left-[calc(50%+12px)] right-[calc(-50%+12px)] h-0.5"
                            style={{ background: done ? '#10B981' : 'rgba(255,255,255,0.08)' }} aria-hidden="true" />
                        )}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 text-base ${active ? 'ring-2 ring-offset-2 ring-offset-navy-900' : ''}`}
                          style={{
                            background: done ? '#10B981' : active ? STAGE_COLORS[i] : 'rgba(255,255,255,0.06)',
                            boxShadow: active ? `0 0 20px ${STAGE_COLORS[i]}60` : 'none',
                          }}
                          aria-current={active ? 'step' : undefined}
                          aria-label={`Stage ${i + 1}: ${STAGE_STEPPER_LABELS[i]}${done ? ' (completed)' : active ? ' (current)' : ''}`}
                        >
                          {done ? <CheckCircle size={18} className="text-white" aria-hidden="true" /> : <span className="text-sm" aria-hidden="true">{STAGE_ICONS[i]}</span>}
                          {active && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 animate-ping" aria-hidden="true" />}
                        </div>
                        <span
                          className={`mt-2 text-center text-xs leading-tight px-1 ${active ? 'text-blue-300 font-semibold' : done ? 'text-slate-400' : 'text-slate-600'}`}
                          style={{ fontSize: '10px' }}
                          aria-hidden="true"
                        >
                          {STAGE_STEPPER_LABELS[i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </nav>

              {/* Progress bar */}
              <div
                className="w-full h-2 rounded-full mb-4"
                role="progressbar"
                aria-valuenow={data.stage.progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Journey progress: ${data.stage.progressPercent}% complete`}
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div className="h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.stage.progressPercent}%`, background: `linear-gradient(90deg, #10B981, ${STAGE_COLORS[stageIndex]})`, boxShadow: `0 0 10px ${STAGE_COLORS[stageIndex]}80` }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold" style={{ color: STAGE_COLORS[stageIndex] }}>
                  {STAGE_ICONS[stageIndex]} {data.stageDetails?.label || data.stage.label}
                </span>
                <span className="text-slate-500">{data.stage.progressPercent}% complete</span>
              </div>
            </div>

            {/* Eligibility status */}
            {!data.eligibility.eligible && (
              <div role="alert" className="glass p-4 mb-6 flex items-start gap-3" style={{ borderColor: 'rgba(249,115,22,0.3)' }}>
                <span className="text-2xl" aria-hidden="true">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-300 mb-1">Eligibility Notice</p>
                  <p className="text-slate-400 text-sm">{data.eligibility.reason}</p>
                </div>
              </div>
            )}

            {/* Style selector */}
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Explanation style">
              <span className="text-slate-500 text-sm self-center">Explain as:</span>
              {EXPLAIN_STYLES.map(s => (
                <button
                  key={s.id}
                  id={`style-${s.id}`}
                  onClick={() => setStyle(s.id)}
                  aria-pressed={style === s.id}
                  aria-label={`Explain as ${s.label}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${style === s.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                  style={style === s.id ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* AI Explanation */}
            {data.geminiExplanation && (
              <div className="glass p-6 mb-6 animate-slide-up" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-400 font-heading font-semibold text-sm">💡 Simplified Guidance</span>
                  <SourceBadge label="Simplified" icon="💡" />
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{data.geminiExplanation}</p>
              </div>
            )}

            {/* Next 3 steps */}
            <h2 className="font-heading font-bold text-xl text-white mb-4">Your Next 3 Steps</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {nextSteps.map((step, i) => (
                <article key={step.id} className="glass p-5 card-hover animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {i + 1}</span>
                    <SourceBadge label="ECI Guidelines" icon="🏛️" />
                  </div>
                  <h3 className="font-heading font-semibold text-white mb-2 text-sm leading-snug">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{step.description}</p>
                  <div className="flex items-center gap-1 text-blue-400 text-xs font-medium">
                    <ArrowRight size={12} aria-hidden="true" /> <span>Take action</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Quick links */}
            <nav aria-label="Quick navigation">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href: '/timeline', label: 'View Timeline', icon: '📅' },
                  { href: '/checklist', label: 'My Checklist', icon: '✅' },
                  { href: '/booth-locator', label: 'Find My Booth', icon: '📍' },
                  { href: '/simulate', label: 'Practice Voting', icon: '🗳️' },
                ].map(l => (
                  <Link key={l.href} href={l.href}
                    className="glass p-3 flex items-center gap-2 card-hover text-sm font-medium text-slate-300 hover:text-white"
                    aria-label={l.label}>
                    <span aria-hidden="true">{l.icon}</span>{l.label}<ChevronRight size={14} className="ml-auto opacity-50" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}
