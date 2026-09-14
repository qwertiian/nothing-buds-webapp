import React from 'react';
import { EarbudModel, EarbudState } from '../../models/types';
import { soundFx } from '../../services/audio/SoundSynthesizer';
import { Sparkles, Play, Shield, Battery, Gauge, Zap } from 'lucide-react';

interface PokemonCompanionProps {
  model: EarbudModel;
  state: EarbudState;
}

export const PokemonCompanion: React.FC<PokemonCompanionProps> = ({ model, state }) => {
  const handlePlayCry = () => {
    soundFx.playRetroBlip();
  };

  // SVG Pixel art mascot generator based on Pokemon name
  const renderPixelSprite = () => {
    return (
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-[#8bac0f] border-4 border-[#0f380f] rounded-lg shadow-inner overflow-hidden p-2">
        {/* Retro scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Pixel Sprite Graphic */}
        <div className="text-center z-10 flex flex-col items-center">
          <div className="font-ndot text-3xl sm:text-4xl text-[#0f380f] animate-bounce">
            👾
          </div>
          <span className="font-ndot text-[10px] sm:text-xs text-[#0f380f] font-bold mt-1 tracking-widest uppercase">
            {model.pokemonName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl border-2 border-[#8bac0f]/40 bg-gradient-to-b from-[#1b2f15] to-[#0c180a] flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      {/* Pokédex Scanlines */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8bac0f] shadow-[0_0_8px_#8bac0f] animate-pulse" />
          <h2 className="font-ndot text-xl text-[#8bac0f] tracking-wider uppercase">
            POKÉDEX ARCHIVE: NO. {model.pokemonDexNumber}
          </h2>
        </div>

        <button
          onClick={handlePlayCry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#8bac0f]/50 bg-[#8bac0f]/20 hover:bg-[#8bac0f]/30 text-xs font-mono text-[#8bac0f] transition shadow-sm"
        >
          <Play className="w-3 h-3 fill-[#8bac0f]" />
          <span>8-Bit Cry</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        {/* Left: Pixel Display */}
        <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-[#8bac0f]/30 bg-[#0f380f]/50">
          {renderPixelSprite()}
          <div className="flex items-center gap-1.5">
            {model.pokemonType.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#8bac0f]/40 bg-[#8bac0f]/20 text-[#8bac0f] uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Center: Pokédex Stats (Mapped from Earbud state) */}
        <div className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-[#8bac0f]/30 bg-[#0f380f]/50">
          <span className="text-xs font-mono text-[#8bac0f] font-bold uppercase tracking-wider">
            BATTLE SPECIFICATIONS
          </span>

          <div className="flex flex-col gap-2.5 text-xs font-mono text-neutral-300">
            {/* HP: Battery */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#8bac0f]">
                <Battery className="w-3.5 h-3.5" /> HP (BATTERY):
              </span>
              <span className="font-bold">{state.battery.left}% / 100%</span>
            </div>

            {/* ATK: Noise Cancellation */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#8bac0f]">
                <Shield className="w-3.5 h-3.5" /> NOISE SHIELD:
              </span>
              <span className="font-bold uppercase">
                {model.hasAnc ? `${model.maxAncDb} dB (${state.ancMode})` : 'PASSIVE SEAL'}
              </span>
            </div>

            {/* SPEED: Latency */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#8bac0f]">
                <Gauge className="w-3.5 h-3.5" /> LATENCY SPD:
              </span>
              <span className="font-bold">
                {state.lowLagMode ? 'TURBO (90ms)' : 'STANDARD (180ms)'}
              </span>
            </div>

            {/* ULTRA BASS */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#8bac0f]">
                <Zap className="w-3.5 h-3.5" /> SUB-BASS PWR:
              </span>
              <span className="font-bold">
                {state.ultraBass.enabled ? `LVL ${state.ultraBass.level} BASS` : 'OFF'}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#8bac0f]/70 border-t border-[#8bac0f]/20 pt-2">
            STATUS: ACTIVE COMPANION
          </div>
        </div>

        {/* Right: Nothing Engineering Trivia */}
        <div className="flex flex-col justify-between p-4 rounded-xl border border-[#8bac0f]/30 bg-[#0f380f]/50">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-[#8bac0f] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> SECRET CODENAME
            </span>
            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              {model.pokemonFunFact}
            </p>
          </div>

          <div className="text-[10px] font-mono text-neutral-400 bg-black/40 p-2 rounded border border-white/5 mt-2">
            Nothing internally uses Pokémon codenames for all their audio engineering projects!
          </div>
        </div>
      </div>
    </div>
  );
};
