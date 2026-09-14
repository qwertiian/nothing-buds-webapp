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

  // HP bar color calculation based on battery percentage
  const getHpBarColor = (percentage: number) => {
    if (percentage > 50) return 'bg-[#8bac0f] shadow-[0_0_8px_rgba(139,172,15,0.4)]';
    if (percentage > 20) return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    return 'bg-[#d71920] shadow-[0_0_8px_rgba(215,25,32,0.4)]';
  };

  // Refined retro LCD screen with depth and subtle scale hover
  const renderPixelSprite = () => {
    return (
      <div className="group flex flex-col items-center justify-center p-3 rounded-xl bg-[#0c150b] border border-[#1e331b] shadow-inner">
        <div className="relative w-32 h-32 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#9bbc0f] via-[#8bac0f] to-[#76930d] border-2 border-[#0f380f]/50 shadow-[inset_0_2px_8px_rgba(15,56,15,0.45),0_2px_4px_rgba(0,0,0,0.3)] overflow-hidden cursor-default transition-all duration-300">
          {/* Refined subtle scanline overlay */}
          <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />

          {/* Glare and LCD glass depth highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

          {/* Pixel Sprite Graphic with subtle scale hover effect */}
          <div className="relative z-10 text-center flex flex-col items-center select-none">
            <div className="text-4xl sm:text-5xl text-[#0f380f] drop-shadow-[0_2px_1px_rgba(15,56,15,0.3)] transition-transform duration-300 ease-out group-hover:scale-110">
              👾
            </div>
            <span className="font-ndot text-[11px] sm:text-xs text-[#0f380f] font-bold mt-1.5 tracking-widest uppercase drop-shadow-[0_1px_0_rgba(155,188,15,0.6)]">
              {model.pokemonName}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl border border-white/6 bg-[#111111] flex flex-col gap-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Subtle ambient Pokédex scanline overlay with reduced opacity */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />

      {/* Subtle green ambient accent glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#8bac0f]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Pokédex Number & Codename */}
      <div className="flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#8bac0f] shadow-[0_0_8px_#8bac0f] animate-pulse" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-ndot text-lg sm:text-xl text-white tracking-wider uppercase">
                POKÉDEX NO. {String(model.pokemonDexNumber).padStart(3, '0')}
              </h2>
              <span className="hidden sm:inline text-neutral-600 font-mono text-xs">/</span>
              <span className="text-xs font-mono text-neutral-400">
                CODENAME: <span className="text-[#8bac0f] font-semibold">{model.codename.toUpperCase()}</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">
              RETRO HARDWARE ARCHIVE
            </span>
          </div>
        </div>

        {/* Play Cry Button */}
        <button
          type="button"
          onClick={handlePlayCry}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/6 bg-[#161616] hover:bg-[#1a1a1a] hover:border-[#8bac0f]/40 text-xs font-mono text-neutral-300 hover:text-[#8bac0f] transition-all duration-200 active:scale-95 shadow-sm"
          title="Play 8-Bit Cry Sound"
        >
          <Play className="w-3 h-3 fill-[#8bac0f] text-[#8bac0f] transition-transform duration-200" />
          <span className="font-medium">8-Bit Cry</span>
        </button>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 z-10">
        {/* Left: Pixel Display & Types */}
        <div className="flex flex-col items-center justify-between gap-4 p-5 rounded-xl border border-white/6 bg-[#161616]">
          <div className="w-full flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              SPECIES DISPLAY
            </span>
            <span className="text-[10px] font-mono text-[#8bac0f] bg-[#8bac0f]/10 border border-[#8bac0f]/20 px-1.5 py-0.5 rounded">
              LCD v1.0
            </span>
          </div>

          {renderPixelSprite()}

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {model.pokemonType.map((type) => (
              <span
                key={type}
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#8bac0f]/30 bg-[#8bac0f]/10 text-[#8bac0f] uppercase tracking-wider font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Center: Pokédex Stats (Mapped from Earbud state) */}
        <div className="flex flex-col justify-between gap-4 p-5 rounded-xl border border-white/6 bg-[#161616]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8bac0f] font-semibold uppercase tracking-wider">
              BATTLE SPECIFICATIONS
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="flex flex-col gap-3 text-xs font-mono">
            {/* HP: Battery Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Battery className="w-3.5 h-3.5 text-[#8bac0f]" /> HP (BATTERY):
                </span>
                <span className="font-semibold text-neutral-200">
                  {state.battery.left}% <span className="text-neutral-500">/ 100%</span>
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden p-0.5 border border-white/6">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getHpBarColor(
                    state.battery.left
                  )}`}
                  style={{ width: `${Math.min(100, Math.max(0, state.battery.left))}%` }}
                />
              </div>
            </div>

            {/* Noise Shield (ANC Mode) */}
            <div className="flex items-center justify-between pt-1 border-t border-white/6">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-[#8bac0f]" /> NOISE SHIELD:
              </span>
              <span className="font-semibold text-neutral-200 uppercase">
                {model.hasAnc ? `${state.ancMode} (${model.maxAncDb ?? 45} dB)` : 'PASSIVE SEAL'}
              </span>
            </div>

            {/* EQ Preset */}
            <div className="flex items-center justify-between pt-1 border-t border-white/6">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Gauge className="w-3.5 h-3.5 text-[#8bac0f]" /> EQ PRESET:
              </span>
              <span className="font-semibold text-neutral-200 uppercase">
                {state.eqPreset}
              </span>
            </div>

            {/* Ultra Bass Power */}
            <div className="flex items-center justify-between pt-1 border-t border-white/6">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Zap className="w-3.5 h-3.5 text-[#8bac0f]" /> SUB-BASS PWR:
              </span>
              <span className="font-semibold text-neutral-200 uppercase">
                {state.ultraBass.enabled ? `LVL ${state.ultraBass.level} BASS` : 'OFF'}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-neutral-400 border-t border-white/6 pt-2.5 flex items-center justify-between">
            <span className="text-[#8bac0f] font-medium">STATUS: ACTIVE COMPANION</span>
            <span className="text-neutral-500">
              {state.lowLagMode ? 'TURBO 90MS' : 'STD 180MS'}
            </span>
          </div>
        </div>

        {/* Right: Engineering Trivia & Lore */}
        <div className="flex flex-col justify-between gap-4 p-5 rounded-xl border border-white/6 bg-[#161616]">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono text-[#8bac0f] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8bac0f]" /> SECRET CODENAME
            </span>
            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              {model.pokemonFunFact}
            </p>
          </div>

          <div className="text-[10px] font-mono text-neutral-400 bg-black/30 p-3 rounded-lg border border-white/6">
            <span className="text-[#8bac0f] font-medium block mb-1">DESIGN LORE</span>
            Nothing internally uses Pokémon codenames for all their audio engineering projects!
          </div>
        </div>
      </div>
    </div>
  );
};
