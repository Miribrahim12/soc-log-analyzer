import React, { useEffect, useState } from 'react';
import { Network, Server, Globe, ArrowRight, Activity } from 'lucide-react';

interface AttackMapProps {
  sourceIp: string;
  targetIp: string;
  protocol: string;
  port: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export const AttackMap: React.FC<AttackMapProps> = ({
  sourceIp,
  targetIp,
  protocol,
  port,
  severity
}) => {
  const [packets, setPackets] = useState<{ id: number; offset: number }[]>([]);

  // Periodically generate packet flow indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets((prev) => [
        ...prev.slice(-15),
        { id: Math.random(), offset: 0 }
      ]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Animate packets flowing from Source to Target
  useEffect(() => {
    const animationFrame = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((p) => ({ ...p, offset: p.offset + 1.5 }))
          .filter((p) => p.offset <= 100)
      );
    }, 30);

    return () => clearInterval(animationFrame);
  }, []);

  const getSeverityColor = () => {
    switch (severity) {
      case 'Critical': return 'text-red-500 border-red-600/50 bg-red-950/20';
      case 'High': return 'text-amber-500 border-amber-600/50 bg-amber-950/20';
      case 'Medium': return 'text-blue-400 border-blue-600/50 bg-blue-950/20';
      default: return 'text-emerald-400 border-emerald-600/50 bg-emerald-950/20';
    }
  };

  const getPulseColor = () => {
    switch (severity) {
      case 'Critical': return '#dc2626'; // red-600
      case 'High': return '#f59e0b'; // amber-500
      case 'Medium': return '#3b82f6'; // blue-500
      default: return '#10b981'; // emerald-500
    }
  };

  return (
    <div id="live-visual-attack-map" className="border border-white/10 bg-[#070707] p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic scanning line inside map */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-white/5 shadow-md animate-[bounce_6s_infinite]" />

      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest font-sans">
            Network Traffic Monitor (Live Attack Flow)
          </h3>
        </div>
        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-red-950/40 text-red-400 border border-red-900/60 font-bold uppercase tracking-wider animate-pulse">
          Live Flow
        </span>
      </div>

      {/* SVG Interactive Map Area */}
      <div className="relative h-44 bg-[#030303] border border-white/5 flex items-center justify-between px-6 md:px-12 my-2 select-none overflow-hidden">
        {/* Background coordinate grid labels */}
        <div className="absolute left-3 top-2 font-mono text-[8px] text-white/20">GRID_SYS: AX-89</div>
        <div className="absolute right-3 bottom-2 font-mono text-[8px] text-white/20">LATENCY: ~2.4ms</div>

        {/* Source Node */}
        <div className="flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <div className={`absolute -inset-3 rounded-full border border-red-500/30 animate-ping opacity-75`} />
            <div className="absolute -inset-1 bg-red-600/20 blur-[4px] rounded-full" />
            <div className="w-12 h-12 bg-black border border-red-600 flex items-center justify-center relative">
              <Globe className="w-5 h-5 text-red-500" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-600" />
            </div>
          </div>
          <span className="mt-2 font-mono text-[10px] font-black text-red-400 tracking-wider">
            SOURCE // SRC
          </span>
          <span className="font-mono text-[10px] text-white/60 bg-white/5 px-1 py-0.5 mt-0.5 border border-white/5">
            {sourceIp && sourceIp !== "YOLUXMUŞ_CİHAZ" && sourceIp !== "INFECTED_DEVICE" ? sourceIp : '45.227.254.12'}
          </span>
        </div>

        {/* Dynamic Connected Flow Line */}
        <div className="flex-1 relative h-12 mx-4 flex items-center">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Pulsing hazard line */}
            <line
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke={getPulseColor()}
              strokeWidth="1.5"
              className="opacity-40"
            />
            {/* Packet particles travelling from source to destination */}
            {packets.map((p) => (
              <circle
                key={p.id}
                cx={`${p.offset}%`}
                cy="50%"
                r="3.5"
                fill={getPulseColor()}
                className="shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 4px ${getPulseColor()})`
                }}
              />
            ))}
          </svg>

          {/* Central status pill */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] border border-white/15 px-2.5 py-0.5 font-mono text-[9px] text-white/70 uppercase tracking-widest text-center flex items-center gap-1.5">
            <span>{protocol}</span>
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold">PORT: {port}</span>
          </div>
        </div>

        {/* Target Node */}
        <div className="flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 bg-emerald-600/10 blur-[3px] rounded-full" />
            <div className="w-12 h-12 bg-black border border-white/20 flex items-center justify-center relative">
              <Server className="w-5 h-5 text-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <span className="mt-2 font-mono text-[10px] font-black text-emerald-400 tracking-wider">
            TARGET // DST
          </span>
          <span className="font-mono text-[10px] text-white/60 bg-white/5 px-1 py-0.5 mt-0.5 border border-white/5">
            {targetIp && targetIp !== "DAXİLİ_SERVER" && targetIp !== "INTERNAL_SERVER" ? targetIp : '192.168.1.15'}
          </span>
        </div>
      </div>

      {/* Connection packet diagnostics line */}
      <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[9px] text-white/50 border-t border-white/5 pt-2">
        <div className="flex items-center gap-1">
          <span className="text-white/30">PACKET:</span>
          <span className="text-white/90">FLOW_TCP_SYN</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-white/30">SIZE:</span>
          <span className="text-white/90 font-bold text-red-400">1024 BYTES</span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <span className="text-white/30">DIAG:</span>
          <span className="text-emerald-400 font-black">MONITOR_OK</span>
        </div>
      </div>
    </div>
  );
};
