'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Compass, Menu, X } from 'lucide-react';

/** Always-visible navigation links */
const NAV_PUBLIC = [
  { href: '/checklist',    label: 'Checklist' },
  { href: '/myths',        label: 'Myth vs Fact' },
  { href: '/booth-locator',label: 'Booth Locator' },
  { href: '/simulate',     label: 'Practice Voting' },
  { href: '/chat',         label: 'Assistant' },
];

/** Navigation links shown only after the user completes registration */
const NAV_REGISTERED = [
  { href: '/journey',  label: 'Journey' },
  { href: '/timeline', label: 'Timeline' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Re-check profile on every route change
  useEffect(() => {
    setIsRegistered(!!localStorage.getItem('civicProfile'));
  }, [pathname]);

  const NAV = isRegistered
    ? [...NAV_REGISTERED, ...NAV_PUBLIC]
    : NAV_PUBLIC;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'rgba(2,11,24,0.85)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="tricolor-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="CivicCompass home">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
            <Compass size={20} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-white">Civic</span>
            <span className="font-heading font-bold text-lg" style={{ color: '#F97316' }}>Compass</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === n.href ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              style={pathname === n.href ? { background: 'rgba(59,130,246,0.15)', color: '#93C5FD' } : {}}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="lg:hidden border-t px-4 py-3 space-y-1" style={{ background: 'rgba(2,11,24,0.95)', borderColor: 'rgba(255,255,255,0.07)' }}>
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === n.href ? 'page' : undefined}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === n.href ? 'text-blue-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              style={pathname === n.href ? { background: 'rgba(59,130,246,0.12)' } : {}}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
