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
  { id: 'anc_cycle', label: 'Noise Control Toggle' },
  { id: 'none', label: 'None (Disabled)' },
];

export const GestureStudio: React.FC<GestureStudioProps> = ({
  gestures,
  onSetGesture,
  model,
}) => {
  const [selectedEar, setSelectedEar] = useState<'left' | 'right'>('left');

  const triggers: { id: keyof GestureConfig; label: string; desc: string }[] = [
    { id: 'singleTap', label: 'Single Tap / Pinch', desc: 'Default action when single tapped' },
    { id: 'doubleTap', label: 'Double Tap / Pinch', desc: 'Quick double tap on the stem' },
    { id: 'tripleTap', label: 'Triple Tap / Pinch', desc: 'Rapid triple tap sequence' },
    { id: 'tapAndHold', label: 'Tap & Hold / Pinch & Hold', desc: 'Press and hold down stem sensor' },
    { id: 'doubleTapAndHold', label: 'Double Tap & Hold', desc: 'Double tap with prolonged hold' },
  ];

  const currentConfig = gestures[selectedEar];

  return (
    <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#121212] flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="glyph-dot" />
          <h2 className="font-ndot text-xl text-white tracking-wider uppercase">GESTURES & CONTROLS</h2>
        </div>

        {/* Ear Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-black/40">
          <button
            onClick={() => setSelectedEar('left')}
            className={`px-4 py-1.5 text-xs font-mono rounded-lg transition ${
              selectedEar === 'left' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Left Bud
          </button>
          <button
            onClick={() => setSelectedEar('right')}
            className={`px-4 py-1.5 text-xs font-mono rounded-lg transition ${
              selectedEar === 'right' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Right Bud
          </button>
        </div>
      </div>

      {/* Controls List */}
      <div className="flex flex-col gap-3">
        {triggers.map((trigger) => (
          <div
            key={trigger.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-white/5 bg-[#171717] hover:border-white/10 transition"
          >
            <div className="flex flex-col">
              <span className="text-xs font-mono text-white font-medium">
                {trigger.label}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {trigger.desc}
              </span>
            </div>

            <select
              value={currentConfig[trigger.id]}
              onChange={(e) => onSetGesture(selectedEar, trigger.id, e.target.value as GestureAction)}
              className="bg-black/60 text-xs font-mono text-neutral-200 border border-white/15 rounded-lg px-3 py-1.5 focus:outline-none focus:border-nothing-red transition cursor-pointer self-start sm:self-auto"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
