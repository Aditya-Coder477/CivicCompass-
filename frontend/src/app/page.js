'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Compass, ChevronRight, Star } from 'lucide-react';

const STATES = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Uttar Pradesh','West Bengal'];
const STATE_KEYS = { 'Andhra Pradesh':'andhrapradesh','Delhi':'delhi','Gujarat':'gujarat','Karnataka':'karnataka','Maharashtra':'maharashtra','Punjab':'punjab','Rajasthan':'rajasthan','Tamil Nadu':'tamilnadu','Uttar Pradesh':'up','West Bengal':'westbengal' };


export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', age: '', state: '', registered: '', verified: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.state || form.registered === '') {
      setError('Please fill in all required fields.');
      return;
    }
    const profile = {
      name: form.name,
      age: parseInt(form.age),
      state: STATE_KEYS[form.state] || form.state.toLowerCase(),
      stateName: form.state,
      registered: form.registered === 'yes',
      verified: form.verified === 'yes',
      pollProximityDays: 25,
    };
    localStorage.setItem('civicProfile', JSON.stringify(profile));
    router.push('/journey');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-20 pb-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93C5FD' }}>
              <Star size={14} className="fill-current" />
              Election Guidance
            </div>

            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-4 leading-tight">
              <span className="text-white">Your </span>
              <span className="gradient-text">Election</span>
              <br />
              <span className="text-white">Compass</span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
              Navigate India's election journey with confidence. From eligibility to results — we guide every step.
            </p>
            <div className="tricolor-bar w-32 mx-auto mb-8" />

            {/* Logo mark — below the heading */}
            <div className="w-20 h-20 mx-auto mb-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 0 60px rgba(59,130,246,0.4)' }}>
              <Compass size={40} className="text-white" />
            </div>
          </div>
        </section>


        {/* Onboarding form */}
        <section className="pb-24 px-4">
          <div className="max-w-lg mx-auto">
            <div className="glass p-8" style={{ boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
              <div className="mb-6">
                <h2 className="font-heading font-bold text-2xl text-white mb-1">Start Your Journey</h2>
                <p className="text-slate-400 text-sm">Tell us a bit about yourself to personalize your experience.</p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                  <input id="input-name" className="input-field" placeholder="e.g. Priya Sharma" value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setError(''); }} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Age *</label>
                  <input id="input-age" type="number" min="0" max="120" className="input-field" placeholder="e.g. 22"
                    value={form.age} onChange={e => { setForm({ ...form, age: e.target.value }); setError(''); }} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">State / UT *</label>
                  <select id="select-state" className="select-field" value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}>
                    <option value="">Select your state...</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Are you registered to vote? *</label>
                  <div className="flex gap-3">
                    {['yes', 'no'].map(v => (
                      <button type="button" key={v} id={`btn-registered-${v}`}
                        onClick={() => setForm({ ...form, registered: v })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.registered === v ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        style={form.registered === v ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93C5FD' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {v === 'yes' ? '✓ Yes' : '✗ No'}
                      </button>
                    ))}
                  </div>
                </div>

                {form.registered === 'yes' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Is your name verified on the voter list?</label>
                    <div className="flex gap-3">
                      {['yes', 'no'].map(v => (
                        <button type="button" key={v} id={`btn-verified-${v}`}
                          onClick={() => setForm({ ...form, verified: v })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all`}
                          style={form.verified === v ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6EE7B7' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                          {v === 'yes' ? '✓ Verified' : '✗ Not verified'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" id="btn-start-journey" className="btn-primary w-full justify-center mt-2">
                  Start My Election Journey
                  <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
