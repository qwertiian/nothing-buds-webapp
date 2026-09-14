import React, { useState } from 'react';
import { EarbudModel } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';
import { ChevronDown, Info, ShieldCheck } from 'lucide-react';

interface DeviceShowcaseProps {
  model: EarbudModel;
  serialNumber: string;
  firmwareVersion: string;
  onSelectModel: (model: EarbudModel) => void;
  isSimulator: boolean;
}

export const DeviceShowcase: React.FC<DeviceShowcaseProps> = ({
  model,
  serialNumber,
  firmwareVersion,
  onSelectModel,
  isSimulator,
}) => {
  const [showModelPicker, setShowModelPicker] = useState(false);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0d0d0d] p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden shadow-2xl">
      {/* Background Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      {/* Top Header info */}
      <div className="w-full flex items-start justify-between z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nothing-red" />
            <h1 className="font-ndot text-2xl sm:text-3xl text-white tracking-wider uppercase">
              {model.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-neutral-400">
              CODENAME: <span className="text-white font-semibold">{model.codename.toUpperCase()}</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">
              {model.baseId}
            </span>
            {model.maxAncDb && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nothing-red/20 text-nothing-red border border-nothing-red/30">
                {model.maxAncDb}dB ANC
              </span>
            )}
          </div>
        </div>

        {/* Quick Model Change Button */}
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition z-20"
        >
          <span>Switch Model</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showModelPicker ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Model Selection Drawer / Overlay */}
      {showModelPicker && (
        <div className="w-full mt-4 p-3 rounded-xl border border-white/15 bg-[#181818]/95 backdrop-blur-md z-30 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 animate-in fade-in duration-200">
          {SUPPORTED_DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onSelectModel(d);
                setShowModelPicker(false);
              }}
              className={`p-2.5 rounded-lg text-left text-xs font-mono transition border ${
                d.id === model.id
                  ? 'border-nothing-red bg-nothing-red/10 text-white'
                  : 'border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <div className="font-medium truncate">{d.name}</div>
              <div className="text-[10px] text-neutral-400 flex items-center justify-between mt-1">
                <span>{d.codename}</span>
                <span className="text-[9px] px-1 rounded bg-black/40">{d.baseId}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Center Image Showcase */}
      <div className="w-full my-6 sm:my-10 flex items-center justify-center gap-4 sm:gap-8 z-10">
        {/* Left Earbud */}
        <div className="flex flex-col items-center group">
          <div className="w-24 h-32 sm:w-36 sm:h-48 relative flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:-translate-y-2">
            <img
              src={model.leftImg}
              alt="Left Earbud"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] animate-float"
              style={{ animationDelay: '0s' }}
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2 px-2 py-0.5 rounded border border-white/10 bg-black/40">
            LEFT
          </span>
        </div>

        {/* Case */}
        <div className="flex flex-col items-center group">
          <div className="w-32 h-36 sm:w-48 sm:h-56 relative flex items-center justify-center transition-transform duration-500 hover:scale-105 hover:-translate-y-1">
            <img
              src={model.caseImg}
              alt="Earbuds Case"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] animate-float"
              style={{ animationDelay: '0.6s' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2 px-2 py-0.5 rounded border border-white/10 bg-black/40">
            CASE
          </span>
        </div>

        {/* Right Earbud */}
        <div className="flex flex-col items-center group">
          <div className="w-24 h-32 sm:w-36 sm:h-48 relative flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:-translate-y-2">
            <img
              src={model.rightImg}
              alt="Right Earbud"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] animate-float"
              style={{ animationDelay: '1.2s' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2 px-2 py-0.5 rounded border border-white/10 bg-black/40">
            RIGHT
          </span>
        </div>
      </div>

      {/* Bottom Device Metadata Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 z-10 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-neutral-500 mr-1.5">S/N:</span>
            <span className="text-neutral-200">{serialNumber || 'SH2469019248271'}</span>
          </div>
          <div>
            <span className="text-neutral-500 mr-1.5">FIRMWARE:</span>
            <span className="text-neutral-200">{firmwareVersion || '1.0.182'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSimulator ? (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Info className="w-3 h-3" /> Virtual Hardware Mode
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> Bluetooth Connected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
