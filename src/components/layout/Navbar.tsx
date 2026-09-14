import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, EarbudModel } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';
import { Bluetooth, RefreshCw, AlertCircle, ChevronDown, X, Palette, Check, Download } from 'lucide-react';

interface NavbarProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  activeModel: EarbudModel;
  onSelectModel: (model: EarbudModel) => void;
  error: string | null;
  isStandalone?: boolean;
  onInstallApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  activeModel,
  onSelectModel,
  error,
  isStandalone = false,
  onInstallApp,
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

  const themeOptions: { id: AppTheme; label: string; dotBg: string }[] = [
    { id: 'nothing-dark', label: 'Nothing Dark', dotBg: 'bg-[#d71920]' },
    { id: 'pokemon-pokedex', label: 'Pokédex 8-Bit', dotBg: 'bg-[#8bac0f]' },
    { id: 'cyberpunk-neon', label: 'Cyberpunk Neon', dotBg: 'bg-[#00f0ff]' },
    { id: 'lofi-vibes', label: 'Lofi Vibes', dotBg: 'bg-[#e07a5f]' },
  ];

  return (
    <>
      {error && (
        <div className="bg-[#d71920]/15 border-b border-[#d71920]/30 px-4 py-2.5 flex items-center justify-center gap-3 transition-all">
          <AlertCircle size={15} className="text-[#d71920]" />
          <span className="text-xs font-mono text-[#d71920]">{error}</span>
        </div>
      )}
      
      <nav className="h-16 border-b border-[var(--border-dim)] bg-[var(--bg-app)]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
        {/* Brand & Model Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] shadow-[0_0_8px_var(--accent-color)]" />
            <span className="font-ndot text-xl tracking-widest text-[var(--text-main)]">NOTHING</span>
            <span className="font-ndot text-xs px-1.5 py-0.5 rounded border border-[var(--border-dim)] text-[var(--text-sub)]">
              EAR(OS)
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-dim)]" />
          
          <div className="relative" ref={modelRef}>
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--border-dim)] transition-colors group"
            >
              <span className="font-mono text-xs font-medium text-[var(--text-main)]">
                {activeModel.name}
              </span>
              <ChevronDown size={13} className={`text-[var(--text-sub)] transition-transform duration-200 ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {modelOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 max-h-80 overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-bright)] rounded-xl shadow-2xl z-50 p-1">
                {SUPPORTED_DEVICES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m);
                      setModelOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left flex items-center justify-between rounded-lg transition-colors ${
                      activeModel.id === m.id ? 'bg-[var(--border-dim)] text-[var(--text-main)]' : 'text-[var(--text-sub)] hover:bg-[var(--border-dim)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-medium">{m.name}</span>
                      <span className="text-[10px] font-mono opacity-50 uppercase">{m.codename}</span>
                    </div>
                    {activeModel.id === m.id && <Check size={14} className="text-[var(--accent-color)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              title="Change Theme"
              className={`p-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                themeOpen 
                  ? 'bg-[var(--border-dim)] border-[var(--border-bright)] text-[var(--text-main)]' 
                  : 'bg-transparent border-[var(--border-dim)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
              }`}
            >
              <Palette size={15} />
            </button>
            
            {themeOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-bright)] rounded-xl shadow-2xl z-50 p-1">
                {themeOptions.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id);
                      setThemeOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between rounded-lg transition-colors ${
                      theme === t.id ? 'bg-[var(--border-dim)] text-[var(--text-main)] font-medium' : 'text-[var(--text-sub)] hover:bg-[var(--border-dim)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${t.dotBg}`} />
                      <span className="font-mono text-xs">{t.label}</span>
                    </div>
                    {theme === t.id && <Check size={14} className="text-[var(--accent-color)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Install Desktop App Button (visible when browsing on web) */}
          {!isStandalone && onInstallApp && (
            <button
              onClick={onInstallApp}
              title="Install Ear (OS) as a Windows Desktop App"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent-color)]/40 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] transition-all font-mono text-xs font-semibold shadow-sm"
            >
              <Download size={13} />
              <span>INSTALL APP</span>
            </button>
          )}

          <div className="w-[1px] h-5 bg-[var(--border-dim)]" />

          {/* Connect Button */}
          <button
            onClick={isConnected ? onDisconnect : onConnect}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-mono text-xs uppercase tracking-wider disabled:opacity-50 ${
              isConnected
                ? 'bg-transparent border border-[var(--border-dim)] hover:border-red-500/50 text-[var(--text-sub)] hover:text-red-400'
                : 'bg-[var(--text-main)] text-[var(--bg-app)] hover:opacity-90 font-semibold shadow-lg'
            }`}
          >
            {isConnecting ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : isConnected ? (
              <>
                <X size={13} />
                <span>Disconnect</span>
              </>
            ) : (
              <>
                <Bluetooth size={13} />
                <span>Connect Buds</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
