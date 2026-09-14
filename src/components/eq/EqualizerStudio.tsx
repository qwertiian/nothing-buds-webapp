import React, { useState } from 'react';
import { EqPreset, CustomEqSettings, EarbudModel } from '../../models/types';
import { soundFx } from '../../services/audio/SoundSynthesizer';
import { Play, Zap } from 'lucide-react';

interface EqualizerStudioProps {
  eqPreset: EqPreset;
  onSetEqPreset: (preset: EqPreset) => void;
  customEq: CustomEqSettings;
  onSetCustomEq: (eq: CustomEqSettings) => void;
  ultraBass: { enabled: boolean; level: number };
  onSetUltraBass: (enabled: boolean, level?: number) => void;
  model: EarbudModel;
}

export const EqualizerStudio: React.FC<EqualizerStudioProps> = ({
  eqPreset,
  onSetEqPreset,
  customEq,
  onSetCustomEq,
  ultraBass,
  onSetUltraBass,
  model,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom' | 'ultrabass'>('preset');

  const presets: { id: EqPreset; label: string; desc: string }[] = [
    { id: 'balanced', label: 'Balanced', desc: 'Default studio tuning for all music genres' },
    { id: 'bass', label: 'More Bass', desc: 'Enhanced sub-bass and kick drums (+4dB)' },
    { id: 'treble', label: 'More Treble', desc: 'Crisp acoustic highs and shimmering vocals' },
    { id: 'voice', label: 'Voice', desc: 'Accentuates dialogue, podcasts, and vocals' },
  ];

  const handleSliderChange = (band: 'bass' | 'mid' | 'treble', value: number) => {
    onSetCustomEq({
      ...customEq,
      [band]: value,
    });
  };

  const handleAudition = () => {
    soundFx.playEqPreview(customEq.bass, customEq.mid, customEq.treble);
  };

  const width = 300;
  const height = 90;
  const midY = height / 2;
  const bassY = midY - (customEq.bass * 5);
  const midBandY = midY - (customEq.mid * 5);
  const trebleY = midY - (customEq.treble * 5);
  const pathD = `M 10,${midY} C 40,${bassY} 80,${bassY} 150,${midBandY} C 220,${trebleY} 260,${trebleY} 290,${midY}`;

  return (
    <div className="p-5 sm:p-7 rounded-2xl theme-card flex flex-col gap-6 shadow-xl transition-colors duration-300">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="glyph-dot" />
          <h2 className="font-ndot text-xl text-[var(--text-main)] tracking-wider uppercase">EQUALIZER</h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'preset' ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => {
              setActiveTab('custom');
              onSetEqPreset('custom');
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === 'custom' ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Custom 3-Band
          </button>
          {model.hasUltraBass && (
            <button
              onClick={() => setActiveTab('ultrabass')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
                activeTab === 'ultrabass' ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              Ultra Bass
            </button>
          )}
        </div>
      </div>

      {/* Preset View */}
      {activeTab === 'preset' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSetEqPreset(p.id)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition ${
                eqPreset === p.id
                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--text-main)] font-semibold'
                  : 'border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs uppercase tracking-wider">{p.label}</span>
                {eqPreset === p.id && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />}
              </div>
              <p className="text-[10px] font-mono opacity-60 line-clamp-2">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Custom 3-Band View */}
      {activeTab === 'custom' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          {/* Live Frequency Curve Visualizer */}
          <div className="w-full h-24 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/70 p-2 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
              <line x1="0" y1={midY} x2={width} y2={midY} stroke="currentColor" strokeDasharray="3,3" className="text-[var(--border-dim)]" />
              <path d={pathD} fill="transparent" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-sub)]">
              <span className="text-[var(--accent-color)]">●</span> REAL-TIME CURVE
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {(['bass', 'mid', 'treble'] as const).map((band) => (
              <div key={band} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
                <div className="flex items-center justify-between w-full text-xs font-mono text-[var(--text-sub)]">
                  <span className="uppercase font-semibold text-[var(--text-main)]">{band}</span>
                  <span className="text-[var(--accent-color)] font-mono font-bold">
                    {customEq[band] > 0 ? `+${customEq[band]}` : customEq[band]} dB
                  </span>
                </div>

                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={customEq[band]}
                  onChange={(e) => handleSliderChange(band, parseInt(e.target.value, 10))}
                  className="w-full"
                />

                <div className="flex justify-between w-full text-[9px] font-mono text-[var(--text-dim)]">
                  <span>-6dB</span>
                  <span>0dB</span>
                  <span>+6dB</span>
                </div>
              </div>
            ))}
          </div>

          {/* Audition Button */}
          <button
            onClick={handleAudition}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-dim)] hover:border-[var(--border-bright)] bg-[var(--bg-surface-elevated)] text-xs font-mono text-[var(--text-main)] transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Audition Sound Profile (Preview Tone)</span>
          </button>
        </div>
      )}

      {/* Ultra Bass View */}
      {activeTab === 'ultrabass' && model.hasUltraBass && (
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--accent-color)]" />
                <span className="text-sm font-mono text-[var(--text-main)] font-medium uppercase">
                  Ultra Bass Technology
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--text-sub)] mt-1">
                Dynamic low-frequency enhancement algorithm for deeper sub-bass impact
              </span>
            </div>

            <button
              onClick={() => onSetUltraBass(!ultraBass.enabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                ultraBass.enabled ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-bright)]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  ultraBass.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {ultraBass.enabled && (
            <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border-dim)]">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-sub)]">
                <span>ENHANCEMENT LEVEL</span>
                <span className="text-[var(--accent-color)] font-bold font-mono">LEVEL {ultraBass.level}</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetUltraBass(true, lvl)}
                    className={`py-2 text-center text-xs font-mono rounded-lg border transition ${
                      ultraBass.level === lvl
                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20 text-[var(--text-main)] font-bold'
                        : 'border-[var(--border-dim)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
