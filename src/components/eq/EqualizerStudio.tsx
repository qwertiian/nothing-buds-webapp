import React, { useState } from 'react';
import { EqPreset, CustomEqSettings, EarbudModel } from '../../models/types';
import { soundFx } from '../../services/audio/SoundSynthesizer';
import { Sliders, Music, Play, Zap } from 'lucide-react';

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
    { id: 'balanced', label: 'Balanced', desc: 'Default studio tuning' },
    { id: 'bass', label: 'More Bass', desc: 'Enhanced sub-bass' },
    { id: 'treble', label: 'More Treble', desc: 'Crisp acoustic highs' },
    { id: 'voice', label: 'Voice', desc: 'Accentuates dialogue' },
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

  // Generate SVG curve points for 3-band EQ
  const width = 300;
  const height = 100;
  const midY = height / 2;
  const bassY = midY - (customEq.bass * 6);
  const midBandY = midY - (customEq.mid * 6);
  const trebleY = midY - (customEq.treble * 6);
  const pathD = `M 0,${midY} C 40,${bassY} 80,${bassY} 150,${midBandY} C 220,${trebleY} 260,${trebleY} 300,${midY}`;

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-white/6 bg-[#111111] flex flex-col gap-8 shadow-none">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-nothing-red" />
          <h2 className="font-ndot text-2xl text-white tracking-widest uppercase">EQUALIZER</h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/6 bg-[#161616] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 py-2 text-xs font-mono rounded-full transition-all duration-200 ${
              activeTab === 'preset' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            PRESETS
          </button>
          <button
            onClick={() => {
              setActiveTab('custom');
              onSetEqPreset('custom');
            }}
            className={`px-4 py-2 text-xs font-mono rounded-full transition-all duration-200 ${
              activeTab === 'custom' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            CUSTOM
          </button>
          {model.hasUltraBass && (
            <button
              onClick={() => setActiveTab('ultrabass')}
              className={`px-4 py-2 text-xs font-mono rounded-full transition-all duration-200 ${
                activeTab === 'ultrabass' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
              }`}
            >
              ULTRA BASS
            </button>
          )}
        </div>
      </div>

      {/* Preset View */}
      {activeTab === 'preset' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSetEqPreset(p.id)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all duration-200 ${
                eqPreset === p.id
                  ? 'border-nothing-red bg-[#161616] text-white'
                  : 'border-white/6 bg-transparent hover:bg-white/5 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-medium uppercase tracking-widest">{p.label}</span>
                {eqPreset === p.id && <span className="w-1.5 h-1.5 rounded-full bg-nothing-red shadow-[0_0_8px_rgba(215,25,32,0.5)]" />}
              </div>
              <p className="text-[10px] font-sans text-neutral-500">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Custom 3-Band View */}
      {activeTab === 'custom' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Live Frequency Curve Visualizer */}
          <div className="w-full h-32 rounded-2xl border border-white/6 bg-[#161616] p-4 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#d71920" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d71920" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Center Zero Line */}
              <line x1="0" y1={midY} x2={width} y2={midY} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
              {/* Frequency Curve Fill */}
              <path d={`${pathD} L 300,${height} L 0,${height} Z`} fill="url(#curveGradient)" />
              {/* Frequency Curve Line */}
              <path d={pathD} fill="transparent" stroke="#d71920" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" />
            </svg>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span className="text-nothing-red">●</span> LIVE
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-3 gap-4">
            {(['bass', 'mid', 'treble'] as const).map((band) => (
              <div key={band} className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-white/6 bg-[#161616]">
                <div className="flex items-center justify-between w-full text-xs font-mono">
                  <span className="uppercase text-neutral-400">{band}</span>
                  <span className="text-white">
                    {customEq[band] > 0 ? `+${customEq[band]}` : customEq[band]} dB
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={customEq[band]}
                  onChange={(e) => handleSliderChange(band, parseInt(e.target.value, 10))}
                  className="w-full accent-white cursor-pointer h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />

                <div className="flex justify-between w-full text-[9px] font-mono text-neutral-600">
                  <span>-6</span>
                  <span>0</span>
                  <span>+6</span>
                </div>
              </div>
            ))}
          </div>

          {/* Audition Button */}
          <button
            onClick={handleAudition}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/6 bg-[#161616] hover:bg-[#1a1a1a] text-xs font-mono text-white transition-all duration-200 w-full sm:w-auto self-end px-6"
          >
            <Play className="w-3.5 h-3.5" />
            <span>PLAY PREVIEW</span>
          </button>
        </div>
      )}

      {/* Ultra Bass View */}
      {activeTab === 'ultrabass' && model.hasUltraBass && (
        <div className="flex flex-col gap-6 p-6 rounded-2xl border border-white/6 bg-[#161616] animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-mono tracking-widest uppercase">
                  Ultra Bass
                </span>
              </div>
              <span className="text-xs font-sans text-neutral-500 mt-2">
                Dynamic low-frequency enhancement for deeper impact
              </span>
            </div>

            <button
              onClick={() => onSetUltraBass(!ultraBass.enabled)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative flex items-center p-1 ${
                ultraBass.enabled ? 'bg-white' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#111111] transition-transform duration-300 shadow-sm ${
                  ultraBass.enabled ? 'translate-x-6' : 'translate-x-0 bg-neutral-400'
                }`}
              />
            </button>
          </div>

          {ultraBass.enabled && (
            <div className="flex flex-col gap-4 pt-6 border-t border-white/6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">LEVEL</span>
                <span className="text-white">{ultraBass.level}</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetUltraBass(true, lvl)}
                    className={`py-3 text-center text-xs font-mono rounded-xl border transition-all duration-200 ${
                      ultraBass.level === lvl
                        ? 'border-white bg-white text-black'
                        : 'border-white/6 bg-transparent hover:bg-white/5 text-neutral-400'
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
