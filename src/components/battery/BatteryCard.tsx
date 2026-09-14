import React from 'react';
import { Zap } from 'lucide-react';

interface BatteryCardProps {
  battery: {
    left: number;
    right: number;
    case: number;
    leftCharging: boolean;
    rightCharging: boolean;
    caseCharging: boolean;
  };
}

export const BatteryCard: React.FC<BatteryCardProps> = ({ battery }) => {
  const renderItem = (label: string, percentage: number, isCharging: boolean, side: string) => {
    // Dynamic color depending on battery level
    const isLow = percentage <= 20;
    const strokeColor = isCharging ? '#00e5ff' : isLow ? '#d71920' : '#ffffff';

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl border border-white/10 bg-[#121212]/70 backdrop-blur-sm relative group hover:border-white/20 transition">
        {/* Charging Badge */}
        {isCharging && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
            <span>CHG</span>
          </div>
        )}

        {/* Circular Gauge */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="3.5"
              fill="transparent"
              className="text-white/10"
            />
            {/* Progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={strokeColor}
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Value in Center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-ndot text-sm sm:text-base tracking-wider text-white">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
            {label}
          </span>
          <span className="text-[9px] px-1 rounded bg-white/10 text-neutral-500 font-mono">
            {side}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
      {renderItem('LEFT', battery.left, battery.leftCharging, 'L')}
      {renderItem('CASE', battery.case, battery.caseCharging, 'C')}
      {renderItem('RIGHT', battery.right, battery.rightCharging, 'R')}
    </div>
  );
};
