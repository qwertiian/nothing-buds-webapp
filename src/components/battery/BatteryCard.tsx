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
    const isLow = percentage <= 20;
    const isCritical = percentage <= 10;
    
    // Dynamic color depending on battery level & charging state
    const strokeColor = isCharging 
      ? '#00e5ff' 
      : isCritical 
      ? '#d71920' 
      : isLow 
      ? '#f59e0b' 
      : 'var(--text-main)';

    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center p-3.5 sm:p-4 rounded-xl theme-card relative group transition-all duration-200">
        {/* Charging Badge */}
        {isCharging && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] text-cyan-300 font-mono animate-pulse">
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
              strokeWidth="2.5"
              fill="transparent"
              className="text-[var(--border-dim)]"
            />
            {/* Progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={strokeColor}
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Value in Center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-ndot text-sm sm:text-base tracking-wider text-[var(--text-main)]">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11px] font-mono tracking-wider text-[var(--text-sub)] uppercase">
            {label}
          </span>
          <span className="text-[9px] px-1 rounded border border-[var(--border-dim)] bg-[var(--bg-surface-elevated)] text-[var(--text-dim)] font-mono">
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
