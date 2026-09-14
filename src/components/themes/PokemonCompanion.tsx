import React from 'react';
import { EarbudModel, EarbudState } from '../../models/types';
import { soundFx } from '../../services/audio/SoundSynthesizer';
import { Play, Shield, Battery, Gauge, Zap } from 'lucide-react';

interface PokemonCompanionProps {
  model: EarbudModel;
  state: EarbudState;
}

export const PokemonCompanion: React.FC<PokemonCompanionProps> = ({ model, state }) => {
  const handlePlayCry = () => {
    soundFx.playRetroBlip();
  };

  const avgBattery = Math.round((state.battery.left + state.battery.right) / 2);

  return (
    <div className="p-5 sm:p-7 rounded-2xl theme-card flex flex-col gap-6 shadow-xl transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="glyph-dot" />
          <h2 className="font-ndot text-xl text-[var(--text-main)] tracking-wider uppercase">
            POKÉDEX ARCHIVE: NO. {model.pokemonDexNumber}
          </h2>
        </div>

        <button
          onClick={handlePlayCry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-bright)] text-xs font-mono text-[var(--text-main)] transition"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>8-Bit Cry</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* LCD Screen Pixel Mascot */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-[var(--border-dim)] bg-[#0c150b] relative overflow-hidden group">
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          
          <div className="w-28 h-28 rounded-xl bg-gradient-to-b from-[#9bbc0f] to-[#76930d] border-4 border-[#0f380f] flex flex-col items-center justify-center shadow-inner relative transition-transform duration-300 group-hover:scale-105">
            <div className="font-ndot text-4xl text-[#0f380f] select-none">
              👾
            </div>
            <span className="font-ndot text-[10px] text-[#0f380f] font-bold mt-1 tracking-widest uppercase">
              {model.pokemonName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            {model.pokemonType.map(t => (
              <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-sub)] border border-[var(--border-dim)]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Status Telemetry */}
        <div className="md:col-span-2 flex flex-col justify-between gap-4 p-5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-sub)]">
              <div className="flex items-center gap-1.5">
                <Battery size={14} className="text-[var(--accent-color)]" />
                <span>ENERGY CORE (HP)</span>
              </div>
              <span className="font-bold text-[var(--text-main)]">{avgBattery}%</span>
            </div>
            {/* HP Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--bg-app)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] transition-all duration-500 rounded-full"
                style={{ width: `${avgBattery}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-app)]/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-sub)]">
                <Shield size={12} />
                <span>NOISE SHIELD</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-main)] uppercase mt-0.5">
                {state.ancMode}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-app)]/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-sub)]">
                <Gauge size={12} />
                <span>AUDIO TUNING</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-main)] uppercase mt-0.5">
                {state.eqPreset}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-app)]/50 flex flex-col col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-sub)]">
                <Zap size={12} />
                <span>SUB-BASS</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-main)] uppercase mt-0.5">
                {state.ultraBass.enabled ? `L${state.ultraBass.level}` : 'OFF'}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-[var(--text-sub)] border-t border-[var(--border-dim)] pt-3 leading-relaxed">
            <span className="text-[var(--accent-color)] mr-1">DATA:</span>
            {model.pokemonFunFact}
          </div>
        </div>
      </div>
    </div>
  );
};
