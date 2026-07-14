export interface NetworkLogPreset {
  id: string;
  title: string;
  alertType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  rawLog: string;
  description: string;
}

export interface AnalysisRequest {
  alert_type: string;
  raw_log: string;
}

export interface AnalysisResponse {
  success: boolean;
  report?: string;
  error?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  alertType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  rawLogSnippet: string;
  report: string;
}
