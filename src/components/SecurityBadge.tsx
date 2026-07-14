import React from 'react';

interface SecurityBadgeProps {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  className?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ severity, className = "" }) => {
  const getColors = () => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-950/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-950/20';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${getColors()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        severity === 'Critical' ? 'bg-rose-500 animate-ping' :
        severity === 'High' ? 'bg-amber-500 animate-pulse' :
        severity === 'Medium' ? 'bg-blue-500' : 'bg-emerald-500'
      }`} />
      {severity === 'Critical' ? 'KRİTİK' :
       severity === 'High' ? 'YÜKSƏK' :
       severity === 'Medium' ? 'ORTA' : 'AŞAĞI'}
    </span>
  );
};
