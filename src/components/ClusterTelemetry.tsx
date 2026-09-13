import React from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  Layers, 
  Radio, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Cloud,
  Zap,
  Gauge
} from 'lucide-react';
import { ClusterStatus } from '../types';

interface ClusterTelemetryProps {
  status: ClusterStatus;
}

export const ClusterTelemetry: React.FC<ClusterTelemetryProps> = ({ status }) => {
  const containers = [
    {
      name: 'urban-postgis-spatial-db',
      image: 'postgis/postgis:16-3.4-alpine',
      status: 'HEALTHY',
      port: '5432',
      memory: '2.4 GB',
      cpu: '18%',
      role: 'Spatial Database (PostGIS)'
    },
    {
      name: 'fastapi-geospatial-gateway',
      image: 'geoharmonize/fastapi-app:v4.2',
      status: 'HEALTHY',
      port: '8000',
      memory: '780 MB',
      cpu: '12%',
      role: 'FastAPI Gateway & OGC'
    },
    {
      name: 'celery-geodl-worker-01',
      image: 'geoharmonize/celery-pytorch-cuda:12.1',
      status: 'BUSY',
      port: 'N/A',
      memory: '4.8 GB',
      cpu: '74%',
      role: 'LoFTR & SAM Worker (A10G)'
    },
    {
      name: 'celery-geodl-worker-02',
      image: 'geoharmonize/celery-yolov8-cuda:12.1',
      status: 'BUSY',
      port: 'N/A',
      memory: '3.2 GB',
      cpu: '52%',
      role: 'YOLOv8 Worker (T4)'
    },
    {
      name: 'redis-broker-tile-cache',
      image: 'redis:7.2.4-alpine',
      status: 'HEALTHY',
      port: '6379',
      memory: '1.2 GB',
      cpu: '6%',
      role: 'Broker & Tile Cache'
    },
    {
      name: 'react-vite-webgis-portal',
      image: 'geoharmonize/frontend:production',
      status: 'HEALTHY',
      port: '3000',
      memory: '240 MB',
      cpu: '4%',
      role: 'Web-GIS Frontend'
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 p-6 overflow-y-auto text-xs space-y-6">
      
      {/* Infrastructure Top Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Server className="h-5 w-5 text-emerald-400" />
            <span>Cluster Telemetry</span>
          </div>
          <p className="text-slate-400 mt-1 max-w-2xl">
            Hardware telemetry for GPU workers and microservices.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Cloud className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300">Cluster:</span>
            <span className="text-emerald-400 font-bold">{status.k8sStatus}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-slate-300">Pods:</span>
            <span className="text-white font-bold">{status.activePods}</span>
          </div>
        </div>
      </div>

      {/* GPU Nodes Hardware Telemetry (NVIDIA A10G & T4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {status.gpuNodes.map((gpu) => (
          <div key={gpu.name} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span className="font-bold text-white font-mono">{gpu.model}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {gpu.name}
              </span>
            </div>

            {/* VRAM Progress */}
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-slate-400">High-Bandwidth VRAM Allocated:</span>
                <span className="text-slate-200 font-bold">
                  {gpu.vramUsedGb} GB / {gpu.vramTotalGb} GB ({Math.round((gpu.vramUsedGb / gpu.vramTotalGb) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${(gpu.vramUsedGb / gpu.vramTotalGb) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Compute Utilization & Temp */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">CUDA Core Compute</div>
                <div className="text-sm font-bold text-emerald-400">{gpu.gpuUtilPercent}%</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Die Temperature</div>
                <div className="text-sm font-bold text-slate-200">{gpu.temperatureC} °C</div>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80">
              <span className="text-slate-500">Assigned Pipeline:</span>
              <span className="text-purple-300 font-semibold truncate max-w-[220px]">
                {gpu.assignedTask}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PostGIS Master Spatial Database & R-Tree Spatial Index Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Database className="h-4 w-4 text-blue-400" />
            <span>PostGIS Spatial DB</span>
          </div>
          <div className="text-[11px] text-slate-400">{status.postgisStats.version}</div>
          <div className="pt-2 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Database Size:</span>
              <span className="text-slate-200">{status.postgisStats.dbSizeMb} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Pool Connections:</span>
              <span className="text-emerald-400">{status.postgisStats.activeConnections} / 100</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <HardDrive className="h-4 w-4 text-emerald-400" />
            <span>R-Tree GiST Spatial Index</span>
          </div>
          <div className="text-[11px] text-slate-400">Index on master_parcels(geom)</div>
          <div className="pt-2 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Indexed Polygons:</span>
              <span className="text-slate-200">{status.postgisStats.totalParcelsIndexed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cache Hit Ratio:</span>
              <span className="text-emerald-400 font-bold">{status.postgisStats.rTreeIndexHitRatio}%</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Radio className="h-4 w-4 text-amber-400" />
            <span>Celery & Redis Status</span>
          </div>
          <div className="text-[11px] text-slate-400">Redis Broker v7.2.4</div>
          <div className="pt-2 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Worker Processes:</span>
              <span className="text-slate-200">{status.celeryWorkers.length} nodes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Queue Depth:</span>
              <span className="text-amber-400 font-bold">{status.redisQueueDepth} pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Docker Containers Architecture Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="font-bold text-white text-sm flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span>Docker Microservices Containers (Docker Compose / Pods)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-2.5">Container Service</th>
                <th className="p-2.5">Docker Image</th>
                <th className="p-2.5">Port</th>
                <th className="p-2.5">RAM</th>
                <th className="p-2.5">CPU</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Functional Role</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((c) => (
                <tr key={c.name} className="border-b border-slate-800/60 hover:bg-slate-800/30 text-slate-200">
                  <td className="p-2.5 font-bold text-white">{c.name}</td>
                  <td className="p-2.5 text-slate-400">{c.image}</td>
                  <td className="p-2.5 text-emerald-400">{c.port}</td>
                  <td className="p-2.5 text-slate-300">{c.memory}</td>
                  <td className="p-2.5 text-purple-400">{c.cpu}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans text-slate-400 max-w-xs truncate">{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
