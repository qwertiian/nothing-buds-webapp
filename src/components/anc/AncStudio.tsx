import React, { useState } from 'react';
import { AncMode, EarbudModel } from '../../models/types';
import { Volume2, VolumeX, Radio, Sparkles, CheckCircle2 } from 'lucide-react';

interface AncStudioProps {
  ancMode: AncMode;
  onSetAncMode: (mode: AncMode) => void;
  personalizedAnc: boolean;
  onSetPersonalizedAnc: (enabled: boolean) => void;
  model: EarbudModel;
  isConnected?: boolean;
  onRequestConnect?: () => void;
}

export const AncStudio: React.FC<AncStudioProps> = ({
  ancMode,
  onSetAncMode,
  personalizedAnc,
  onSetPersonalizedAnc,
  model,
  isConnected = false,
  onRequestConnect,
}) => {
  const [showFitTest, setShowFitTest] = useState(false);
  const [fitTestStep, setFitTestStep] = useState<'intro' | 'testing' | 'result'>('intro');
  const [lastAncLevel, setLastAncLevel] = useState<'high' | 'mid' | 'low' | 'adaptive'>('high');

  if (!model.hasAnc) {
    return (
      <div className="p-6 rounded-2xl theme-card flex flex-col items-center justify-center text-center">
        <VolumeX className="w-8 h-8 text-[var(--text-dim)] mb-2" />
        <h3 className="font-ndot text-lg text-[var(--text-main)]">NOISE CONTROL NOT SUPPORTED</h3>
        <p className="text-xs font-mono text-[var(--text-sub)] mt-1 max-w-sm">
          {model.name} features an open / half-in-ear acoustic design and does not feature active noise cancellation.
        </p>
      </div>
    );
  }

  const isAncActive = ancMode === 'high' || ancMode === 'mid' || ancMode === 'low' || ancMode === 'adaptive';

  const handleStartFitTest = () => {
    setFitTestStep('testing');
    setTimeout(() => {
      setFitTestStep('result');
    }, 2400);
  };

  return (
    <div className="p-5 sm:p-7 rounded-2xl theme-card flex flex-col gap-6 shadow-xl transition-colors duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="glyph-dot" />
          <h2 className="font-ndot text-xl text-[var(--text-main)] tracking-wider uppercase">NOISE CONTROL</h2>
          {isConnected ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HARDWARE SYNCED
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              OFFLINE
            </span>
          )}
        </div>
        {model.hasEarFitTest && (
          <button
            onClick={() => {
              setFitTestStep('intro');
              setShowFitTest(true);
            }}
            className="text-xs font-mono px-3 py-1 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-bright)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition"
          >
            Ear Tip Fit Test
          </button>
        )}
      </div>

      {/* Offline Hardware Prompt */}
      {!isConnected && (
        <div 
          onClick={onRequestConnect}
          className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-500/15 transition"
        >
          <div className="flex items-center gap-2.5 text-xs font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>Hardware control channel not synced. Click to sync {model.name} to control real earbud hardware.</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onRequestConnect?.(); }}
            className="px-3 py-1 text-[11px] font-mono font-bold bg-amber-500 text-black rounded-lg hover:opacity-90 shrink-0"
          >
            Sync Now
          </button>
        </div>
      )}

      {/* Main 3 Modes: Noise Cancellation, Transparency, Off */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/50">
        {/* Noise Cancellation */}
        <button
          onClick={() => onSetAncMode(lastAncLevel)}
          className={`flex flex-col items-center gap-2 py-4 px-2 rounded-lg transition-all ${
            isAncActive
              ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold shadow-lg'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <VolumeX className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase text-center">
            Cancellation
          </span>
        </button>

        {/* Transparency */}
        <button
          onClick={() => onSetAncMode('transparency')}
          className={`flex flex-col items-center gap-2 py-4 px-2 rounded-lg transition-all ${
            ancMode === 'transparency'
              ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold shadow-lg'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase text-center">
            Transparency
          </span>
        </button>

        {/* Off */}
        <button
          onClick={() => onSetAncMode('off')}
          className={`flex flex-col items-center gap-2 py-4 px-2 rounded-lg transition-all ${
            ancMode === 'off'
              ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold shadow-lg'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--border-dim)]'
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase text-center">
            Off
          </span>
        </button>
      </div>

      {/* ANC Intensity Sub-Selector (Visible when Cancellation is active) */}
      {isAncActive && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-sub)]">
            <span>INTENSITY LEVEL</span>
            <span className="text-[var(--accent-color)] uppercase font-bold">{ancMode}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['high', 'mid', 'low', 'adaptive'] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setLastAncLevel(level);
                  onSetAncMode(level);
                }}
                className={`py-2 px-1 text-center text-xs font-mono rounded-lg border transition ${
                  ancMode === level
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/15 text-[var(--text-main)] font-semibold'
                    : 'border-[var(--border-dim)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Personalized ANC Toggle */}
      {model.hasPersonalizedAnc && isAncActive && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-mono text-[var(--text-main)] font-medium uppercase">
                Personalized ANC
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-sub)] mt-0.5">
              Adapts cancellation curve to your ear canal geometry in real time
            </span>
          </div>

          <button
            onClick={() => onSetPersonalizedAnc(!personalizedAnc)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              personalizedAnc ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-bright)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                personalizedAnc ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}

      {/* Ear Tip Fit Test Modal */}
      {showFitTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl theme-card-elevated p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[var(--border-dim)] pb-3">
              <h3 className="font-ndot text-lg text-[var(--text-main)]">EAR TIP FIT TEST</h3>
              <button
                onClick={() => setShowFitTest(false)}
                className="text-[var(--text-sub)] hover:text-[var(--text-main)] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {fitTestStep === 'intro' && (
              <div className="flex flex-col items-center text-center gap-4 py-3">
                <img
                  src="/assets/ear_stick_test_introduce.webp"
                  alt="Fit Test"
                  className="w-36 h-36 object-contain opacity-90"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <p className="text-xs font-mono text-[var(--text-sub)]">
                  Place both earbuds securely in your ears and stay in a quiet environment. A calibration chime will test acoustic seal.
                </p>
                <button
                  onClick={handleStartFitTest}
                  className="w-full py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-app)] font-mono font-medium text-xs hover:opacity-90 transition"
                >
                  START TEST
                </button>
              </div>
            )}

            {fitTestStep === 'testing' && (
              <div className="flex flex-col items-center text-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
                <span className="font-ndot text-sm tracking-wider text-[var(--text-main)]">
                  ANALYZING ACOUSTIC SEAL...
                </span>
                <span className="text-xs font-mono text-[var(--text-sub)]">
                  Measuring internal ear canal reflection
                </span>
              </div>
            )}

            {fitTestStep === 'result' && (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-around p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-300">LEFT: GOOD SEAL</span>
                  </div>
                  <div className="w-px h-10 bg-[var(--border-dim)]" />
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-300">RIGHT: GOOD SEAL</span>
                  </div>
                </div>
                <p className="text-xs font-mono text-[var(--text-sub)] text-center">
                  Your ear tips are creating an optimal seal for maximum noise cancellation and rich bass response.
                </p>
                <button
                  onClick={() => setShowFitTest(false)}
                  className="w-full py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-mono font-medium text-xs hover:opacity-90 transition"
                >
                  DONE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
