'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  SquaresFour,
  Users,
  Buildings,
  CalendarBlank,
  Fire,
  ArrowsLeftRight,
  ClipboardText,
  HardHat,
  DeviceMobileCamera,
  List,
  X,
} from '@phosphor-icons/react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: SquaresFour },
  { href: '/workers', label: 'Pracovníci', icon: Users },
  { href: '/projects', label: 'Projekty', icon: Buildings },
  { href: '/calendar', label: 'Kalendář', icon: CalendarBlank },
  { href: '/heatmap', label: 'Heatmapa', icon: Fire },
  { href: '/migration', label: 'Migrace', icon: ArrowsLeftRight },
  { href: '/audit', label: 'Audit Log', icon: ClipboardText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Zavřít menu při navigaci
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Zamezit scrollu body při otevřeném menu
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardHat className="w-8 h-8 text-blue-400" weight="duotone" />
          <div>
            <h1 className="text-lg font-bold text-white">CCM v2.0</h1>
            <p className="text-xs text-slate-400">Capacity Manager</p>
          </div>
        </div>
        {/* Zavírací tlačítko – jen na mobilu */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" weight="bold" />
        </button>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-600">
        <Link
          href="/preview"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-3 text-sm transition-colors ${
            pathname === '/preview'
              ? 'bg-purple-600 text-white font-medium'
              : 'text-purple-300 hover:bg-purple-900/40 hover:text-white bg-purple-900/20 border border-purple-700/30'
          }`}
        >
          <DeviceMobileCamera className="w-5 h-5" weight={pathname === '/preview' ? 'fill' : 'duotone'} />
          Mobilní náhled
        </Link>
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            DK
          </div>
          <div>
            <p className="text-sm font-medium text-white">Dispečer Kovář</p>
            <p className="text-xs text-slate-400">Kapacitní manažer</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobilní horní lišta s hamburger tlačítkem */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1e293b] border-b border-slate-600 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
        >
          <List className="w-6 h-6" weight="bold" />
        </button>
        <HardHat className="w-6 h-6 text-blue-400" weight="duotone" />
        <span className="text-white font-bold text-sm">CCM v2.0</span>
        <span className="text-slate-400 text-xs hidden sm:inline">| {navItems.find((i) => i.href === pathname)?.label || 'Náhled'}</span>
      </div>

      {/* Spacer pro mobilní lištu – posune obsah pod fixed header */}
      <div className="lg:hidden h-14 flex-shrink-0" />

      {/* Desktop sidebar – vždy viditelný */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#1e293b] text-[#e2e8f0] flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobilní overlay sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay pozadí */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <aside className="relative w-72 max-w-[85vw] bg-[#1e293b] text-[#e2e8f0] flex flex-col h-full shadow-2xl animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
