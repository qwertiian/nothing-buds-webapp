import React, { useState } from 'react';
import { AncMode, EarbudModel } from '../../models/types';
import { Volume2, VolumeX, Radio, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AncStudioProps {
  ancMode: AncMode;
  onSetAncMode: (mode: AncMode) => void;
  personalizedAnc: boolean;
  onSetPersonalizedAnc: (enabled: boolean) => void;
  model: EarbudModel;
}

export const AncStudio: React.FC<AncStudioProps> = ({
  ancMode,
  onSetAncMode,
  personalizedAnc,
  onSetPersonalizedAnc,
  model,
}) => {
  const [lastAncLevel, setLastAncLevel] = useState<'high' | 'mid' | 'low' | 'adaptive'>('high');
  const [showFitTest, setShowFitTest] = useState(false);

  if (!model.hasAnc) {
    return (
      <div className="bg-[#111111] rounded-2xl border border-white/6 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <VolumeX size={48} className="text-white/20 mb-4" />
        <h2 className="font-ndot text-2xl text-white mb-2">NO ANC</h2>
        <p className="text-white/50 text-sm max-w-sm">
          {model.name} does not support Active Noise Cancellation.
        </p>
      </div>
    );
  }

  const isAncOn = ancMode === 'low' || ancMode === 'mid' || ancMode === 'high' || ancMode === 'adaptive';

  const handleAncOnClick = () => {
    onSetAncMode(lastAncLevel);
  };

  const handleIntensityClick = (level: 'high' | 'mid' | 'low' | 'adaptive') => {
    setLastAncLevel(level);
    onSetAncMode(level);
  };

  return (
    <div className="bg-[#111111] rounded-2xl border border-white/6 p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-ndot text-2xl text-white tracking-wider uppercase">Noise Control</h2>
        {model.maxAncDb && (
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/6 flex items-center gap-2">
            <Radio size={14} className="text-[#d71920]" />
            <span className="font-mono text-xs text-white/70">Up to {model.maxAncDb}dB</span>
          </div>
        )}
      </div>

      {/* Main Switcher */}
      <div className="bg-[#161616] p-1.5 rounded-2xl border border-white/6 flex gap-2">
        <button
          onClick={handleAncOnClick}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${
            isAncOn ? 'bg-[#d71920] text-white shadow-lg' : 'hover:bg-white/5 text-white/50'
          }`}
        >
          <VolumeX size={24} className={isAncOn ? 'text-white' : ''} />
          <span className="font-mono text-xs uppercase tracking-widest font-medium">Cancellation</span>
        </button>

        <button
          onClick={() => onSetAncMode('transparency')}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${
            ancMode === 'transparency' ? 'bg-white text-black shadow-lg' : 'hover:bg-white/5 text-white/50'
          }`}
        >
          <Volume2 size={24} className={ancMode === 'transparency' ? 'text-black' : ''} />
          <span className="font-mono text-xs uppercase tracking-widest font-medium">Transparency</span>
        </button>

        <button
          onClick={() => onSetAncMode('off')}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${
            ancMode === 'off' ? 'bg-[#222222] text-white shadow-lg border border-white/10' : 'hover:bg-white/5 text-white/50'
          }`}
        >
          <Radio size={24} className={ancMode === 'off' ? 'text-white' : ''} />
          <span className="font-mono text-xs uppercase tracking-widest font-medium">Off</span>
        </button>
      </div>

      {/* Intensity Selector */}
      {isAncOn && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-mono text-xs text-white/40 uppercase mb-3 px-1">Intensity</h3>
          <div className="flex gap-2">
            {(['high', 'mid', 'low', 'adaptive'] as const).map((level) => (
              <button
                key={level}
                onClick={() => handleIntensityClick(level)}
                className={`flex-1 py-3 px-2 rounded-xl text-center font-mono text-xs transition-all duration-200 border ${
                  ancMode === level
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-transparent border-white/6 text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {(model.hasPersonalizedAnc || model.hasEarFitTest) && (
        <div className="flex flex-col gap-3 pt-4 border-t border-white/6">
          {model.hasPersonalizedAnc && (
            <div className="flex items-center justify-between p-4 bg-[#161616] rounded-xl border border-white/6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${personalizedAnc ? 'bg-[#d71920]/20 text-[#d71920]' : 'bg-white/5 text-white/40'}`}>
                  <Sparkles size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm text-white font-medium">Personalized ANC</span>
                  <span className="font-mono text-xs text-white/40">Adapts to your ear canal</span>
                </div>
              </div>
              <button
                onClick={() => onSetPersonalizedAnc(!personalizedAnc)}
                className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                  personalizedAnc ? 'bg-[#d71920]' : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    personalizedAnc ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )}

          {model.hasEarFitTest && (
            <button
              onClick={() => setShowFitTest(true)}
              className="flex items-center justify-between p-4 bg-[#161616] hover:bg-white/5 rounded-xl border border-white/6 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-white/60">
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-sans text-sm text-white font-medium">Ear Tip Fit Test</span>
                  <span className="font-mono text-xs text-white/40">Check seal for optimal sound</span>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Fit Test Modal */}
      {showFitTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setShowFitTest(false)} className="text-white/40 hover:text-white transition-colors text-2xl leading-none">
                &times;
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <h3 className="font-ndot text-2xl text-white">FIT TEST</h3>
              <p className="text-white/60 text-sm mb-6">
                Place both earbuds in your ears. The test will play a short tone to check the acoustic seal.
              </p>
              <button 
                onClick={() => setShowFitTest(false)}
                className="w-full py-4 bg-white text-black font-mono text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-xl"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
