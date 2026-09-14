import React from 'react';
import { Bluetooth, RefreshCw, AlertCircle, Laptop, Radio, CheckCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#141414] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Background Subtle Radar Effect */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none animate-ping-slow" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-nothing-red animate-pulse" />
            <h3 className="font-ndot text-xl text-white tracking-wider">PAIR & CONNECT</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-2.5 z-10">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="flex flex-col gap-4 z-10">
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-black/40">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-mono text-white">
              1
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-white font-medium">Pair with your PC first</span>
              <span className="text-[11px] font-mono text-neutral-400 mt-0.5">
                Ensure your Nothing or CMF earbuds are paired via your Windows / macOS / Linux Bluetooth settings.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-black/40">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-mono text-white">
              2
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-white font-medium">Allow Serial Access</span>
              <span className="text-[11px] font-mono text-neutral-400 mt-0.5">
                Click &quot;Connect via Bluetooth&quot; below and select your paired earbuds from the browser prompt.
              </span>
            </div>
          </div>
        </div>

        {/* Browser compatibility check */}
        {!isBrowserSupported && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2 z-10">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your browser doesn&apos;t support the Web Serial API. Please use Google Chrome, Microsoft Edge, Brave, or Opera on Windows/Mac/Linux.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 z-10 pt-2 border-t border-white/10">
          <button
            onClick={onConnect}
            disabled={isConnecting || !isBrowserSupported}
            className="flex-1 py-3 px-4 rounded-xl bg-nothing-red hover:bg-nothing-redHover text-white font-mono font-medium text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,25,32,0.4)] transition disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Requesting Device...</span>
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4" />
                <span>Connect via Bluetooth</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onUseSimulator();
              onClose();
            }}
            className="py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs transition"
          >
            Use Simulator Mode
          </button>
        </div>
      </div>
    </div>
  );
};
