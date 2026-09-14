import React, { useState } from 'react';
import { GestureConfig, GestureAction, EarbudModel } from '../../models/types';

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
    <div className="p-5 sm:p-7 rounded-2xl theme-card flex flex-col gap-6 shadow-xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="glyph-dot" />
          <h2 className="font-ndot text-xl text-[var(--text-main)] tracking-wider uppercase">GESTURES & CONTROLS</h2>
        </div>

        {/* Ear Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-app)]/60">
          <button
            onClick={() => setSelectedEar('left')}
            className={`px-4 py-1.5 text-xs font-mono rounded-lg transition ${
              selectedEar === 'left' ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Left Bud
          </button>
          <button
            onClick={() => setSelectedEar('right')}
            className={`px-4 py-1.5 text-xs font-mono rounded-lg transition ${
              selectedEar === 'right' ? 'bg-[var(--text-main)] text-[var(--bg-app)] font-semibold' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Right Bud
          </button>
        </div>
      </div>

      {/* Controls List */}
      <div className="flex flex-col gap-2.5">
        {triggers.map((trigger) => (
          <div
            key={trigger.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-bright)] transition"
          >
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">
                {trigger.label}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-sub)]">
                {trigger.desc}
              </span>
            </div>

            <select
              value={currentConfig[trigger.id]}
              onChange={(e) => onSetGesture(selectedEar, trigger.id, e.target.value as GestureAction)}
              className="bg-[var(--bg-app)] text-xs font-mono text-[var(--text-main)] border border-[var(--border-dim)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--accent-color)] transition cursor-pointer self-start sm:self-auto"
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
