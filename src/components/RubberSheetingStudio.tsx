import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Terminal, 
  RefreshCw, 
  Plus, 
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Upload
} from 'lucide-react';
import { TiePoint, DroneImageData } from '../types';

interface RubberSheetingStudioProps {
  tiePoints: TiePoint[];
  onAddTiePoint: (point: { sourceX: number; sourceY: number; targetLng: number; targetLat: number }) => void;
  onTriggerWarp: () => void;
  droneImage?: DroneImageData | null;
  onOpenUploadDrone?: () => void;
}

export const RubberSheetingStudio: React.FC<RubberSheetingStudioProps> = ({
  tiePoints,
  onAddTiePoint,
  onTriggerWarp,
  droneImage,
  onOpenUploadDrone
}) => {
  const [selectedTransformation, setSelectedTransformation] = useState<'TPS' | 'AFFINE' | 'PROJECTIVE' | 'POLYNOMIAL_2'>('TPS');
  const [opencvFilter, setOpencvFilter] = useState<'RAW' | 'CLAHE' | 'BILATERAL' | 'CANNY'>('CLAHE');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  // Mean Root Mean Square Error (RMSE) in meters
  const meanRmse = (tiePoints.reduce((acc, p) => acc + p.residualErrorMeters, 0) / (tiePoints.length || 1)).toFixed(3);

  const handleSimulateWarp = () => {
    setIsWarping(true);
    setTimeout(() => {
      setIsWarping(false);
      onTriggerWarp();
    }, 1800);
  };

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex flex-col lg:flex-row overflow-hidden text-xs">
      
      {/* Left Configuration & Telemetry Sidebar */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GitCompare className="h-4 w-4 text-emerald-400" />
            <span>Rubber-Sheeting</span>
          </div>
          <p className="text-slate-400 mt-0.5">
            Homography Alignment & Keypoint Warping
          </p>
        </div>

        {/* Transformation Model Selector */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-slate-300 font-semibold block">Warping Algorithm:</label>
          <select 
            aria-label="Warping Algorithm"
            value={selectedTransformation}
            onChange={(e) => setSelectedTransformation(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="TPS">Thin Plate Spline (TPS)</option>
            <option value="PROJECTIVE">Projective Homography</option>
            <option value="AFFINE">Affine Transform (6-Param)</option>
            <option value="POLYNOMIAL_2">2nd-Order Polynomial</option>
          </select>
        </div>

        {/* OpenCV Raster Preprocessing Pipeline */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Pre-processing</span>
            <span className="text-[10px] text-purple-400 font-mono">OpenCV</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {[
              { id: 'RAW', label: 'Raw Sheet' },
              { id: 'CLAHE', label: 'CLAHE' },
              { id: 'BILATERAL', label: 'Bilateral' },
              { id: 'CANNY', label: 'Canny Edges' }
            ].map((filt) => (
              <button
                key={filt.id}
                onClick={() => setOpencvFilter(filt.id as any)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                  opencvFilter === filt.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {filt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keypoint Alignment Telemetry */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Residual Error (RMSE)</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {Number(meanRmse) < 0.15 ? 'PASSED (<0.15m)' : 'ATTENTION'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Mean Residual:</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {meanRmse} m
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Correspondences:</span>
              <span className="font-mono text-slate-200">{tiePoints.length} GCPs</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="font-mono text-emerald-400">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Hardware:</span>
              <span className="font-mono text-purple-400">NVIDIA A10G</span>
            </div>
          </div>
        </div>

        {/* Tie Points Table */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Control Points</span>
            <button 
              onClick={() => onAddTiePoint({ sourceX: 250, sourceY: 350, targetLng: 73.8550, targetLat: 18.5224 })}
              className="text-[10px] flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add GCP
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
            {tiePoints.map((tp) => (
              <div 
                key={tp.id}
                onClick={() => setSelectedPointId(tp.id)}
                className={`p-2 rounded border flex items-center justify-between transition-colors cursor-pointer ${
                  selectedPointId === tp.id 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{tp.id}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">{tp.type}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    px: ({tp.sourceX}, {tp.sourceY})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">{(tp.confidence * 100).toFixed(1)}%</div>
                  <div className="text-[10px] text-slate-400">±{tp.residualErrorMeters}m</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSimulateWarp}
          disabled={isWarping}
          className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {isWarping ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Executing Warp...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run TPS Warp</span>
            </>
          )}
        </button>

      </div>

      {/* Dual Side-by-Side Visualizer */}
      <div className="flex-1 h-full bg-slate-950 p-4 flex flex-col gap-3 overflow-hidden">
        
        {/* Top Viewport Header */}
        <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-amber-400 font-bold">Source:</span>
            <span className="text-slate-300">1974 Sheet</span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
          <div className="flex items-center gap-2 font-mono">
            <span className="text-emerald-400 font-bold">Target:</span>
            <span className="text-slate-300">Drone Orthomosaic</span>
          </div>
        </div>

        {/* Dual Canvas Stage */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-60px)]">
          
          {/* Left Canvas: Legacy Village Sheet */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
            <div className="p-2.5 bg-amber-950/30 border-b border-amber-900/40 flex items-center justify-between font-mono text-amber-300 font-semibold">
              <span>Historical Sheet</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">{opencvFilter}</span>
            </div>

            <div className="relative flex-1 bg-amber-950/20 p-4 flex items-center justify-center">
              {/* Simulated Paper Grain & Vintage Boundaries */}
              <svg width="100%" height="100%" viewBox="0 0 500 400" className="w-full h-full">
                <rect width="500" height="400" fill="#2d2215" opacity="0.6" />
                
                {/* Paper Folds */}
                <line x1="250" y1="0" x2="250" y2="400" stroke="#451a03" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                <line x1="0" y1="200" x2="500" y2="200" stroke="#451a03" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

                {/* Scanned Ink Boundary Lines */}
                <path d="M 60 80 L 220 70 L 210 240 L 50 230 Z" fill="none" stroke="#d97706" strokeWidth="2.5" />
                <text x="120" y="160" fill="#f59e0b" fontSize="16" fontWeight="bold" fontFamily="monospace">१०४/१</text>

                <path d="M 220 70 L 440 90 L 420 250 L 210 240 Z" fill="none" stroke="#d97706" strokeWidth="2.5" />
                <text x="310" y="160" fill="#f59e0b" fontSize="16" fontWeight="bold" fontFamily="monospace">१०४/२</text>

                <path d="M 50 230 L 210 240 L 200 370 L 40 360 Z" fill="none" stroke="#d97706" strokeWidth="2.5" />
                <text x="110" y="310" fill="#f59e0b" fontSize="16" fontWeight="bold" fontFamily="monospace">१०५</text>

                {/* LoFTR Keypoints Markers on Legacy Sheet */}
                {tiePoints.map((tp) => (
                  <g key={`legacy-pt-${tp.id}`}>
                    <circle cx={tp.sourceX} cy={tp.sourceY} r="7" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx={tp.sourceX} cy={tp.sourceY} r="2.5" fill="#f59e0b" />
                    <text x={tp.sourceX + 9} y={tp.sourceY + 4} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {tp.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Right Canvas: Georeferenced Drone Orthomosaic */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
            <div className="p-2.5 bg-emerald-950/30 border-b border-emerald-900/40 flex items-center justify-between font-mono text-emerald-300 font-semibold">
              <div className="flex items-center gap-2">
                <span>Drone Orthomosaic</span>
                {droneImage && (
                  <span className="text-[10px] text-slate-400 font-normal truncate max-w-[130px]">
                    ({droneImage.name.split('.')[0]})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onOpenUploadDrone && (
                  <button
                    onClick={onOpenUploadDrone}
                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Upload Drone Image from File Explorer"
                  >
                    <Upload className="h-3 w-3 text-emerald-400" />
                    <span>Upload</span>
                  </button>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">Warped</span>
              </div>
            </div>

            <div className="relative flex-1 bg-slate-950 p-4 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 500 400" className="w-full h-full">
                {/* Drone Orthophoto Texture / Technical Basemap */}
                {droneImage ? (
                  <image 
                    href={droneImage.url} 
                    x="0" 
                    y="0" 
                    width="500" 
                    height="400" 
                    preserveAspectRatio="xMidYMid slice" 
                    opacity={droneImage.opacity ?? 0.85} 
                  />
                ) : (
                  <rect width="500" height="400" fill="#0b1120" />
                )}

                {/* Technical Grid Overlay */}
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="300" x2="500" y2="300" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                <line x1="150" y1="0" x2="150" y2="400" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                <line x1="350" y1="0" x2="350" y2="400" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />

                {/* Roads */}
                <path d="M 0 200 Q 250 195 500 205" stroke="#1e293b" strokeWidth="26" fill="none" opacity={droneImage ? 0.6 : 1} />
                <path d="M 0 200 Q 250 195 500 205" stroke="#475569" strokeWidth="1" strokeDasharray="8 6" fill="none" opacity={droneImage ? 0.7 : 1} />

                {/* Warped Registered Cadastral Boundaries */}
                <path d="M 70 85 L 230 78 L 218 244 L 58 236 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2.5" />
                <text x="130" y="160" fill="#10b981" fontSize="14" fontWeight="bold" fontFamily="monospace">104/1</text>

                <path d="M 230 78 L 450 95 L 432 254 L 218 244 Z" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2.5" />
                <text x="320" y="160" fill="#f43f5e" fontSize="14" fontWeight="bold" fontFamily="monospace">104/2 [ENC]</text>

                {/* LoFTR Matched Points on Drone Imagery */}
                {tiePoints.map((tp) => {
                  const targetX = tp.sourceX + 12; // Simulated slight distortion adjustment
                  const targetY = tp.sourceY + 8;
                  return (
                    <g key={`target-pt-${tp.id}`}>
                      <circle cx={targetX} cy={targetY} r="7" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
                      <circle cx={targetX} cy={targetY} r="2.5" fill="#10b981" />
                      <text x={targetX + 9} y={targetY + 4} fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {tp.id} ({tp.residualErrorMeters}m)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
