import React from 'react';
import { Bluetooth, RefreshCw, AlertCircle, Laptop, Radio, CheckCircle, Wifi, X } from 'lucide-react';

interface BluetoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
  onUseSimulator: () => void;
}

export const BluetoothModal: React.FC<BluetoothModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  error,
  onUseSimulator,
}) => {
  if (!isOpen) return null;

  const isBrowserSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-300">
      <div className="w-full max-w-lg rounded-2xl border border-white/6 bg-[#111111] p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#d71920] shadow-[0_0_8px_rgba(215,25,32,0.6)]" />
            <h3 className="font-ndot text-2xl text-white tracking-widest uppercase">Connect Device</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-sm font-mono text-red-400 flex items-start gap-3 z-10 transition-all duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Browser compatibility check */}
        {!isBrowserSupported && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-sm font-mono text-amber-400 flex items-start gap-3 z-10 transition-all duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your browser doesn't support the Web Serial API. Please use Google Chrome, Microsoft Edge, Brave, or Opera on Windows/Mac/Linux.
            </span>
          </div>
        )}

        {/* Instructions */}
        <div className="flex flex-col gap-4 z-10">
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/6 bg-[#161616] transition-all duration-200 hover:border-white/10">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-sm font-mono text-neutral-300">
              1
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-mono text-neutral-200">Pair with your PC</span>
              <span className="text-xs font-sans text-neutral-500 mt-1 leading-relaxed">
                Ensure your Nothing or CMF earbuds are paired via your system's Bluetooth settings.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/6 bg-[#161616] transition-all duration-200 hover:border-white/10">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-sm font-mono text-neutral-300">
              2
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-mono text-neutral-200">Allow Access</span>
              <span className="text-xs font-sans text-neutral-500 mt-1 leading-relaxed">
                Click connect below and select your paired earbuds from the browser prompt.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-1 text-xs font-mono text-neutral-500">
             <CheckCircle className="w-3.5 h-3.5 text-[#d71920]/70" />
             <span>If previously paired, connection will be automatic.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 z-10 pt-2">
          <button
            onClick={onConnect}
            disabled={isConnecting || !isBrowserSupported}
            className="w-full h-12 rounded-xl bg-[#d71920] hover:bg-[#b01318] text-white font-mono text-sm flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#d71920]"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4" />
                <span>Connect Bluetooth</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onUseSimulator();
              onClose();
            }}
            className="w-full h-12 rounded-xl border border-white/6 bg-transparent hover:bg-white/5 text-neutral-400 font-mono text-sm transition-all duration-200"
          >
            Use Simulator Mode
          </button>
        </div>
      </div>
    </div>
  );
};
