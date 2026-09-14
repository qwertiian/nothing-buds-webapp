import React, { useEffect } from 'react';
import { Bluetooth, RefreshCw, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface BluetoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
  detectedName?: string;
}

export const BluetoothModal: React.FC<BluetoothModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  error,
  detectedName,
}) => {
  // Automatically enable Windows Bluetooth radio when connect modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('/api/bluetooth/enable', { method: 'POST' }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBrowserSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl theme-card-elevated p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-dim)] pb-4 z-10">
          <div className="flex items-center gap-2.5">
            <span className="glyph-dot" />
            <h3 className="font-ndot text-xl text-[var(--text-main)] tracking-wider">CONNECT EARBUDS</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Detected Device Badge */}
        {detectedName && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2.5 z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Windows Paired: <strong>{detectedName}</strong> detected</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-2.5 z-10">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="flex flex-col gap-3 z-10">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/60">
            <div className="w-6 h-6 rounded-full bg-[var(--border-dim)] flex items-center justify-center shrink-0 text-xs font-mono text-[var(--text-main)] font-semibold">
              1
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">Automatic Bluetooth Activation</span>
              <span className="text-[11px] font-mono text-[var(--text-sub)] mt-0.5">
                Bluetooth radio is automatically activated on your PC. Ensure your Nothing or CMF earbuds are taken out of their case.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/60">
            <div className="w-6 h-6 rounded-full bg-[var(--border-dim)] flex items-center justify-center shrink-0 text-xs font-mono text-[var(--text-main)] font-semibold">
              2
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">Single-Click Permission</span>
              <span className="text-[11px] font-mono text-[var(--text-sub)] mt-0.5">
                Click &quot;Connect via Bluetooth&quot; below and select your earbuds to sync live battery, ANC & EQ.
              </span>
            </div>
          </div>
        </div>

        {/* Browser compatibility check */}
        {!isBrowserSupported && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2 z-10">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Your browser doesn&apos;t support the Web Serial API. Please use Google Chrome, Microsoft Edge, Brave, or Opera on Windows/Mac/Linux.
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 z-10 pt-2 border-t border-[var(--border-dim)]">
          <button
            onClick={onConnect}
            disabled={isConnecting || !isBrowserSupported}
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white font-mono font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Opening Bluetooth Port...</span>
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4" />
                <span>Connect via Bluetooth</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-[var(--border-dim)] hover:border-[var(--border-bright)] text-[var(--text-sub)] hover:text-[var(--text-main)] font-mono text-xs transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
