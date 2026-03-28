'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <aside className="w-64 min-h-screen bg-[#1e293b] text-[#e2e8f0] flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-slate-600">
        <div className="flex items-center gap-3">
          <HardHat className="w-8 h-8 text-blue-400" weight="duotone" />
          <div>
            <h1 className="text-lg font-bold text-white">CCM v2.0</h1>
            <p className="text-xs text-slate-400">Capacity Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
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
    </aside>
  );
}
