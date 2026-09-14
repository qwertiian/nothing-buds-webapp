import React from 'react';
import { EarbudState } from '../../models/types';
import { Bell, BellOff, Ear, Gamepad2, Shuffle } from 'lucide-react';

interface DeviceSettingsProps {
  state: EarbudState;
  onSetInEarDetection: (enabled: boolean) => void;
  onSetLowLagMode: (enabled: boolean) => void;
  onSetDualConnection: (enabled: boolean) => void;
  onToggleRinging: (ear: 'left' | 'right') => void;
}

export const DeviceSettings: React.FC<DeviceSettingsProps> = ({
  state,
  onSetInEarDetection,
  onSetLowLagMode,
  onSetDualConnection,
  onToggleRinging,
}) => {
  return (
    <div className="p-5 sm:p-7 rounded-2xl theme-card flex flex-col gap-6 shadow-xl transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="glyph-dot" />
        <h2 className="font-ndot text-xl text-[var(--text-main)] tracking-wider uppercase">DEVICE SETTINGS</h2>
      </div>

      {/* Grid of Toggle Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* In-Ear Detection */}
        <div className="p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Ear className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">In-Ear Detection</span>
            </div>
            <button
              onClick={() => onSetInEarDetection(!state.inEarDetection)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.inEarDetection ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-bright)]'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  state.inEarDetection ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-sub)]">
            Automatically pause playback when either earbud is removed, and resume when put back on.
          </p>
        </div>

        {/* Low Lag Mode */}
        <div className="p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">Low Lag Mode</span>
            </div>
            <button
              onClick={() => onSetLowLagMode(!state.lowLagMode)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.lowLagMode ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-bright)]'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  state.lowLagMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-sub)]">
            Reduces Bluetooth transmission delay down to sub-120ms for synchronized gaming and video.
          </p>
        </div>

        {/* Dual Connection */}
        <div className="p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-mono text-[var(--text-main)] font-medium">Dual Connection</span>
            </div>
            <button
              onClick={() => onSetDualConnection(!state.dualConnection)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.dualConnection ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-bright)]'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  state.dualConnection ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-[var(--text-sub)]">
            Seamlessly connect your earbuds to two devices simultaneously and switch audio automatically.
          </p>
        </div>
      </div>

      {/* Find My Earbuds Panel */}
      <div className="p-4 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="text-xs font-mono text-[var(--text-main)] font-medium uppercase">
              Find My Earbuds (Radar Chirp)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-sub)]">
            Plays a loud audio chirp through the buds
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => onToggleRinging('left')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-medium transition ${
              state.ringing.left
                ? 'border-red-500 bg-red-500/15 text-red-300 animate-pulse'
                : 'border-[var(--border-dim)] bg-[var(--bg-app)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
            }`}
          >
            {state.ringing.left ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{state.ringing.left ? 'STOP LEFT CHIRP' : 'RING LEFT BUD'}</span>
          </button>

          <button
            onClick={() => onToggleRinging('right')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-medium transition ${
              state.ringing.right
                ? 'border-red-500 bg-red-500/15 text-red-300 animate-pulse'
                : 'border-[var(--border-dim)] bg-[var(--bg-app)] text-[var(--text-sub)] hover:border-[var(--border-bright)] hover:text-[var(--text-main)]'
            }`}
          >
            {state.ringing.right ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{state.ringing.right ? 'STOP RIGHT CHIRP' : 'RING RIGHT BUD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
