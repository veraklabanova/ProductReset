'use client';

import { useState } from 'react';
import {
  SquaresFour,
  Users,
  Buildings,
  CalendarBlank,
  Fire,
  ArrowsLeftRight,
  ClipboardText,
  DeviceMobileCamera,
  Desktop,
  ArrowsOut,
  BatteryFull,
  WifiHigh,
  CellSignalFull,
} from '@phosphor-icons/react';

const screens = [
  { path: '/', label: 'Dashboard', icon: SquaresFour },
  { path: '/workers', label: 'Pracovníci', icon: Users },
  { path: '/projects', label: 'Projekty', icon: Buildings },
  { path: '/calendar', label: 'Kalendář', icon: CalendarBlank },
  { path: '/heatmap', label: 'Heatmapa', icon: Fire },
  { path: '/migration', label: 'Migrace', icon: ArrowsLeftRight },
  { path: '/audit', label: 'Audit Log', icon: ClipboardText },
];

type DeviceType = 'iphone' | 'ipad' | 'desktop';

const devices: { type: DeviceType; label: string; icon: typeof DeviceMobileCamera; width: number; height: number }[] = [
  { type: 'iphone', label: 'iPhone 15 Pro', icon: DeviceMobileCamera, width: 393, height: 852 },
  { type: 'ipad', label: 'iPad Air', icon: DeviceMobileCamera, width: 820, height: 1180 },
  { type: 'desktop', label: 'Desktop', icon: Desktop, width: 1280, height: 800 },
];

export default function PreviewPage() {
  const [activeScreen, setActiveScreen] = useState('/');
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const device = devices.find((d) => d.type === activeDevice)!;
  const iframeSrc = `${activeScreen}?embed=1`;

  // Scale factor to fit the device on screen
  const maxHeight = isFullscreen ? 90 : 75; // vh
  const scale = activeDevice === 'desktop' ? 0.65 : activeDevice === 'ipad' ? 0.55 : 0.7;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Horní panel */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <DeviceMobileCamera className="w-6 h-6 text-blue-400" weight="duotone" />
                Mobilní náhled
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">Interaktivní prezentace CCM v2.0 na mobilních zařízeních</p>
            </div>

            {/* Přepínač zařízení */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
              {devices.map((d) => (
                <button
                  key={d.type}
                  onClick={() => setActiveDevice(d.type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDevice === d.type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <d.icon className="w-4 h-4" weight={activeDevice === d.type ? 'fill' : 'regular'} />
                  {d.label}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-700 mx-1" />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                title={isFullscreen ? 'Zmenšit' : 'Zvětšit'}
              >
                <ArrowsOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigace obrazovek */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {screens.map((screen) => (
              <button
                key={screen.path}
                onClick={() => setActiveScreen(screen.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeScreen === screen.path
                    ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <screen.icon className="w-4 h-4" weight={activeScreen === screen.path ? 'fill' : 'regular'} />
                {screen.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zařízení s iframe */}
      <div className="flex items-center justify-center py-8 px-4">
        <div
          className="relative transition-all duration-500 ease-out"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* iPhone / iPad rámeček */}
          {activeDevice !== 'desktop' ? (
            <div
              className="relative bg-slate-950 rounded-[3rem] shadow-2xl shadow-black/50 border border-slate-700/30"
              style={{
                width: device.width + 24,
                height: device.height + 24,
                padding: '12px',
              }}
            >
              {/* Notch (pouze iPhone) */}
              {activeDevice === 'iphone' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                  <div className="bg-slate-950 rounded-b-3xl px-6 pt-0 pb-1" style={{ width: 160, height: 34 }}>
                    <div className="w-20 h-5 bg-slate-950 rounded-full mx-auto mt-2 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
                    </div>
                  </div>
                </div>
              )}

              {/* Stavový řádek */}
              <div className="absolute top-3 left-0 right-0 z-20 px-10 py-2 flex items-center justify-between text-white text-xs font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <CellSignalFull className="w-4 h-4" weight="fill" />
                  <WifiHigh className="w-4 h-4" weight="fill" />
                  <BatteryFull className="w-5 h-5" weight="fill" />
                </div>
              </div>

              {/* Obrazovka */}
              <div
                className="bg-white rounded-[2.4rem] overflow-hidden relative"
                style={{ width: device.width, height: device.height }}
              >
                <iframe
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  style={{ width: device.width, height: device.height }}
                  title="Mobilní náhled CCM v2.0"
                />
              </div>

              {/* Spodní indikátor (home bar) */}
              {activeDevice === 'iphone' && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                  <div className="w-32 h-1 bg-slate-600 rounded-full" />
                </div>
              )}
            </div>
          ) : (
            /* Desktop rámeček */
            <div className="relative">
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/30">
                {/* Titulkový řádek prohlížeče */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-lg px-4 py-1 text-xs text-slate-400 text-center">
                    ccm-v2.vercel.app{activeScreen}
                  </div>
                </div>
                {/* Obrazovka */}
                <div style={{ width: device.width, height: device.height }}>
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full border-0"
                    title="Desktop náhled CCM v2.0"
                  />
                </div>
              </div>
              {/* Podstavec monitoru */}
              <div className="flex justify-center mt-0">
                <div className="w-24 h-8 bg-slate-700 rounded-b-lg" />
              </div>
              <div className="flex justify-center -mt-1">
                <div className="w-40 h-2 bg-slate-700 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informační panel */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{device.width} &times; {device.height}</p>
              <p className="text-sm text-slate-400 mt-1">Rozlišení (px)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{screens.length}</p>
              <p className="text-sm text-slate-400 mt-1">Dostupných obrazovek</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">Živý náhled</p>
              <p className="text-sm text-slate-400 mt-1">Plně interaktivní iframe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
