import React from 'react';
import { Shield, ShieldAlert, Terminal, ShieldCheck } from 'lucide-react';

interface ReportViewerProps {
  report: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  // Parse report into structured sections
  const lines = report.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let currentSection: 'incident' | 'technical' | 'urgent' | 'general' = 'general';
  let sectionLines: string[] = [];

  const flushSection = (key: number) => {
    if (sectionLines.length === 0) return;

    const content = sectionLines.join('\n');
    sectionLines = [];

    switch (currentSection) {
      case 'incident':
        renderedElements.push(
          <div key={`section-${key}`} id={`section-incident`} className="mb-6 p-5 border border-white/10 bg-white/[0.02] shadow-md">
            <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest text-red-500 font-bold mb-3 font-sans">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              🚨 1. Incident Description
            </h3>
            <div className="text-white/80 text-sm leading-relaxed space-y-2">
              {formatContent(content)}
            </div>
          </div>
        );
        break;

      case 'technical':
        renderedElements.push(
          <div key={`section-${key}`} id={`section-technical`} className="mb-6 p-5 border border-white/10 bg-[#0c0c0c] shadow-md">
            <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest text-blue-400 font-bold mb-3 font-sans">
              <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
              🔍 2. Technical Analysis
            </h3>
            <div className="text-emerald-400/90 text-xs leading-relaxed font-mono space-y-2 bg-[#050505] p-4 border border-white/5">
              {formatContent(content)}
            </div>
          </div>
        );
        break;

      case 'urgent':
        renderedElements.push(
          <div key={`section-${key}`} id={`section-urgent`} className="mb-6 p-5 border border-white/10 bg-white/[0.02] shadow-md">
            <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest text-amber-400 font-bold mb-3 font-sans">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              🛡️ 3. Urgent Actions
            </h3>
            <div className="text-white/80 text-sm leading-relaxed space-y-3">
              {formatContent(content, true)}
            </div>
          </div>
        );
        break;

      default:
        renderedElements.push(
          <div key={`section-${key}`} id={`section-general`} className="mb-4 text-white/80 text-sm leading-relaxed space-y-2">
            {formatContent(content)}
          </div>
        );
    }
  };

  const formatContent = (text: string, isUrgentActions = false) => {
    let orderCounter = 1;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      if (!trimmed) return <div key={idx} className="h-1" />;

      // Match bullets
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const itemText = trimmed.substring(1).trim();
        
        if (isUrgentActions) {
          // Special high-contrast layout for urgent items
          const colors = [
            'border-red-600',
            'border-orange-500',
            'border-blue-500',
            'border-amber-500'
          ];
          const borderClass = colors[(orderCounter - 1) % colors.length];
          const numStr = String(orderCounter++).padStart(2, '0');
          
          return (
            <div key={idx} className={`flex items-start gap-4 bg-white/5 p-4 border-l-4 ${borderClass} mb-2`}>
              <div className="w-6 h-6 bg-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 text-white">
                {numStr}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/90 font-medium">
                  {parseBold(itemText)}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-white/40 mt-2 flex-shrink-0" />
            <span className="text-white/80 text-xs md:text-sm leading-relaxed">
              {parseBold(itemText)}
            </span>
          </div>
        );
      }

      // Match ordered items like "1.", "2."
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (orderedMatch) {
        if (isUrgentActions) {
          const colors = [
            'border-red-600',
            'border-orange-500',
            'border-blue-500',
            'border-amber-500'
          ];
          const borderClass = colors[(orderCounter - 1) % colors.length];
          const numStr = String(orderedMatch[1]).padStart(2, '0');
          orderCounter++;
          
          return (
            <div key={idx} className={`flex items-start gap-4 bg-white/5 p-4 border-l-4 ${borderClass} mb-2`}>
              <div className="w-6 h-6 bg-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 text-white">
                {numStr}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/90 font-medium">
                  {parseBold(orderedMatch[2])}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div key={idx} className="flex items-start gap-2.5 my-2 pl-1">
            <span className="font-mono font-bold text-white/60 min-w-[1.25rem] text-right">{orderedMatch[1]}.</span>
            <span className="text-white/80 text-xs md:text-sm leading-relaxed">
              {parseBold(orderedMatch[2])}
            </span>
          </div>
        );
      }

      // Default line
      return (
        <p key={idx} className="text-white/80 text-xs md:text-sm leading-relaxed my-1">
          {parseBold(trimmed)}
        </p>
      );
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-black text-white bg-white/10 px-1 py-0.5 font-mono text-[11px] uppercase tracking-wide">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  let elementKey = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    if (upperLine.includes('1. INCIDENT DESCRIPTION') || upperLine.includes('1. HADİSƏNİN TƏSVİRİ')) {
      flushSection(elementKey++);
      currentSection = 'incident';
    } else if (upperLine.includes('2. TECHNICAL ANALYSIS') || upperLine.includes('2. TEXNİKİ ANALİZ')) {
      flushSection(elementKey++);
      currentSection = 'technical';
    } else if (upperLine.includes('3. URGENT ACTIONS') || upperLine.includes('3. TƏXİRƏSİZ TƏDBİRLƏR')) {
      flushSection(elementKey++);
      currentSection = 'urgent';
    } else {
      sectionLines.push(line);
    }
  }
  flushSection(elementKey++);

  return (
    <div className="space-y-1">
      {renderedElements}
    </div>
  );
};
