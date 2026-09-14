import React from 'react';
import { Bluetooth, ShieldCheck, Check, Sparkles, ArrowRight } from 'lucide-react';

interface FirstTimePermissionsModalProps {
  isOpen: boolean;
  onGrant: () => void;
  onDismiss: () => void;
}

export const FirstTimePermissionsModal: React.FC<FirstTimePermissionsModalProps> = ({
  isOpen,
  onGrant,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl theme-card-elevated p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden border border-[var(--border-bright)]">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="glyph-dot" />
            <span className="font-ndot text-xs tracking-widest text-[var(--text-sub)] uppercase">
              Initial Setup
            </span>
          </div>
          <h2 className="font-ndot text-2xl text-[var(--text-main)] tracking-wider">
            WELCOME TO EAR (OS)
          </h2>
          <p className="text-xs font-mono text-[var(--text-sub)] leading-relaxed">
            To control your Nothing and CMF earbuds on your PC, please grant the following permissions once. Your preferences are saved locally.
          </p>
        </div>

        {/* Permissions List */}
        <div className="flex flex-col gap-3 z-10">
          {/* Permission 1: Windows Bluetooth */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/70">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0">
              <Bluetooth size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[var(--text-main)]">
                  1. Bluetooth Device Detection
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                  REQUIRED
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-sub)] mt-0.5 leading-normal">
                Detects when your buds are opened or taken out of their case to automatically sync data.
              </span>
            </div>
          </div>

          {/* Permission 2: Hardware Control Channel */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/70">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[var(--text-main)]">
                  2. Audio Hardware Control
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                  REQUIRED
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-sub)] mt-0.5 leading-normal">
                Communicates with the earbud chip to read real-time battery percentages and toggle Noise Cancellation & Equalizers.
              </span>
            </div>
          </div>
        </div>

        {/* Feature summary */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-dim)] text-[10px] font-mono text-[var(--text-sub)] z-10">
          <div className="flex items-center gap-1.5">
            <Check size={12} className="text-emerald-400" />
            <span>Zero Third-Party Drivers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={12} className="text-emerald-400" />
            <span>100% Local Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={12} className="text-emerald-400" />
            <span>Official Nothing Protocol</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[var(--border-dim)] z-10">
          <button
            onClick={onGrant}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white font-mono font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <span>Grant Permissions & Connect</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={onDismiss}
            className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[var(--border-dim)] hover:border-[var(--border-bright)] text-[var(--text-sub)] hover:text-[var(--text-main)] font-mono text-xs transition"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

