import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Terminal, 
  Play, 
  History, 
  Trash2, 
  FileText, 
  Check, 
  Copy, 
  RefreshCw, 
  Layers,
  Volume2,
  VolumeX,
  Cpu,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { NETWORK_LOG_PRESETS } from './presets';
import { NetworkLogPreset, AnalysisHistoryItem } from './types';
import { ReportViewer } from './components/ReportViewer';
import { AttackMap } from './components/AttackMap';
import { FirewallGenerator } from './components/FirewallGenerator';
import { ThreatIntelCard } from './components/ThreatIntelCard';
import { RiskDial } from './components/RiskDial';
import { playSocWarningSound } from './utils/cyberUtils';
import { getMockAgentReport } from './utils/mockAgent';

export default function App() {
  const [alertType, setAlertType] = useState<string>('');
  const [rawLog, setRawLog] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<string>('');
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [error, setError] = useState<string>('');
  
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [systemTime, setSystemTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Right side active tab: 'report' or 'firewall'
  const [activeTab, setActiveTab] = useState<'report' | 'firewall'>('report');

  // Mute/unmute state loaded from localStorage
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('soc_analyzer_muted');
    return saved === 'true';
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      localStorage.setItem('soc_analyzer_muted', String(newVal));
      return newVal;
    });
  };

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('soc_analyzer_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: AnalysisHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('soc_analyzer_history', JSON.stringify(newHistory));
  };

  // Clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setSystemTime(`${year}.${month}.${day} | ${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load preset helper
  const handleSelectPreset = (preset: NetworkLogPreset) => {
    setAlertType(preset.alertType);
    setRawLog(preset.rawLog);
    setSelectedPresetId(preset.id);
    setSeverity(preset.severity);
    setError('');
    setActiveTab('report');
  };

  // Parse IPs and Ports for UI sidebar elements
  const extractMetadata = (log: string) => {
    const sourceIpRegex = /(?:Source IP|SRC|from|IP)[:\s]+([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i;
    const targetIpRegex = /(?:Target IP|DST|to)[:\s]+([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i;
    const portRegex = /(?:Target Port|Port|dst port|port)[:\s]+([0-9]+)/i;
    const protocolRegex = /(?:Protocol)[:\s]+([A-Za-z0-9/() -]+)/i;

    const srcIpMatch = log.match(sourceIpRegex);
    const dstIpMatch = log.match(targetIpRegex);
    const portMatch = log.match(portRegex);
    const protocolMatch = log.match(protocolRegex);

    return {
      sourceIp: srcIpMatch ? srcIpMatch[1] : "INFECTED_DEVICE",
      targetIp: dstIpMatch ? dstIpMatch[1] : "INTERNAL_SERVER",
      port: portMatch ? portMatch[1] : "80",
      protocol: protocolMatch ? protocolMatch[1].trim() : "TCP"
    };
  };

  const currentLogContent = rawLog || (selectedPresetId ? NETWORK_LOG_PRESETS.find(p => p.id === selectedPresetId)?.rawLog || '' : '');
  const parsedMetadata = extractMetadata(currentLogContent);

  // Run analysis trigger (using high-fidelity local Mock Agent)
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertType.trim() || !rawLog.trim()) {
      setError('Please enter both the Threat/Alert Type and the Technical Log payload.');
      return;
    }

    setLoading(true);
    setError('');
    setReport('');

    // Simulate standard fast technical scan processing (600ms) for high-end terminal UX
    setTimeout(() => {
      try {
        const generatedReport = getMockAgentReport(alertType, rawLog, severity, selectedPresetId);
        
        setReport(generatedReport);
        setActiveTab('report');

        // Play 8-bit vintage alarm warning sound
        playSocWarningSound(isMuted);

        // Save to history
        const newHistoryItem: AnalysisHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          alertType: alertType,
          severity: severity,
          rawLogSnippet: rawLog.substring(0, 100) + '...',
          report: generatedReport
        };

        saveHistory([newHistoryItem, ...history]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'System error: Log analysis failed.');
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleCopyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const element = document.createElement("a");
    const file = new Blob([`SOC SECURITY REPORT\nSystem Date: ${systemTime}\nThreat Type: ${alertType}\nSeverity: ${severity}\n\n${report}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `SOC-REPORT-${severity}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the entire analysis history?')) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans cyber-grid selection:bg-red-600 selection:text-white pb-4">
      {/* Dynamic scan line effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.6)] pointer-events-none" />

      {/* Header element with Bold Typography theme layout */}
      <header className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-8 pb-6 border-b border-white/15 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2 font-black text-rose-500">
            Central Security Operations Center (SOC) Platform
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-600 animate-pulse shrink-0" />
            IDS Alert Analyzer <span className="text-red-600 font-mono not-italic ml-2 text-2xl md:text-3xl font-black">#882-QX</span>
          </h1>
        </div>
        
        {/* Real-time systems clock with integrated sound warning controller */}
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            onClick={toggleMute}
            id="audio-mute-toggle"
            className={`p-2 border transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[10px] uppercase font-black tracking-wider ${
              isMuted 
                ? 'border-white/10 text-white/40 bg-white/5 hover:text-white/60' 
                : 'border-red-600/50 text-red-500 bg-red-950/20 hover:bg-red-950/40'
            }`}
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
                MUTE
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                AUDIO
              </>
            )}
          </button>

          <div className="text-left md:text-right font-mono flex-1 md:flex-initial">
            <div className="text-sm md:text-base font-black text-white/95 bg-white/5 px-3 py-1.5 border border-white/10">
              {systemTime || 'SYSTEM BOOTING...'}
            </div>
          </div>
        </div>
      </header>

      {/* Main workspace layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs, Presets & TI (Grid spans 5 of 12 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-8 lg:border-r lg:border-white/10 lg:pr-8">
          
          {/* Preset Attack logs list */}
          <section id="presets-panel" className="border border-white/10 p-5 bg-white/[0.01]">
            <h2 className="text-xs uppercase tracking-widest text-white/50 font-black mb-4 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              Sample Network Attack Logs (Presets)
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {NETWORK_LOG_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3.5 border transition-all relative ${
                      isSelected 
                        ? 'border-red-600 bg-red-950/20 shadow-md' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-black tracking-wide text-white uppercase">
                        {preset.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                        preset.severity === 'Critical' ? 'bg-red-950 text-red-400 border-red-800' :
                        preset.severity === 'High' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        preset.severity === 'Medium' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                        'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}>
                        {preset.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 line-clamp-1">{preset.description}</p>
                    {isSelected && (
                      <div className="absolute right-0 bottom-0 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-red-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Core Submit form */}
          <section id="interactive-form-section" className="border border-white/10 p-5 bg-white/[0.01]">
            <h2 className="text-xs uppercase tracking-widest text-white/50 font-black mb-4 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-red-500" />
              System Analysis Portal
            </h2>
            
            <form onSubmit={handleAnalyze} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                  Threat/Alert Type
                </label>
                <input
                  id="threat-type-input"
                  type="text"
                  value={alertType}
                  onChange={(e) => {
                    setAlertType(e.target.value);
                    setSelectedPresetId('');
                  }}
                  placeholder="e.g., Web Application Attack - SQL Injection"
                  className="w-full bg-[#0c0c0c] border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 font-mono placeholder:text-white/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 font-bold">
                    Raw Network Log Payload
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAlertType('');
                      setRawLog('');
                      setSelectedPresetId('');
                      setError('');
                    }}
                    className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  id="raw-log-input"
                  rows={8}
                  value={rawLog}
                  onChange={(e) => {
                    setRawLog(e.target.value);
                    setSelectedPresetId('');
                  }}
                  placeholder="e.g., [2026-07-13 22:15:32] IDS ALERT: SQL Injection attempt. SRC: 192.168.1.105 -> DST: 10.0.0.42..."
                  className="w-full bg-[#0c0c0c] border border-white/15 p-3 text-xs text-emerald-400/90 font-mono focus:outline-none focus:border-red-600 placeholder:text-white/20 leading-relaxed resize-none"
                />
              </div>

              {/* Expected Severity parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                    Expected Severity
                  </label>
                  <select
                    id="severity-selector"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-[#0c0c0c] border border-white/15 px-2 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  >
                    <option value="Critical">CRITICAL</option>
                    <option value="High">HIGH</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="Low">LOW</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    id="analyze-submit-button"
                    disabled={loading}
                    className="w-full bg-red-700 hover:bg-red-600 disabled:bg-neutral-800 text-white font-black tracking-widest text-xs uppercase italic py-3 px-4 border border-red-500/30 hover:border-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        ANALYZING...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        ANALYZE LOG // START
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div id="error-message" className="mt-4 p-4 border border-red-600 bg-red-950/20 text-red-200 text-xs font-mono">
                <strong>ERROR:</strong> {error}
              </div>
            )}
          </section>

          {/* SIEM Threat Intelligence TI Card */}
          <ThreatIntelCard sourceIp={parsedMetadata.sourceIp} alertType={alertType || 'General'} />

          {/* Connection Metadata panel */}
          <section id="parsed-metadata" className="border border-white/10 p-5 bg-white/[0.01]">
            <h2 className="text-xs uppercase tracking-widest text-white/50 font-black mb-3.5">
              Extracted Network Indicators
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 p-3 bg-white/[0.01]">
                <span className="text-[9px] uppercase opacity-40 block mb-0.5">Source</span>
                <span className="font-mono text-sm font-bold text-blue-400 tracking-wide break-all">
                  {parsedMetadata.sourceIp}
                </span>
              </div>
              <div className="border border-white/10 p-3 bg-white/[0.01]">
                <span className="text-[9px] uppercase opacity-40 block mb-0.5">Target</span>
                <span className="font-mono text-sm font-bold text-orange-400 tracking-wide break-all">
                  {parsedMetadata.targetIp}
                </span>
              </div>
              <div className="border border-white/10 p-3 bg-white/[0.01]">
                <span className="text-[9px] uppercase opacity-40 block mb-0.5">Port</span>
                <span className="font-mono text-sm font-bold text-purple-400 tracking-wide">
                  {parsedMetadata.port}
                </span>
              </div>
              <div className="border border-white/10 p-3 bg-white/[0.01]">
                <span className="text-[9px] uppercase opacity-40 block mb-0.5">Protocol</span>
                <span className="font-mono text-sm font-bold text-emerald-400 tracking-wide">
                  {parsedMetadata.protocol}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Right Side: Results, Visual Map, Mitigation Rules, Risk Dial (Grid spans 7 of 12 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {loading ? (
            <div id="analysis-loader" className="flex-1 flex flex-col items-center justify-center p-12 border border-white/10 bg-white/[0.01] min-h-[450px]">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-[spin_2s_infinite_reverse]" />
                <div className="absolute inset-4 border border-dashed border-white/20 rounded-full animate-pulse flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p className="text-sm font-mono tracking-widest text-white/80 animate-pulse">
                [SYSTEM] ANALYZING LOG MATRIX...
              </p>
              <p className="text-xs text-white/40 font-mono mt-2 text-center">
                Generating highly professional SOC Security Report with Gemini AI
              </p>
            </div>
          ) : report ? (
            /* Full Interactive Report Display */
            <div id="report-output-panel" className="flex-1 flex flex-col space-y-6">
              
              {/* Top metadata grid representing Risk Gauge dial and Attack Map */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Visual Semicircular Risk Gauge Dial (Spans 5 columns) */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <RiskDial severity={severity} />
                </div>

                {/* Live Visual Attack Map (Spans 7 columns) */}
                <div className="md:col-span-7">
                  <AttackMap 
                    sourceIp={parsedMetadata.sourceIp}
                    targetIp={parsedMetadata.targetIp}
                    protocol={parsedMetadata.protocol}
                    port={parsedMetadata.port}
                    severity={severity}
                  />
                </div>
              </div>

              {/* Action tabs to swap between report and automated firewall configurations */}
              <div className="flex border-b border-white/15">
                <button
                  onClick={() => setActiveTab('report')}
                  className={`py-3 px-6 font-mono text-xs uppercase tracking-widest font-black border-t-2 transition-all cursor-pointer ${
                    activeTab === 'report'
                      ? 'border-red-600 bg-white/5 text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  📄 SOC SECURITY REPORT
                </button>
                <button
                  onClick={() => setActiveTab('firewall')}
                  className={`py-3 px-6 font-mono text-xs uppercase tracking-widest font-black border-t-2 transition-all cursor-pointer ${
                    activeTab === 'firewall'
                      ? 'border-amber-500 bg-white/5 text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  🛡️ FIREWALL MITIGATION RULES
                </button>
              </div>

              {activeTab === 'report' ? (
                /* Report View */
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-red-500 font-black mb-1 block">
                        ALERT SEVERITY
                      </span>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic select-none">
                        <span className={
                          severity === 'Critical' ? 'text-red-600' :
                          severity === 'High' ? 'text-amber-500' :
                          severity === 'Medium' ? 'text-blue-500' : 'text-emerald-500'
                        }>
                          {severity === 'Critical' ? 'CRITICAL' :
                           severity === 'High' ? 'HIGH' :
                           severity === 'Medium' ? 'MEDIUM' : 'LOW'}
                        </span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="copy-report-button"
                        onClick={handleCopyReport}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer"
                        title="Copy report"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            COPIED
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            COPY
                          </>
                        )}
                      </button>
                      <button
                        id="download-report-button"
                        onClick={handleDownloadReport}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer"
                        title="Download"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        DOWNLOAD (.TXT)
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-[#070707] border border-white/10 p-6 md:p-8 overflow-y-auto max-h-[500px] shadow-inner">
                    {currentLogContent.toLowerCase().includes('simulated') || alertType.toLowerCase().includes('simulated') ? (
                      <div className="mb-6 p-4 bg-blue-950/20 border-l-4 border-blue-500 text-xs font-mono text-blue-300">
                        ⚠️ <strong>SIMULATION TEST:</strong> This data log is entered for security testing/validation purposes. However, the mitigation rules below should be deployed immediately in a real production environment.
                      </div>
                    ) : null}
                    <ReportViewer report={report} />
                  </div>
                </div>
              ) : (
                /* Firewall Rules View */
                <FirewallGenerator sourceIp={parsedMetadata.sourceIp} port={parsedMetadata.port} />
              )}

            </div>
          ) : (
            /* Beautiful empty placeholder state aligned with Bold Typography theme */
            <div id="report-empty-state" className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Default Mock Live Attack Map when empty */}
              <AttackMap 
                sourceIp="185.56.80.22"
                targetIp="10.0.0.45"
                protocol="TCP (SSH)"
                port="22"
                severity="High"
              />

              <div className="flex-1 flex flex-col justify-center border border-white/10 bg-white/[0.01] p-8 md:p-12 text-left relative overflow-hidden min-h-[280px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-300 via-neutral-900 to-black" />
                
                <div className="relative z-10 space-y-5 max-w-xl">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-red-500 font-bold block">
                    BLUE TEAM PLAYBOOK & SECURITY GUIDE
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">
                    SOC INTEL ANALYZER & THREAT MITIGATION PORTAL
                  </h3>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed font-mono">
                    Input suspicious network packets, firewall logs, or raw IDS alerts to generate complete, high-fidelity security reports and production-ready firewall block rules instantly.
                  </p>
                  
                  <div className="border border-white/10 p-4 bg-black/40 font-mono text-xs text-white/50 space-y-2">
                    <p>🔹 Select one of the high-fidelity attack presets on the left pane to explore typical exploit vectors.</p>
                    <p>🔹 Track live node-to-node network packet flows and dynamic risk gauge needle rotations for each alert.</p>
                    <p>🔹 Instantly compile and export automated firewall mitigation scripts tailored for your platforms.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis History log section */}
          <section id="analysis-history-section" className="border border-white/10 p-5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/50 font-black flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-blue-500" />
                Analysis History ({history.length})
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs font-mono text-white/30 italic">No previous analyses recorded in this session.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col justify-between cursor-pointer"
                    onClick={() => {
                      setAlertType(item.alertType);
                      setReport(item.report);
                      setSeverity(item.severity);
                      const matchedPreset = NETWORK_LOG_PRESETS.find(p => p.alertType === item.alertType);
                      if (matchedPreset) {
                        setRawLog(matchedPreset.rawLog);
                        setSelectedPresetId(matchedPreset.id);
                      }
                      setError('');
                      setActiveTab('report');
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-xs font-bold font-mono text-white/90 line-clamp-1">
                        {item.alertType}
                      </span>
                      <span className={`text-[9px] font-mono shrink-0 px-1 border ${
                        item.severity === 'Critical' ? 'bg-red-950/40 text-red-400 border-red-900/60' :
                        item.severity === 'High' ? 'bg-amber-950/40 text-amber-400 border-amber-900/60' :
                        item.severity === 'Medium' ? 'bg-blue-950/40 text-blue-400 border-blue-900/60' :
                        'bg-emerald-950/40 text-emerald-400 border-emerald-900/60'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/40 font-mono mt-1 pt-1.5 border-t border-white/5">
                      <span>{item.timestamp}</span>
                      <span className="text-[9px] text-blue-400 group-hover:underline">Load ➔</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Footer bar with terminal metadata specs to match Bold Typography */}
      <footer className="mt-auto border-t border-white/15 py-5 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              STATUS: SYSTEM ACTIVE
            </span>
            <span className="hidden md:inline text-white/10">|</span>
            <span>AUDIT: BLUE_TEAM_ENTERPRISE_SIEM</span>
            <span className="hidden md:inline text-white/10">|</span>
            <span>MODEL: GEMINI_2.5_FLASH</span>
          </div>
          <div className="text-center md:text-right">
            CONFIDENTIAL WORKSPACE — AUTHORIZED SECURITY PERSONNEL ONLY
          </div>
        </div>
      </footer>
    </div>
  );
}
