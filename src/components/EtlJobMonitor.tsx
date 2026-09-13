import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileCode2, 
  Cpu, 
  Database,
  Layers
} from 'lucide-react';
import { ETLJob } from '../types';

interface EtlJobMonitorProps {
  jobs: ETLJob[];
  onTriggerJob: (jobData: { module: any; jobName: string; inputDataset: string; outputFormat: string }) => void;
}

export const EtlJobMonitor: React.FC<EtlJobMonitorProps> = ({
  jobs,
  onTriggerJob
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // New Job Form State
  const [newJobModule, setNewJobModule] = useState<'GDAL_REPROJECT' | 'LOFTR_RUBBERSHEET' | 'SAM_SEGMENTATION' | 'YOLOV8_INFERENCE' | 'TOPOLOGY_AUDIT' | 'RASTERIO_TILING'>('GDAL_REPROJECT');
  const [inputDataset, setInputDataset] = useState('municipal_land_records_cadastre.dxf');
  const [outputFormat, setOutputFormat] = useState('PostGIS ST_MultiPolygon (EPSG:32643)');

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerJob({
      module: newJobModule,
      jobName: `ETL_Async_${newJobModule}_${Date.now().toString().slice(-4)}.py`,
      inputDataset,
      outputFormat
    });
    setShowNewJobModal(false);
  };

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex flex-col lg:flex-row overflow-hidden text-xs">
      
      {/* Left Column: Celery Jobs Task Queue */}
      <div className="w-full lg:w-1/2 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>ETL Job Queue</span>
            </div>
            <p className="text-slate-400 mt-0.5">
              Asynchronous Pipeline Workers
            </p>
          </div>

          <button
            onClick={() => setShowNewJobModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Task Queue Cards */}
        <div className="space-y-2">
          {jobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800 border-emerald-500/50 shadow-md' 
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">
                      {job.jobName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                      {job.module}
                    </span>
                  </div>

                  {job.status === 'completed' && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </span>
                  )}
                  {job.status === 'running' && (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {job.progress}%
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      job.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
                  <span className="truncate max-w-[200px]">In: {job.inputDataset}</span>
                  <span>{job.durationSeconds ? `${job.durationSeconds}s elapsed` : 'Running...'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Live Terminal Execution Logs & Worker Metrics */}
      <div className="w-full lg:w-1/2 bg-slate-950 p-4 flex flex-col space-y-3 overflow-hidden">
        
        {selectedJob ? (
          <>
            {/* Selected Job Header & Hardware Allocation */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-emerald-400" />
                  <span>{selectedJob.jobName}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Task ID: <span className="font-mono text-slate-300">{selectedJob.id}</span> • Started: {selectedJob.startedAt}
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <div className="text-purple-400 font-semibold">
                  {selectedJob.metrics?.gpuAllocation || 'CPU-Worker-Pool'}
                </div>
                <div className="text-slate-400">
                  {selectedJob.metrics?.featuresProcessed ? `${selectedJob.metrics.featuresProcessed} features` : 'Processing tiles'}
                </div>
              </div>
            </div>

            {/* Live Terminal Log Viewer */}
            <div className="flex-1 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
              <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Worker Logs</span>
                </div>
                <span className="text-emerald-400">Status: {selectedJob.status.toUpperCase()}</span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-slate-950/60 selection:bg-emerald-500/30">
                {selectedJob.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex gap-2">
                    <span className="text-slate-600 select-none">{String(lIdx + 1).padStart(2, '0')}</span>
                    <span className={
                      log.includes('[GDAL') ? 'text-blue-300' :
                      log.includes('[LoFTR') || log.includes('[PyTorch') ? 'text-purple-300' :
                      log.includes('[Shapely') || log.includes('[Topology') ? 'text-amber-300' :
                      log.includes('[PostGIS') ? 'text-emerald-300' :
                      log.includes('[Quality') ? 'text-teal-300 font-bold' : 'text-slate-300'
                    }>
                      {log}
                    </span>
                  </div>
                ))}
                {selectedJob.status === 'running' && (
                  <div className="flex items-center gap-2 text-amber-400 animate-pulse pt-2">
                    <span>▶</span>
                    <span>Waiting for worker output...</span>
                  </div>
                )}
              </div>

              <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Output: {selectedJob.outputFormat}</span>
                <span>Broker: Redis</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a job to inspect worker logs.
          </div>
        )}

      </div>

      {/* New Task Trigger Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="h-4 w-4 text-emerald-400" />
                <span>New ETL Task</span>
              </h3>
              <button 
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Geospatial Processing Module:</label>
                <select 
                  aria-label="Geospatial Processing Module"
                  value={newJobModule}
                  onChange={(e) => setNewJobModule(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="GDAL_REPROJECT">GDAL/OGR - CRS Reprojection & Format Conversion</option>
                  <option value="LOFTR_RUBBERSHEET">PyTorch/LoFTR - Cadastral Rubber-Sheeting</option>
                  <option value="SAM_SEGMENTATION">SAM ViT-H - Zero-Shot Parcel Boundary Delineation</option>
                  <option value="YOLOV8_INFERENCE">YOLOv8x - Building & Encroachment Detection</option>
                  <option value="TOPOLOGY_AUDIT">Shapely/GeoPandas - Topology Cleaning & Sliver Dissolve</option>
                  <option value="RASTERIO_TILING">Rasterio & Fiona - COG XYZ Tile Generation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Input Dataset Filename:</label>
                <input 
                  type="text"
                  value={inputDataset}
                  onChange={(e) => setInputDataset(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Output Spec:</label>
                <input 
                  type="text"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Dispatch Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
