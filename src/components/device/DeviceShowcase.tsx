import React, { useState, useRef } from 'react';
import { EarbudModel } from '../../models/types';
import { SUPPORTED_DEVICES } from '../../models/devices';
import { soundFx } from '../../services/audio/SoundSynthesizer';
import { ChevronDown, Sparkles } from 'lucide-react';

interface DeviceShowcaseProps {
  model: EarbudModel;
  serialNumber: string;
  firmwareVersion: string;
  onSelectModel: (model: EarbudModel) => void;
  isConnected: boolean;
  osBluetoothConnected?: boolean;
  systemDeviceName?: string;
}

export const DeviceShowcase: React.FC<DeviceShowcaseProps> = ({
  model,
  serialNumber,
  firmwareVersion,
  onSelectModel,
  isConnected,
  osBluetoothConnected,
  systemDeviceName,
}) => {
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [activeItem3d, setActiveItem3d] = useState<'left' | 'case' | 'right' | null>(null);
  const [tiltAngles, setTiltAngles] = useState<{ [key: string]: { x: number; y: number } }>({
    left: { x: 0, y: 0 },
    case: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const [spinningItem, setSpinningItem] = useState<string | null>(null);

  // Mouse-tracking 3D Tilt calculation
  const handleMouseMove = (key: 'left' | 'case' | 'right', e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltAngles(prev => ({
      ...prev,
      [key]: { x: -y * 30, y: x * 30 },
    }));
  };

  const handleMouseLeave = (key: 'left' | 'case' | 'right') => {
    setTiltAngles(prev => ({
      ...prev,
      [key]: { x: 0, y: 0 },
    }));
    setActiveItem3d(null);
  };

  // 3D Click Interaction (Spin & sound)
  const handleClick3d = (key: 'left' | 'case' | 'right') => {
    soundFx.playClick(1050);
    setSpinningItem(key);
    setTimeout(() => {
      setSpinningItem(null);
    }, 750);
  };

  const render3dInteractiveItem = (
    key: 'left' | 'case' | 'right',
    imageSrc: string,
    label: string,
    widthClass: string
  ) => {
    const angle = tiltAngles[key] || { x: 0, y: 0 };
    const isSpinning = spinningItem === key;

    return (
      <div
        className="flex flex-col items-center group select-none cursor-pointer perspective-800"
        onMouseEnter={() => setActiveItem3d(key)}
        onMouseMove={(e) => handleMouseMove(key, e)}
        onMouseLeave={() => handleMouseLeave(key)}
        onClick={() => handleClick3d(key)}
      >
        <div
          className={`relative ${widthClass} flex items-center justify-center transition-transform duration-200 ease-out preserve-3d ${
            isSpinning ? 'animate-spin-3d' : ''
          }`}
          style={{
            transform: isSpinning
              ? undefined
              : `perspective(800px) rotateX(${angle.x}deg) rotateY(${angle.y}deg) translateZ(${
                  activeItem3d === key ? 25 : 0
                }px) scale(${activeItem3d === key ? 1.08 : 1})`,
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
              activeItem3d === key ? 'opacity-40 bg-[var(--accent-color)]' : 'opacity-0'
            }`}
          />

          <img
            src={imageSrc}
            alt={label}
            className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] pointer-events-none"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-dim)] bg-[var(--bg-app)]/60 text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
            {label}
          </span>
          {activeItem3d === key && (
            <span className="text-[9px] font-mono text-[var(--accent-color)] animate-pulse">
              3D
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-2xl theme-card p-5 sm:p-7 flex flex-col items-center justify-between shadow-xl transition-colors duration-300">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none rounded-2xl" />

      {/* Header Info */}
      <div className="w-full flex items-start justify-between z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="glyph-dot" />
            <h1 className="font-ndot text-xl sm:text-2xl text-[var(--text-main)] tracking-wider uppercase">
              {model.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-[var(--text-sub)]">
              CODENAME: <span className="text-[var(--text-main)] font-semibold">{model.codename.toUpperCase()}</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-dim)] bg-[var(--bg-app)]/60 text-[var(--text-sub)]">
              {model.baseId}
            </span>
            {model.maxAncDb && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/25">
                {model.maxAncDb}dB ANC
              </span>
            )}
          </div>
        </div>

        {/* Model Switch Button */}
        <div className="relative">
          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-bright)] text-xs font-mono text-[var(--text-main)] transition"
          >
            <span>SWITCH</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showModelPicker ? 'rotate-180' : ''}`} />
          </button>

          {/* Model Selection Overlay */}
          {showModelPicker && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-72 overflow-y-auto p-2 rounded-xl theme-card-elevated shadow-2xl z-50 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SUPPORTED_DEVICES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectModel(d);
                    setShowModelPicker(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs font-mono transition border ${
                    d.id === model.id
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--text-main)] font-semibold'
                      : 'border-transparent text-[var(--text-sub)] hover:bg-[var(--border-dim)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div className="truncate">{d.name}</div>
                  <div className="text-[10px] opacity-60 flex items-center justify-between mt-0.5">
                    <span>{d.codename}</span>
                    <span className="text-[9px] px-1 rounded bg-[var(--bg-app)]/80">{d.baseId}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center 3D Interactive Earbuds Showcase */}
      <div className="w-full my-6 sm:my-8 flex items-center justify-center gap-4 sm:gap-10 z-10">
        {render3dInteractiveItem('left', model.leftImg, 'LEFT', 'w-20 h-28 sm:w-32 sm:h-44')}
        {render3dInteractiveItem('case', model.caseImg, 'CASE', 'w-28 h-32 sm:w-44 sm:h-52')}
        {render3dInteractiveItem('right', model.rightImg, 'RIGHT', 'w-20 h-28 sm:w-32 sm:h-44')}
      </div>

      {/* Bottom Device Metadata Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-dim)] z-10 text-xs font-mono text-[var(--text-sub)]">
        <div className="flex items-center gap-4">
          <div>
            <span className="opacity-50 mr-1.5">S/N:</span>
            <span className="text-[var(--text-main)]">{serialNumber || 'Connecting...'}</span>
          </div>
          <div>
            <span className="opacity-50 mr-1.5">FW:</span>
            <span className="text-[var(--text-main)]">{firmwareVersion || '1.0.182'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected (Hardware Sync)
            </span>
          ) : osBluetoothConnected ? (
            <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Windows Paired ({systemDeviceName || 'Ready'})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded border border-[var(--border-dim)] text-[var(--text-sub)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Ready to Pair
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
