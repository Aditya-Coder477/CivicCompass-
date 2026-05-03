'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { MapPin, Search, Loader2, Navigation, Clock } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { STATES } from '../../lib/constants';


export default function BoothLocatorPage() {
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

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

            {/* Google Map */}
            <div className="rounded-xl overflow-hidden h-64 relative border border-blue-500/20">
              {isLoaded && booth.coordinates ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={booth.coordinates}
                  zoom={15}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                    ]
                  }}
                >
                  <Marker position={booth.coordinates} />
                </GoogleMap>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-slate-800">
                  <Loader2 className="animate-spin text-orange-400 mb-2" size={24} />
                  <p className="text-slate-400 text-sm">Loading map...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
