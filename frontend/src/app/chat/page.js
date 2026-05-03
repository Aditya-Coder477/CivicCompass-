'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import SourceBadge from '../../components/SourceBadge';
import { api } from '../../lib/api';
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';

const TOPICS = [
  { id: 'registration', label: 'How do I register to vote?', content: 'To register to vote in India, you need to be 18 or older and an Indian citizen. You can register online at voters.eci.gov.in by filling Form 6. You will need to provide your address proof, identity proof, and a recent photograph. Your name will be added to the electoral roll of your constituency after verification by the Electoral Registration Officer.' },
  { id: 'booth', label: 'How do I find my polling booth?', content: 'Your polling booth is assigned based on your registered address. You can find it by searching on voters.eci.gov.in using your EPIC number or name. The booth is typically the nearest government building, school, or community center to your registered address. Your voter slip will also mention the booth number and address.' },
  { id: 'id', label: 'What ID do I need to carry?', content: 'You can use any of the 12 documents approved by the Election Commission of India: Voter ID card (EPIC), Aadhaar card, Passport, Driving License, PAN card, MNREGA job card, Health insurance smart card issued by Labour Ministry, Pension document with photo, NPR smart card, bank or post office passbook with photo, service ID card issued by Central/State government, and smart card issued by RGI.' },
  { id: 'evm', label: 'How does the EVM work?', content: 'The Electronic Voting Machine has two units: the Control Unit operated by the Polling Officer, and the Balloting Unit in the voting compartment. When you are authorized to vote, you press the button next to your chosen candidate. The EVM records your vote and gives one beep. The VVPAT machine simultaneously prints a paper slip showing your selection for 7 seconds before it drops into a sealed box. Your vote is completely secret.' },
];

const STYLES = [
  { id: 'eli5', label: '👶 Explain Simply' },
  { id: 'summary', label: '⚡ 30-sec Summary' },
  { id: 'official', label: '📋 Official Steps' },
  { id: 'today', label: '📅 What to do Today' },
];

export default function ChatPage() {
  const [style, setStyle] = useState('summary');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await api.explain(topic.content, style, 'en');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <MessageCircle className="text-blue-400" /> Ask in Any Style
          </h1>
          <p className="text-slate-400">Select a topic and choose how you'd like it explained.</p>
        </div>

        {/* Style selector */}
        <div className="glass p-4 mb-6">
          <p className="text-sm font-medium text-slate-400 mb-3">Choose response style:</p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button key={s.id} id={`chat-style-${s.id}`} onClick={() => setStyle(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all`}
                style={style === s.id
                  ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93C5FD' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic cards */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-slate-400">Select a question:</p>
          {TOPICS.map(topic => (
            <button key={topic.id} id={`topic-${topic.id}`} onClick={() => handleAsk(topic)}
              className={`glass p-4 w-full text-left card-hover flex items-center justify-between gap-3 transition-all`}
              style={selectedTopic?.id === topic.id ? { borderColor: 'rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.06)' } : {}}>
              <span className="text-sm font-medium text-slate-200">{topic.label}</span>
              <Send size={14} className="text-slate-500 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Response */}
        {loading && (
          <div className="glass p-8 flex flex-col items-center gap-3 animate-fade-in">
            <Loader2 size={32} className="animate-spin text-blue-400" />
            <p className="text-slate-400 text-sm">Gemini is thinking...</p>
          </div>
        )}

        {error && <div className="glass p-4 text-red-300 text-sm flex items-center gap-2"><span>⚠️</span>{error}</div>}

        {result && !loading && (
          <div className="glass p-6 animate-slide-up" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                <span className="font-heading font-semibold text-blue-300 text-sm">Gemini Response</span>
              </div>
              <SourceBadge label={result.sourceBadge} icon="✨" />
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">{result.explanation}</p>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-slate-600" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <span>Style: <span className="text-slate-400">{style}</span></span>
              <span>·</span>
              <span>Language: <span className="text-slate-400">English</span></span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
