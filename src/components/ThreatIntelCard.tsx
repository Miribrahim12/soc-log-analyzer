import React from 'react';
import { getThreatIntel } from '../utils/cyberUtils';
import { Shield, Eye, ShieldAlert, Crosshair, HelpCircle } from 'lucide-react';

interface ThreatIntelCardProps {
  sourceIp: string;
  alertType: string;
}

export const ThreatIntelCard: React.FC<ThreatIntelCardProps> = ({ sourceIp, alertType }) => {
  const intel = getThreatIntel(sourceIp, alertType);

  const getReputationBadge = (score: number) => {
    if (score >= 90) return 'text-red-500 font-bold border-red-950 bg-red-950/10';
    if (score >= 70) return 'text-amber-500 font-bold border-amber-950 bg-amber-950/10';
    return 'text-blue-400 font-bold border-blue-950 bg-blue-950/10';
  };

  return (
    <div id="threat-intel-lookup-card" className="border border-white/10 p-5 bg-white/[0.01]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-rose-500" />
          <h3 className="text-xs font-black uppercase tracking-widest font-sans">
            Threat Intelligence (Source IP Intel)
          </h3>
        </div>
        <span className="font-mono text-[9px] text-white/40">TI_SYS_v2</span>
      </div>

      <div className="space-y-3.5 font-mono text-[11px]">
        {/* Country of Origin */}
        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
          <span className="text-white/40">SOURCE COUNTRY:</span>
          <span className="font-bold text-white flex items-center gap-1.5 bg-white/5 px-2 py-0.5 border border-white/10">
            <span>{intel.flag}</span>
            <span>{intel.country}</span>
          </span>
        </div>

        {/* Reputation Score */}
        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
          <span className="text-white/40">REPUTATION SCORE:</span>
          <span className={`px-2 py-0.5 border font-black ${getReputationBadge(intel.reputationScore)}`}>
            {intel.reputationScore === 0 ? 'UNKNOWN' : `${intel.reputationScore}/100`}
          </span>
        </div>

        {/* ISP */}
        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
          <span className="text-white/40">ISP PROVIDER:</span>
          <span className="font-bold text-white/90 truncate max-w-[160px]" title={intel.isp}>
            {intel.isp}
          </span>
        </div>

        {/* Tor/VPN status */}
        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
          <span className="text-white/40">TOR / VPN EXIT:</span>
          <span className={`font-black px-1.5 py-0.2 border ${
            intel.isTorVpn === 'YES' 
              ? 'text-red-400 bg-red-950/20 border-red-900' 
              : 'text-white/50 bg-white/5 border-white/10'
          }`}>
            {intel.isTorVpn}
          </span>
        </div>

        {/* Quick status report footer */}
        <div className="pt-2 flex items-start gap-2 text-[10px] text-white/40 leading-relaxed font-mono">
          <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <span>
            {intel.reputationScore >= 75 
              ? "This IP is flagged on active threat blacklists. Immediate blocking is recommended."
              : "IP belongs to a standard network provider, but the logged traffic exhibits malicious anomalies."}
          </span>
        </div>
      </div>
    </div>
  );
};
