import React from 'react';
import { EarbudState } from '../../models/types';
import { Bell, BellOff, Ear, Gamepad2, Shuffle, Check, Info } from 'lucide-react';

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
    <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#121212] flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="glyph-dot" />
        <h2 className="font-ndot text-xl text-white tracking-wider uppercase">DEVICE SETTINGS</h2>
      </div>

      {/* Grid of Toggle Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* In-Ear Detection */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#171717] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Ear className="w-4 h-4 text-nothing-red" />
              <span className="text-xs font-mono text-white font-medium">In-Ear Detection</span>
            </div>
            <button
              onClick={() => onSetInEarDetection(!state.inEarDetection)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.inEarDetection ? 'bg-nothing-red' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  state.inEarDetection ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-neutral-400">
            Automatically pause playback when either earbud is removed, and resume when put back on.
          </p>
        </div>

        {/* Low Lag Mode */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#171717] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-nothing-red" />
              <span className="text-xs font-mono text-white font-medium">Low Lag Mode</span>
            </div>
            <button
              onClick={() => onSetLowLagMode(!state.lowLagMode)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.lowLagMode ? 'bg-nothing-red' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  state.lowLagMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-neutral-400">
            Reduces Bluetooth transmission delay down to sub-120ms for synchronized gaming and movies.
          </p>
        </div>

        {/* Dual Connection */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#171717] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-nothing-red" />
              <span className="text-xs font-mono text-white font-medium">Dual Connection</span>
            </div>
            <button
              onClick={() => onSetDualConnection(!state.dualConnection)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.dualConnection ? 'bg-nothing-red' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  state.dualConnection ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-mono text-neutral-400">
            Seamlessly connect your earbuds to two devices simultaneously and switch audio automatically.
          </p>
        </div>
      </div>

      {/* Find My Earbuds Panel */}
      <div className="p-4 rounded-xl border border-white/5 bg-[#171717] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-nothing-red" />
            <span className="text-xs font-mono text-white font-medium uppercase">
              Find My Earbuds (Radar Chirp)
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            Plays a loud audio chirp through the buds
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* Ring Left */}
          <button
            onClick={() => onToggleRinging('left')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-medium transition ${
              state.ringing.left
                ? 'border-red-500 bg-red-950/60 text-red-300 animate-pulse'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            {state.ringing.left ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{state.ringing.left ? 'STOP LEFT CHIRP' : 'RING LEFT BUD'}</span>
          </button>

          {/* Ring Right */}
          <button
            onClick={() => onToggleRinging('right')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-medium transition ${
              state.ringing.right
                ? 'border-red-500 bg-red-950/60 text-red-300 animate-pulse'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
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
