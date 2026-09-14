import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, EarbudModel } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';
import { Bluetooth, Sparkles, Sliders, RefreshCw, AlertCircle, Zap, ChevronDown, X, Palette, Check } from 'lucide-react';

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
  error
}) => {
  const [themeOpen, setThemeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  
  const themeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setModelOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { id: AppTheme; label: string; dotColor: string }[] = [
    { id: 'nothing-dark', label: 'Nothing Dark', dotColor: 'bg-[#d71920]' },
    { id: 'pokemon-pokedex', label: 'Pokédex 8-Bit', dotColor: 'bg-[#8bac0f]' },
    { id: 'cyberpunk-neon', label: 'Cyberpunk Neon', dotColor: 'bg-[#00f0ff]' },
    { id: 'lofi-vibes', label: 'Lofi Vibes', dotColor: 'bg-[#c4a882]' },
  ];

  return (
    <>
      {error && (
        <div className="bg-[#d71920]/10 border-b border-[#d71920]/20 px-4 py-3 flex items-center justify-center gap-3">
          <AlertCircle size={16} className="text-[#d71920]" />
          <span className="text-sm font-mono text-[#d71920]">{error}</span>
        </div>
      )}
      
      <nav className="h-16 border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="font-ndot text-2xl tracking-widest text-white mt-1">NOTHING</div>
          <div className="h-4 w-[1px] bg-white/20" />
          
          <div className="relative" ref={modelRef}>
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <span className="font-mono text-sm text-white/80 group-hover:text-white transition-colors">
                {activeModel.name}
              </span>
              <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {modelOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {SUPPORTED_DEVICES.map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setModelOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs ${activeModel.id === model.id ? 'text-white font-semibold' : 'text-white/60'}`}>
                        {model.name}
                      </span>
                      <span className="text-[10px] font-mono text-white/30 uppercase">
                        {model.codename}
                      </span>
                    </div>
                    {activeModel.id === model.id && <Check size={14} className="text-[#d71920]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Simulator Toggle */}
          <button
            onClick={() => onToggleSimulator(!isSimulator)}
            title={isSimulator ? "Switch to real Bluetooth hardware" : "Switch to Virtual Simulator"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
              isSimulator 
                ? 'bg-[#d71920]/10 border-[#d71920]/20 text-[#d71920]' 
                : 'bg-transparent border-white/6 text-white/40 hover:bg-white/5 hover:text-white/70'
            }`}
          >
            <Sparkles size={14} />
            <span>Sim Mode</span>
          </button>

          {/* Theme Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              title="Change Theme"
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                themeOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/6 text-white/40 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <Palette size={16} />
            </button>
            
            {themeOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 p-1">
                {themeOptions.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id);
                      setThemeOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left flex items-center justify-between rounded-lg transition-colors ${
                      theme === t.id ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${t.dotColor}`} />
                      <span className="font-mono text-xs">{t.label}</span>
                    </div>
                    {theme === t.id && <Check size={14} className="text-[#d71920]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-6 bg-white/10 mx-1" />

          {/* Connect Button */}
          <button
            onClick={isConnected ? onDisconnect : onConnect}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-mono text-xs uppercase tracking-wider disabled:opacity-50 ${
              isConnected
                ? 'bg-white/10 text-white hover:bg-[#d71920]/20 hover:text-[#d71920] border border-white/10 hover:border-[#d71920]/30'
                : 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5'
            }`}
          >
            {isConnecting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : isConnected ? (
              <X size={14} />
            ) : (
              <Bluetooth size={14} />
            )}
            <span>{isConnecting ? 'Connecting' : isConnected ? 'Disconnect' : 'Connect'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
