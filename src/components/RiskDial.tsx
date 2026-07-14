import React from 'react';

interface RiskDialProps {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export const RiskDial: React.FC<RiskDialProps> = ({ severity }) => {
  // Map severity to angles on a 180-degree semi-circle (from -90 to +90 deg, or 0 to 180)
  // We'll draw a gauge from 0% to 100% (represented by angles)
  const severityConfig = {
    Low: {
      angle: -60,
      color: '#10b981', // emerald-500
      text: 'LOW RISK',
      bg: 'bg-emerald-950/10 border-emerald-900/40',
      textColor: 'text-emerald-400'
    },
    Medium: {
      angle: -20,
      color: '#3b82f6', // blue-500
      text: 'MEDIUM RISK',
      bg: 'bg-blue-950/10 border-blue-900/40',
      textColor: 'text-blue-400'
    },
    High: {
      angle: 20,
      color: '#f59e0b', // amber-500
      text: 'HIGH RISK',
      bg: 'bg-amber-950/10 border-amber-900/40',
      textColor: 'text-amber-400'
    },
    Critical: {
      angle: 60,
      color: '#dc2626', // red-600
      text: 'CRITICAL RISK',
      bg: 'bg-rose-950/20 border-rose-900/40',
      textColor: 'text-rose-500 animate-pulse'
    }
  };

  const current = severityConfig[severity] || severityConfig.High;

  return (
    <div id="risk-gauge-dial" className="border border-white/10 bg-[#070707] p-5 flex flex-col items-center justify-center">
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-black mb-3 text-center block w-full">
        SECURITY RISK LEVEL
      </span>

      {/* Semicircular SVG dial gauge */}
      <div className="relative w-40 h-24 flex items-center justify-center select-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 60">
          {/* Semicircle background arc */}
          <path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            strokeLinecap="square"
          />

          {/* Color tracks mapping */}
          {/* Emerald track (Low) */}
          <path
            d="M 15 50 A 35 35 0 0 1 32.5 31.7"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            className="opacity-40"
          />
          {/* Blue track (Medium) */}
          <path
            d="M 32.5 31.7 A 35 35 0 0 1 50 15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            className="opacity-40"
          />
          {/* Amber track (High) */}
          <path
            d="M 50 15 A 35 35 0 0 1 67.5 31.7"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="8"
            className="opacity-40"
          />
          {/* Red track (Critical) */}
          <path
            d="M 67.5 31.7 A 35 35 0 0 1 85 50"
            fill="none"
            stroke="#dc2626"
            strokeWidth="8"
            className="opacity-40"
          />

          {/* Glowing Indicator Arc (Matches current severity) */}
          {severity === 'Low' && (
            <path d="M 15 50 A 35 35 0 0 1 32.5 31.7" fill="none" stroke="#10b981" strokeWidth="8" />
          )}
          {severity === 'Medium' && (
            <path d="M 15 50 A 35 35 0 0 1 50 15" fill="none" stroke="#3b82f6" strokeWidth="8" />
          )}
          {severity === 'High' && (
            <path d="M 15 50 A 35 35 0 0 1 67.5 31.7" fill="none" stroke="#f59e0b" strokeWidth="8" />
          )}
          {severity === 'Critical' && (
            <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#dc2626" strokeWidth="8" />
          )}

          {/* Need/Pointer Anchor Center */}
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
          
          {/* Needle path rotating based on severity */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${current.angle} 50 50)`}
            className="transition-transform duration-700 ease-out"
          />
        </svg>

        {/* Digital Score label overlay */}
        <div className="absolute bottom-1 font-mono text-[10px] font-black text-white/40 tracking-wider">
          01 <span className="text-white/10">|</span> 02 <span className="text-white/10">|</span> 03 <span className="text-white/10">|</span> 04
        </div>
      </div>

      {/* Selected level container bar */}
      <div className={`mt-2 w-full text-center py-2 px-3 border font-mono text-[11px] font-black tracking-widest ${current.bg} ${current.textColor}`}>
        {current.text}
      </div>
    </div>
  );
};
