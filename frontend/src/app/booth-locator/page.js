'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { MapPin, Search, Loader2, Navigation, Clock } from 'lucide-react';

const STATES = ['Delhi','Maharashtra','Gujarat','Karnataka','Rajasthan','Uttar Pradesh','Tamil Nadu','West Bengal','Punjab','Andhra Pradesh'];

export default function BoothLocatorPage() {
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('civicProfile');
    if (stored) {
      const p = JSON.parse(stored);
      setState(p.stateName || '');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setBooth(null);
    try {
      const data = await api.boothLocator(district, state, pincode);
      setBooth(data.booth);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <MapPin className="text-orange-400" /> Booth Locator
          </h1>
          <p className="text-slate-400">Find your assigned polling booth using mock location data.</p>
        </div>

        {/* Search form */}
        <div className="glass p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">State / UT</label>
              <select id="booth-state" className="select-field" value={state} onChange={e => setState(e.target.value)}>
                <option value="">Select state...</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">District</label>
              <input id="booth-district" className="input-field" placeholder="e.g. Central Delhi" value={district} onChange={e => setDistrict(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Pincode (optional)</label>
              <input id="booth-pincode" className="input-field" placeholder="e.g. 110005" value={pincode} onChange={e => setPincode(e.target.value)} />
            </div>
            <button type="submit" id="btn-find-booth" className="btn-primary w-full justify-center">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              {loading ? 'Searching...' : 'Find My Booth'}
            </button>
          </form>
        </div>

        {error && <div className="glass p-4 mb-4 text-red-300 text-sm flex items-center gap-2"><span>⚠️</span>{error}</div>}

        {/* Booth result */}
        {booth && (
          <div className="glass p-6 animate-slide-up" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-heading font-bold text-white text-lg">{booth.name}</h2>
              <SourceBadge label="ECI Verified Data" icon="📍" />
            </div>

            <p className="text-slate-300 text-sm mb-4 flex items-start gap-2">
              <MapPin size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
              {booth.address}
            </p>

            <div className="flex gap-4 mb-6">
              <div className="glass p-3 flex-1 flex items-center gap-2">
                <Navigation size={16} className="text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="text-sm font-semibold text-white">{booth.distance}</p>
                </div>
              </div>
              <div className="glass p-3 flex-1 flex items-center gap-2">
                <Clock size={16} className="text-green-400" />
                <div>
                  <p className="text-xs text-slate-500">Travel Time</p>
                  <p className="text-sm font-semibold text-white">{booth.travelTime}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden h-40 flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #0F2040, #162A52)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center animate-bounce" style={{ background: 'rgba(249,115,22,0.2)', border: '2px solid #F97316' }}>
                  <MapPin size={20} className="text-orange-400" />
                </div>
                <p className="text-slate-400 text-xs">Map view — Phase 2 integration</p>
                <p className="text-slate-600 text-xs">Lat: {booth.coordinates?.lat} · Lng: {booth.coordinates?.lng}</p>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
