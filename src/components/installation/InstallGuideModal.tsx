import React from 'react';
import { Download, Monitor, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNativePrompt?: () => void;
  canPromptDirectly?: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onTriggerNativePrompt,
  canPromptDirectly = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl theme-card border border-white/10 shadow-2xl p-6 sm:p-7 flex flex-col gap-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-sub)] hover:text-white hover:bg-[var(--border-dim)] transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shrink-0">
            <Monitor size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-ndot text-lg text-[var(--text-main)] tracking-wider uppercase">
              INSTALL DESKTOP APP
            </span>
            <span className="text-xs font-mono text-[var(--text-sub)]">
              Run Ear (OS) as a native borderless Windows desktop app
            </span>
          </div>
        </div>

        {/* Why Install? */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/50 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-mono font-semibold text-[var(--text-main)]">📌 Taskbar Pin</span>
            <span className="text-[9px] font-mono text-[var(--text-sub)]">One-click launch from Windows taskbar</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-mono font-semibold text-[var(--text-main)]">⚡ Lower Latency</span>
            <span className="text-[9px] font-mono text-[var(--text-sub)]">Faster direct Bluetooth SPP response</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-mono font-semibold text-[var(--text-main)]">🖥️ No Browser Tabs</span>
            <span className="text-[9px] font-mono text-[var(--text-sub)]">Dedicated borderless app window</span>
          </div>
        </div>

        {/* 3-Step Guide */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
            <div className="w-6 h-6 rounded-full bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center font-bold text-[11px] shrink-0">
              1
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--text-main)]">Look at your browser address bar</span>
              <span className="text-[11px] text-[var(--text-sub)] mt-0.5">
                On Chrome or Edge, find the <strong>Install</strong> icon (computer screen with down arrow) next to the URL.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
            <div className="w-6 h-6 rounded-full bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center font-bold text-[11px] shrink-0">
              2
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--text-main)]">Click "Install Ear (OS)"</span>
              <span className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Or click browser menu <strong>⋮ → Save and share → Install Ear (OS)</strong>.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--text-main)]">Enjoy Native Desktop Experience</span>
              <span className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Ear (OS) will be added to your Windows Desktop and Start Menu automatically.
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {canPromptDirectly && onTriggerNativePrompt && (
            <button
              onClick={() => {
                onClose();
                onTriggerNativePrompt();
              }}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white hover:opacity-90 font-mono text-xs font-bold shadow-lg transition flex items-center gap-2"
            >
              <Download size={14} />
              <span>Prompt Install Now</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-dim)] text-[var(--text-main)] font-mono text-xs transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
