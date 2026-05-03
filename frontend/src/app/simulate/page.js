'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { STEP_COLORS, STEP_ICONS } from '../../lib/constants';
import { Loader2, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react';

export default function SimulatePage() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.simulateVoting()
      .then(d => setSteps(d.steps || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const step = steps[currentStep];
  const progress = steps.length ? Math.round((currentStep / steps.length) * 100) : 0;

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else setDone(true);
  };
  const reset = () => { setCurrentStep(0); setDone(false); };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2">🗳️ Practice Voting</h1>
          <p className="text-slate-400">Simulate the actual voting process step by step — no real votes!</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-32" role="status" aria-label="Loading simulation">
            <Loader2 size={36} className="animate-spin text-blue-400" aria-hidden="true" />
          </div>
        ) : done ? (
          <div className="glass p-10 text-center animate-fade-in" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' }}>
            <div className="text-6xl mb-4" aria-hidden="true">🎉</div>
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-heading font-bold text-2xl text-green-300 mb-2">You voted successfully!</h2>
            <p className="text-slate-400 mb-6 text-sm">You now know exactly what to expect on polling day. You're ready!</p>
            <SourceBadge label="ECI Official Data" icon="🗳️" />
            <br /><br />
            <button
              onClick={reset}
              id="btn-restart-sim"
              aria-label="Practice the voting simulation again"
              className="btn-primary mx-auto"
            >
              <RotateCcw size={16} aria-hidden="true" /> Practice Again
            </button>
          </div>
        ) : step && (
          <>
            {/* Progress */}
            <div className="glass p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">Step {currentStep + 1} of {steps.length}</span>
                <SourceBadge label="ECI Official Data" icon="🗳️" />
              </div>
              <div
                className="w-full h-2 rounded-full"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Simulation progress: step ${currentStep + 1} of ${steps.length}`}
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, #10B981, ${STEP_COLORS[currentStep % STEP_COLORS.length]})` }} />
              </div>
            </div>

            {/* Step breadcrumbs */}
            <div className="flex gap-2 flex-wrap mb-6" aria-hidden="true">
              {steps.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i < currentStep ? '#10B981' : i === currentStep ? STEP_COLORS[i % STEP_COLORS.length] : 'rgba(255,255,255,0.12)' }} />
              ))}
            </div>

            {/* Main step card */}
            <article key={currentStep} className="glass p-8 mb-6 animate-slide-up" style={{ borderColor: `${STEP_COLORS[currentStep % STEP_COLORS.length]}30` }}>

              {/* EVM visual for step 4 */}
              {currentStep === 3 && (
                <section aria-label="EVM Display — Electronic Voting Machine" className="mb-6 p-4 rounded-2xl flex flex-col items-center" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">EVM Display</p>
                  <div className="space-y-2 w-full max-w-xs">
                    {['Candidate A — Party 🌸', 'Candidate B — Party ⭐', 'Candidate C — Party 🔵', 'NOTA — None of the Above'].map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span className="text-xs text-slate-300">{c}</span>
                        <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center" aria-hidden="true">
                          <span className="text-blue-300 text-xs">⚪</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Press the button next to your choice</p>
                </section>
              )}

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4" aria-hidden="true"
                style={{ background: `${STEP_COLORS[currentStep % STEP_COLORS.length]}15`, border: `1px solid ${STEP_COLORS[currentStep % STEP_COLORS.length]}30` }}>
                {STEP_ICONS[currentStep] || '📋'}
              </div>

              <h2 className="font-heading font-bold text-2xl text-white mb-3">{step.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-4">{step.description}</p>

              {step.tip && (
                <div className="p-3 rounded-xl text-sm text-blue-300 flex items-start gap-2"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <span className="flex-shrink-0" aria-hidden="true">💡</span>
                  <span>{step.tip}</span>
                </div>
              )}
            </article>

            <button
              onClick={next}
              id={`btn-next-step-${currentStep}`}
              aria-label={currentStep < steps.length - 1 ? `Proceed to step ${currentStep + 2}: ${steps[currentStep + 1]?.title}` : 'Complete the voting simulation'}
              className="btn-primary w-full justify-center"
            >
              {currentStep < steps.length - 1 ? (<>Next Step <ChevronRight size={18} aria-hidden="true" /></>) : (<>Complete Simulation ✓</>)}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
