import React from 'react';
import { 
  Database, 
  Cpu, 
  Layers, 
  FileCheck2, 
  Sparkles, 
  Search,
  Globe,
  Radio,
  Download,
  Upload,
  Camera
} from 'lucide-react';
import { Parcel, DroneImageData } from '../types';

interface HeaderProps {
  parcels: Parcel[];
  selectedWard: string;
  onSelectWard: (ward: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectParcel: (parcel: Parcel) => void;
  onOpenCertificate: () => void;
  onOpenNewJob: () => void;
  onOpenUploadDrone?: () => void;
  droneImage?: DroneImageData | null;
}

export const Header: React.FC<HeaderProps> = ({
  parcels,
  selectedWard,
  onSelectWard,
  searchQuery,
  onSearchChange,
  onSelectParcel,
  onOpenCertificate,
  onOpenNewJob,
  onOpenUploadDrone,
  droneImage
}) => {
  const matchingParcel = searchQuery.trim() 
    ? parcels.find(p => 
        p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                GeoHarmonize
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                  v4.2
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Cadastral Intelligence & Land Record Harmonization
            </p>
          </div>
        </div>

        {/* Live System Status Telemetry Pills */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300" title="PostgreSQL 16.3 + PostGIS">
            <Database className="h-3.5 w-3.5 text-blue-400" />
            <span>PostGIS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300" title="GPU Cluster">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>A10G</span>
            <span className="text-emerald-400">78%</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300" title="Celery Workers">
            <Radio className="h-3.5 w-3.5 text-amber-400" />
            <span>Celery: 3</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300" title="CRS">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>EPSG:32643</span>
          </div>
        </div>

        {/* Search, Filter & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ward Selector */}
          <select 
            aria-label="Select Revenue Ward"
            value={selectedWard}
            onChange={(e) => onSelectWard(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="ALL">All Urban Wards</option>
            <option value="Ward 14">Ward 14 (Shivajinagar Urban)</option>
            <option value="Ward 15">Ward 15 (Aundh Extension)</option>
            <option value="Ward 16">Ward 16 (Kothrud Metro Corridor)</option>
          </select>

          {/* Quick Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search ULPIN, Survey No, Owner..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 w-48 sm:w-56 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
            {matchingParcel && searchQuery.trim() && (
              <button
                onClick={() => {
                  onSelectParcel(matchingParcel);
                  onSearchChange('');
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded hover:bg-emerald-500/30 cursor-pointer"
              >
                Go to {matchingParcel.surveyNo}
              </button>
            )}
          </div>

          {/* Actions */}
          {onOpenUploadDrone && (
            <button
              onClick={onOpenUploadDrone}
              id="header-upload-drone-btn"
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                droneImage?.sourceType === 'custom_upload'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/40'
              }`}
              title="Upload Drone Image from File Explorer"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Upload Drone Image</span>
              {droneImage?.sourceType === 'custom_upload' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          )}

          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Run Pipeline</span>
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Generate Official Bhu-Aadhaar Land Titling Certificate"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Bhu-Aadhaar</span>
          </button>
        </div>

      </div>
    </header>
  );
};
