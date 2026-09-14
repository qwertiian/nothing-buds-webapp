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
    <div className="relative w-full rounded-2xl border border-white/6 bg-[#111111] p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden shadow-none">
      {/* Background Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

      {/* Top Header info */}
      <div className="w-full flex items-start justify-between z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nothing-red" />
            <h1 className="font-ndot text-2xl sm:text-3xl text-white tracking-widest uppercase">
              {model.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono text-neutral-500">
              CODENAME: <span className="text-white font-medium">{model.codename.toUpperCase()}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/6">
              {model.baseId}
            </span>
          </div>
        </div>

        {/* Quick Model Change Button */}
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/6 bg-[#161616] hover:bg-[#1a1a1a] text-xs font-mono text-white transition-all duration-200 z-20"
        >
          <span>SWITCH</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showModelPicker ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Model Selection Drawer / Overlay */}
      <div className={`w-full overflow-hidden transition-all duration-300 ease-out z-30 ${showModelPicker ? 'max-h-48 mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
        <div className="p-3 rounded-2xl border border-white/6 bg-[#161616] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {SUPPORTED_DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onSelectModel(d);
                setShowModelPicker(false);
              }}
              className={`p-3 rounded-xl text-left text-xs font-mono transition-all duration-200 border ${
                d.id === model.id
                  ? 'border-nothing-red bg-white/5 text-white'
                  : 'border-transparent bg-transparent hover:bg-white/5 text-neutral-400'
              }`}
            >
              <div className="font-medium truncate">{d.name}</div>
              <div className="text-[10px] text-neutral-500 mt-1">{d.codename}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Center Image Showcase */}
      <div className="w-full my-8 flex items-center justify-center gap-8 sm:gap-12 z-10">
        {/* Left Earbud */}
        <div className="flex flex-col items-center group">
          <div className="w-24 h-32 sm:w-36 sm:h-48 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            <img
              src={model.leftImg}
              alt="Left Earbud"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-float"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 mt-4 tracking-widest">
            LEFT
          </span>
        </div>

        {/* Case */}
        <div className="flex flex-col items-center group">
          <div className="w-32 h-36 sm:w-48 sm:h-56 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            <img
              src={model.caseImg}
              alt="Earbuds Case"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-float"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 mt-4 tracking-widest">
            CASE
          </span>
        </div>

        {/* Right Earbud */}
        <div className="flex flex-col items-center group">
          <div className="w-24 h-32 sm:w-36 sm:h-48 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            <img
              src={model.rightImg}
              alt="Right Earbud"
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-float"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 mt-4 tracking-widest">
            RIGHT
          </span>
        </div>
      </div>

      {/* Bottom Device Metadata Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/6 z-10 text-[11px] font-mono text-neutral-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>S/N</span>
            <span className="text-white">{serialNumber || 'SH2469019248271'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>FW</span>
            <span className="text-white">{firmwareVersion || '1.0.182'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSimulator ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] text-neutral-400 border border-white/6">
              <Info className="w-3.5 h-3.5" /> VIRTUAL
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] text-white border border-white/6">
              <ShieldCheck className="w-3.5 h-3.5" /> CONNECTED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
