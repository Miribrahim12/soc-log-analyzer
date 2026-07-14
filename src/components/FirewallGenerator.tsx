import React, { useState } from 'react';
import { generateFirewallRules } from '../utils/cyberUtils';
import { ShieldAlert, Copy, Check, Terminal, FileText } from 'lucide-react';

interface FirewallGeneratorProps {
  sourceIp: string;
  port: string;
}

export const FirewallGenerator: React.FC<FirewallGeneratorProps> = ({ sourceIp, port }) => {
  const [copiedKey, setCopiedKey] = useState<string>('');

  const rules = generateFirewallRules(sourceIp, port);

  const handleCopy = (key: 'iptables' | 'powershell' | 'cisco', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div id="firewall-rule-generator" className="border border-white/10 bg-[#070707] p-5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest font-sans">
            Firewall Rules Generation (Mitigation Rules)
          </h3>
        </div>
        <span className="font-mono text-[9px] text-white/40">AUTOMATED_FIREWALL_v1.0</span>
      </div>

      <p className="text-xs text-white/60 mb-4 leading-relaxed font-mono">
        Immediate rules to block traffic from attacker <span className="text-red-400 font-bold">{sourceIp}</span> IP to target port <span className="text-orange-400 font-bold">{port}</span>:
      </p>

      <div className="space-y-4">
        {/* Linux iptables Rule */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] font-black text-amber-500 tracking-wider">
              1. LINUX IPTABLES
            </span>
            <button
              onClick={() => handleCopy('iptables', rules.iptables)}
              className="font-mono text-[9px] uppercase font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 border border-white/10 transition-all cursor-pointer"
            >
              {copiedKey === 'iptables' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  [COPIED]
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/60" />
                  COPY
                </>
              )}
            </button>
          </div>
          <div className="bg-black border border-white/10 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all whitespace-nowrap">
            {rules.iptables}
          </div>
        </div>

        {/* Windows PowerShell Rule */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] font-black text-blue-400 tracking-wider">
              2. WINDOWS POWERSHELL
            </span>
            <button
              onClick={() => handleCopy('powershell', rules.powershell)}
              className="font-mono text-[9px] uppercase font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 border border-white/10 transition-all cursor-pointer"
            >
              {copiedKey === 'powershell' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  [COPIED]
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/60" />
                  COPY
                </>
              )}
            </button>
          </div>
          <div className="bg-black border border-white/10 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all whitespace-nowrap">
            {rules.powershell}
          </div>
        </div>

        {/* Cisco ACL Rule */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] font-black text-purple-400 tracking-wider">
              3. CISCO ACL RULE
            </span>
            <button
              onClick={() => handleCopy('cisco', rules.cisco)}
              className="font-mono text-[9px] uppercase font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 border border-white/10 transition-all cursor-pointer"
            >
              {copiedKey === 'cisco' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  [COPIED]
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/60" />
                  COPY
                </>
              )}
            </button>
          </div>
          <div className="bg-black border border-white/10 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all whitespace-pre">
            {rules.cisco}
          </div>
        </div>
      </div>
    </div>
  );
};
