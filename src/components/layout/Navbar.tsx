import React from 'react';
import { Bluetooth, Sparkles, Sliders, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { AppTheme, EarbudModel } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';

interface NavbarProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  isSimulator: boolean;
  onToggleSimulator: (sim: boolean) => void;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  activeModel: EarbudModel;
  onSelectModel: (model: EarbudModel) => void;
  error: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  isSimulator,
  onToggleSimulator,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  activeModel,
  onSelectModel,
  error,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      {error && (
        <div className="bg-nothing-red/20 border-b border-nothing-red text-xs px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-nothing-red" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-nothing-red shadow-[0_0_10px_rgba(215,25,32,0.8)] animate-pulse" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-ndot text-lg sm:text-xl tracking-wider text-white">EAR</span>
              <span className="font-ndot text-xs px-1.5 py-0.5 rounded border border-white/20 text-neutral-400">
                (OS)
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-neutral-500">
              Desktop & Web Companion
            </span>
          </div>
        </div>

        {/* Model Selector Pill (When in simulator) */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">DEVICE:</span>
          <select
            value={activeModel.id}
            onChange={(e) => {
              const selected = SUPPORTED_DEVICES.find(d => d.id === e.target.value);
              if (selected) onSelectModel(selected);
            }}
            className="bg-[#171717] hover:bg-[#222] text-xs font-mono text-white border border-white/15 rounded-lg px-3 py-1.5 focus:outline-none focus:border-nothing-red transition cursor-pointer"
          >
            {SUPPORTED_DEVICES.map(dev => (
              <option key={dev.id} value={dev.id}>
                {dev.name} ({dev.codename.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Selector */}
          <div className="relative group">
            <button
              title="Change Theme"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#161616] hover:bg-[#202020] text-xs font-mono text-neutral-300 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-nothing-red" />
              <span className="hidden sm:inline capitalize">
                {theme === 'pokemon-pokedex' ? 'Pokédex 🎮' : theme.replace('-', ' ')}
              </span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-48 rounded-xl border border-white/10 bg-[#141414] shadow-2xl p-1.5 hidden group-hover:block z-50">
              <button
                onClick={() => onThemeChange('nothing-dark')}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded-lg transition flex items-center justify-between ${
                  theme === 'nothing-dark' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'
                }`}
              >
                <span>Nothing Dark (Default)</span>
                <span className="w-2 h-2 rounded-full bg-nothing-red" />
              </button>
              <button
                onClick={() => onThemeChange('pokemon-pokedex')}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded-lg transition flex items-center justify-between ${
                  theme === 'pokemon-pokedex' ? 'bg-pokedex-accent/40 text-[#9bbc0f]' : 'text-neutral-400 hover:bg-white/5'
                }`}
              >
                <span>Pokédex 8-Bit ⚡</span>
                <span className="w-2 h-2 rounded-full bg-[#8bac0f]" />
              </button>
              <button
                onClick={() => onThemeChange('cyberpunk-neon')}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded-lg transition flex items-center justify-between ${
                  theme === 'cyberpunk-neon' ? 'bg-cyan-500/20 text-cyan-300' : 'text-neutral-400 hover:bg-white/5'
                }`}
              >
                <span>Cyberpunk Neon</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </button>
              <button
                onClick={() => onThemeChange('lofi-vibes')}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded-lg transition flex items-center justify-between ${
                  theme === 'lofi-vibes' ? 'bg-purple-500/20 text-purple-300' : 'text-neutral-400 hover:bg-white/5'
                }`}
              >
                <span>Lofi Vibes 🎧</span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </button>
            </div>
          </div>

          {/* Simulator Toggle */}
          <button
            onClick={() => onToggleSimulator(!isSimulator)}
            title={isSimulator ? "Switch to Real Bluetooth Hardware" : "Switch to Virtual Earbuds Simulator"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
              isSimulator
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSimulator ? 'Sim Mode' : 'Hardware'}</span>
          </button>

          {/* Connect / Disconnect Bluetooth */}
          {isConnected && !isSimulator ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-xs font-mono text-red-300 transition"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-nothing-red hover:bg-nothing-redHover text-white text-xs font-mono font-medium shadow-[0_0_15px_rgba(215,25,32,0.4)] transition disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-3.5 h-3.5" />
                  <span>Connect Buds</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
