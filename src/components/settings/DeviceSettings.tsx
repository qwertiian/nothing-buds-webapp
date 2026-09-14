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
    <div className="p-6 sm:p-8 rounded-2xl border border-white/6 bg-[#111111] flex flex-col gap-8 shadow-none">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-nothing-red" />
        <h2 className="font-ndot text-2xl text-white tracking-widest uppercase">SETTINGS</h2>
      </div>

      {/* Grid of Toggle Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* In-Ear Detection */}
        <div className="p-5 rounded-2xl border border-white/6 bg-[#161616] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Ear className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase">In-Ear Detection</span>
            </div>
            <button
              onClick={() => onSetInEarDetection(!state.inEarDetection)}
              className={`w-10 h-5.5 rounded-full transition-all duration-300 relative flex items-center p-1 ${
                state.inEarDetection ? 'bg-white' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#111111] transition-transform duration-300 shadow-sm ${
                  state.inEarDetection ? 'translate-x-4' : 'translate-x-0 bg-neutral-400'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-sans text-neutral-500">
            Pause playback when removed, resume when put back on.
          </p>
        </div>

        {/* Low Lag Mode */}
        <div className="p-5 rounded-2xl border border-white/6 bg-[#161616] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase">Low Lag Mode</span>
            </div>
            <button
              onClick={() => onSetLowLagMode(!state.lowLagMode)}
              className={`w-10 h-5.5 rounded-full transition-all duration-300 relative flex items-center p-1 ${
                state.lowLagMode ? 'bg-white' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#111111] transition-transform duration-300 shadow-sm ${
                  state.lowLagMode ? 'translate-x-4' : 'translate-x-0 bg-neutral-400'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-sans text-neutral-500">
            Minimize Bluetooth delay for gaming and videos.
          </p>
        </div>

        {/* Dual Connection */}
        <div className="p-5 rounded-2xl border border-white/6 bg-[#161616] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Shuffle className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase">Dual Connection</span>
            </div>
            <button
              onClick={() => onSetDualConnection(!state.dualConnection)}
              className={`w-10 h-5.5 rounded-full transition-all duration-300 relative flex items-center p-1 ${
                state.dualConnection ? 'bg-white' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#111111] transition-transform duration-300 shadow-sm ${
                  state.dualConnection ? 'translate-x-4' : 'translate-x-0 bg-neutral-400'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] font-sans text-neutral-500">
            Connect to two devices seamlessly.
          </p>
        </div>
      </div>

      {/* Find My Earbuds Panel */}
      <div className="p-5 rounded-2xl border border-white/6 bg-[#161616] flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <Bell className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest uppercase">
              Find My Buds
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Ring Left */}
          <button
            onClick={() => onToggleRinging('left')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all duration-200 ${
              state.ringing.left
                ? 'border-nothing-red bg-nothing-red/10 text-nothing-red shadow-[0_0_15px_rgba(215,25,32,0.15)]'
                : 'border-white/6 bg-transparent hover:bg-white/5 text-neutral-400'
            }`}
          >
            {state.ringing.left ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{state.ringing.left ? 'STOP LEFT' : 'RING LEFT'}</span>
          </button>

          {/* Ring Right */}
          <button
            onClick={() => onToggleRinging('right')}
            className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all duration-200 ${
              state.ringing.right
                ? 'border-nothing-red bg-nothing-red/10 text-nothing-red shadow-[0_0_15px_rgba(215,25,32,0.15)]'
                : 'border-white/6 bg-transparent hover:bg-white/5 text-neutral-400'
            }`}
          >
            {state.ringing.right ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{state.ringing.right ? 'STOP RIGHT' : 'RING RIGHT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
