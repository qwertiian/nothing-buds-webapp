import React, { useState } from 'react';
import { GestureConfig, GestureAction, EarbudModel } from '../../models/types';
import { MousePointerClick, Touchpad } from 'lucide-react';

interface GestureStudioProps {
  gestures: {
    left: GestureConfig;
    right: GestureConfig;
  };
  onSetGesture: (ear: 'left' | 'right', trigger: keyof GestureConfig, action: GestureAction) => void;
  model: EarbudModel;
}

const ACTION_OPTIONS: { id: GestureAction; label: string }[] = [
  { id: 'play_pause', label: 'Play / Pause' },
  { id: 'next_track', label: 'Next Track' },
  { id: 'previous_track', label: 'Previous Track' },
  { id: 'voice_assistant', label: 'Voice Assistant' },
  { id: 'volume_up', label: 'Volume Up' },
  { id: 'volume_down', label: 'Volume Down' },
  { id: 'anc_cycle', label: 'Noise Control' },
  { id: 'none', label: 'None' },
];

export const GestureStudio: React.FC<GestureStudioProps> = ({
  gestures,
  onSetGesture,
  model,
}) => {
  const [selectedEar, setSelectedEar] = useState<'left' | 'right'>('left');

  const triggers: { id: keyof GestureConfig; label: string; desc: string }[] = [
    { id: 'singleTap', label: 'Single Tap', desc: 'Quick press on the stem' },
    { id: 'doubleTap', label: 'Double Tap', desc: 'Two consecutive presses' },
    { id: 'tripleTap', label: 'Triple Tap', desc: 'Three consecutive presses' },
    { id: 'tapAndHold', label: 'Tap & Hold', desc: 'Press and hold' },
    { id: 'doubleTapAndHold', label: 'Double Tap & Hold', desc: 'Double tap, hold the second' },
  ];

  const currentConfig = gestures[selectedEar];

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-white/6 bg-[#111111] flex flex-col gap-8 shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-nothing-red" />
          <h2 className="font-ndot text-2xl text-white tracking-widest uppercase">GESTURES</h2>
        </div>

        {/* Ear Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/6 bg-[#161616]">
          <button
            onClick={() => setSelectedEar('left')}
            className={`px-6 py-2 text-xs font-mono rounded-full transition-all duration-200 ${
              selectedEar === 'left' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            LEFT
          </button>
          <button
            onClick={() => setSelectedEar('right')}
            className={`px-6 py-2 text-xs font-mono rounded-full transition-all duration-200 ${
              selectedEar === 'right' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            RIGHT
          </button>
        </div>
      </div>

      {/* Controls List */}
      <div className="flex flex-col gap-4">
        {triggers.map((trigger) => (
          <div
            key={trigger.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/6 bg-[#161616] hover:bg-[#1a1a1a] transition-all duration-200"
          >
            <div className="flex flex-col">
              <span className="text-xs font-mono text-white tracking-widest uppercase">
                {trigger.label}
              </span>
              <span className="text-[11px] font-sans text-neutral-500 mt-1">
                {trigger.desc}
              </span>
            </div>

            <div className="relative">
              <select
                value={currentConfig[trigger.id]}
                onChange={(e) => onSetGesture(selectedEar, trigger.id, e.target.value as GestureAction)}
                className="appearance-none bg-transparent text-xs font-mono text-white border border-white/10 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-white/30 transition-colors cursor-pointer w-full sm:w-48"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#1a1a1a] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <MousePointerClick className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
