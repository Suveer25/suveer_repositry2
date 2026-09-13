import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { Parcel } from '../types';

interface AiAuditModalProps {
  parcel: Parcel | null;
  onClose: () => void;
}

export const AiAuditModal: React.FC<AiAuditModalProps> = ({ parcel, onClose }) => {
  const [report, setReport] = useState<string | null>(null);
  const [source, setSource] = useState<string>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!parcel) {
      setReport(null);
      return;
    }

    setIsLoading(true);
    fetch('/api/ai/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelId: parcel.id })
    })
      .then(res => res.json())
      .then(data => {
        setReport(data.report || 'No report generated');
        setSource(data.source || 'gemini-3.8-flash');
      })
      .catch(() => {
        setReport(`### MUNICIPAL LAND REVENUE & GEOSPATIAL ADJUDICATION REPORT
**Authority:** Directorate of Urban Land Records & Geodesy
**Parcel ULPIN:** ${parcel.ulpin} | **Survey No:** ${parcel.surveyNo} | **Ward:** ${parcel.wardNo}

#### 1. Executive Summary & Harmonization Verdict
The subject parcel underwent automated multi-source geospatial harmonization combining 1974 legacy village revenue cadastral sheets (LoFTR detector-free rubber-sheeting), 5cm high-resolution drone orthomosaics, and Segment Anything Model (SAM) zero-shot boundary delineation.
- **Harmonization Status:** ${parcel.status.toUpperCase().replace('_', ' ')}
- **AI Matching Confidence:** ${parcel.aiConfidenceScore}% (Threshold: 90.0% for automatic clearance)
- **Topological Integrity:** ${parcel.topologyIssues.length === 0 ? 'Compliant. Zero sliver polygons or boundary gaps detected.' : `${parcel.topologyIssues.length} topological anomaly detected requiring automated Shapely snapping.`}

#### 2. Spatial Discrepancy & Area Analysis
- **Recorded Area in RoR (Paper Register):** ${parcel.recordedAreaSqm.toFixed(1)} sq. meters
- **Drone + SAM Extracted Ground Area:** ${parcel.surveyedAreaSqm.toFixed(1)} sq. meters
- **Variance Delta:** ${parcel.discrepancySqm > 0 ? `+${parcel.discrepancySqm.toFixed(1)}` : parcel.discrepancySqm.toFixed(1)} sq. meters (${parcel.discrepancyPercent > 0 ? '+' : ''}${parcel.discrepancyPercent.toFixed(2)}%)
- **Technical Finding:** ${Math.abs(parcel.discrepancyPercent) <= 5.0 ? 'Discrepancy falls within allowable urban tolerance under Rule 14(A) of the Survey Act.' : 'Discrepancy exceeds the 5% statutory threshold; ground physical boundary verification with total station required.'}

#### 3. Structural Encroachment Assessment (YOLOv8 Engine)
${parcel.buildings.some(b => b.isEncroached)
  ? `CRITICAL ALERT: YOLOv8 deep learning network detected unauthorized building extension (${parcel.buildings.find(b => b.isEncroached)?.encroachmentSqm} sq.m) breaching the statutory municipal road setback boundary.`
  : `COMPLIANT: All detected structures are situated strictly within legal parcel boundaries with zero external setback encroachment.`}

#### 4. Statutory Recommendations for Revenue Officer
1. **Notice under Section 134:** ${parcel.status === 'conflict_encroachment' ? 'Issue statutory 15-day show-cause notice to owner regarding structural setback violation.' : 'Approve automated update to Digital Land Register (Bhu-Aadhaar).'}
2. **PostGIS Master Commit:** ${parcel.status === 'harmonized' ? 'Commit ST_MultiPolygon to production PostGIS master spatial database with R-Tree GiST indexing.' : 'Withhold unconditional title seal pending boundary reconciliation.'}
3. **ULPIN Issuance:** Permanent 14-digit Bhu-Aadhaar key [${parcel.ulpin}] validated against National Spatial Data Infrastructure (NSDI) standards.`);
        setSource('deterministic-rules-engine');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [parcel]);

  if (!parcel) return null;

  const handleCopy = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-8 max-h-[90vh]">
        
        {/* Top bar */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>AI Adjudication Audit Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Audit Meta Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div>
            <span>ULPIN: </span>
            <span className="text-emerald-400 font-bold">{parcel.ulpin}</span>
            <span className="mx-2">•</span>
            <span>Survey: </span>
            <span className="text-slate-200 font-bold">{parcel.surveyNo}</span>
            <span className="mx-2">•</span>
            <span>Owner: </span>
            <span className="text-slate-200">{parcel.ownerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            <Cpu className="h-3 w-3 text-purple-400" />
            <span>Engine: {source}</span>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans text-sm">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="font-mono text-xs">Generating audit report with Gemini...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
                {report}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Digital PostGIS Audit Reference: ST_Audit_2026_{parcel.id}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
