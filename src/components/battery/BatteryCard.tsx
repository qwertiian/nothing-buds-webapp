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
    const strokeColor = isCharging ? '#ffffff' : percentage < 10 ? '#d71920' : percentage <= 20 ? '#fbbf24' : '#ffffff';

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center p-5 sm:p-6 rounded-2xl border border-white/6 bg-[#111111] relative group hover:bg-[#131313] transition-all duration-200">
        {/* Charging Badge */}
        {isCharging && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-white font-mono opacity-80">
            <Zap className="w-3 h-3 fill-white" />
          </div>
        )}

        {/* Circular Gauge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-white/5"
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
            <span className="font-mono text-xl sm:text-2xl font-light text-white">
              {percentage}<span className="text-sm text-neutral-500">%</span>
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
      {renderItem('LEFT', battery.left, battery.leftCharging, 'L')}
      {renderItem('CASE', battery.case, battery.caseCharging, 'C')}
      {renderItem('RIGHT', battery.right, battery.rightCharging, 'R')}
    </div>
  );
};
