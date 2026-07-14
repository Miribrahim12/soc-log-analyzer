/**
 * SOC Cybersecurity Utility Helpers
 */

export interface ThreatIntel {
  country: string;
  flag: string;
  reputationScore: number;
  isp: string;
  isTorVpn: 'YES' | 'NO';
  riskLabel: 'Critical' | 'High' | 'Medium' | 'Low';
}

// Generate deterministic Threat Intelligence based on IP address string
export function getThreatIntel(ip: string, alertType: string): ThreatIntel {
  if (!ip || ip === "YOLUXMUŞ_CİHAZ" || ip === "INFECTED_DEVICE") {
    return {
      country: "Local Subnet",
      flag: "💻",
      reputationScore: 0,
      isp: "Internal Infrastructure (LAN)",
      isTorVpn: "NO",
      riskLabel: "Low"
    };
  }

  // Simple hashing function to make scores look realistic but stable
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ip.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const countries = [
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "USA", flag: "🇺🇸" },
    { name: "China", flag: "🇨🇳" },
    { name: "Russia", flag: "🇷🇺" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Ukraine", flag: "🇺🇦" },
    { name: "Romania", flag: "🇷🇴" }
  ];

  const isps = [
    "DigitalOcean LLC",
    "Chunghwa Telecom",
    "OVH SAS",
    "M247 Europe",
    "Hostkey B.V.",
    "Chinastet Telecommunications",
    "Tor Onion router pool",
    "NordVPN Server Pool"
  ];

  const countryObj = countries[hash % countries.length];
  const isp = isps[(hash >> 2) % isps.length];
  
  // Higher scores represent more malicious reputations
  let reputationScore = 50 + (hash % 49); // 50 to 98
  
  // Set Tor VPN exit nodes based on attack types or specific ISPs
  const isTorVpn = (alertType.toLowerCase().includes('beacon') || alertType.toLowerCase().includes('brute') || isp.toLowerCase().includes('tor') || isp.toLowerCase().includes('vpn')) ? "YES" : "NO";
  
  if (isTorVpn === "YES") {
    reputationScore = Math.min(99, reputationScore + 10);
  }

  let riskLabel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
  if (reputationScore >= 90) riskLabel = 'Critical';
  else if (reputationScore >= 75) riskLabel = 'High';
  else if (reputationScore >= 45) riskLabel = 'Medium';
  else riskLabel = 'Low';

  return {
    country: countryObj.name,
    flag: countryObj.flag,
    reputationScore,
    isp,
    isTorVpn,
    riskLabel
  };
}

// Generate ready-to-copy firewall mitigation rules
export interface FirewallRules {
  iptables: string;
  powershell: string;
  cisco: string;
}

export function generateFirewallRules(sourceIp: string, port: string): FirewallRules {
  const cleanIp = sourceIp && sourceIp !== "YOLUXMUŞ_CİHAZ" && sourceIp !== "INFECTED_DEVICE" ? sourceIp : "192.168.1.100";
  const cleanPort = port && port !== "80/443" ? port : "80";

  return {
    iptables: `iptables -A INPUT -s ${cleanIp} -p tcp --dport ${cleanPort} -j DROP`,
    powershell: `New-NetFirewallRule -DisplayName "SOC_BLOCK_${cleanIp}" -Direction Inbound -Action Block -RemoteAddress "${cleanIp}" -Protocol TCP -LocalPort ${cleanPort}`,
    cisco: `access-list 101 deny tcp host ${cleanIp} any eq ${cleanPort}\naccess-list 101 permit ip any any`
  };
}

// Play Retro 8-bit SOC warning sound using Web Audio API
export function playSocWarningSound(muted: boolean) {
  if (muted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    // First alarm beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.15);
    
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start();
    osc1.stop(ctx.currentTime + 0.18);

    // Second alarm beep (staggered slightly)
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(980, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.start();
        osc2.stop(ctx.currentTime + 0.18);
      } catch (e) {
        console.warn("Failed second beep", e);
      }
    }, 150);

  } catch (err) {
    console.warn("Web Audio API not allowed or supported yet.", err);
  }
}
