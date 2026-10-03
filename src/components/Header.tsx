import React, { useState } from 'react';
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
  Camera,
  Receipt,
  Building2,
  ChevronDown,
  FileText
} from 'lucide-react';
import { Parcel, DroneImageData } from '../types';
import { WardSelectModal } from './WardSelectModal';
import { URBAN_WARDS_LIST } from '../data/urbanWardsList';

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
  onOpenUploadTaxRecord?: () => void;
  hasTaxRecords?: boolean;
  onOpenDatasetPdf?: () => void;
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
  droneImage,
  onOpenUploadTaxRecord,
  hasTaxRecords,
  onOpenDatasetPdf
}) => {
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);

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
          {/* Large Option to Select Ward / All Urban Wards Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            
            {/* Primary Large {All Urban Wards} Button */}
            <button 
              onClick={() => setIsWardModalOpen(true)}
              id="header-all-urban-wards-button"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                selectedWard === 'ALL'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 ring-1 ring-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
              }`}
              title="Click to open 24 Urban Wards selection grid"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="font-bold whitespace-nowrap">
                {selectedWard === 'ALL' ? 'All Urban Wards' : selectedWard}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/50 text-slate-300 border border-slate-700/50 flex items-center gap-0.5">
                <span>24 Wards</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </span>
            </button>

            {/* Tactile Quick-Select Ward Buttons */}
            <div className="hidden xl:flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectWard('ALL')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedWard === 'ALL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="View all 24 Urban Wards"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onSelectWard('Ward 14')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedWard.toLowerCase() === 'ward 14'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Ward 14 (Shivajinagar Urban Central)"
              >
                Ward 14
              </button>
              <button
                type="button"
                onClick={() => onSelectWard('Ward 15')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedWard.toLowerCase() === 'ward 15'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Ward 15 (Aundh Extension)"
              >
                Ward 15
              </button>
              <button
                type="button"
                onClick={() => onSelectWard('Ward 16')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedWard.toLowerCase() === 'ward 16'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Ward 16 (Kothrud Metro Corridor)"
              >
                Ward 16
              </button>
            </div>

            {/* Direct Quick Dropdown for all 24 Wards */}
            <select 
              aria-label="Select Revenue Ward from 24 Urban Wards"
              value={selectedWard}
              onChange={(e) => onSelectWard(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer max-w-[130px] truncate"
              title="Select directly from all 24 Urban Wards"
            >
              <option value="ALL">🌐 All Urban Wards</option>
              <optgroup label="Central Revenue Circle">
                <option value="Ward 14">Ward 14 (Shivajinagar Urban)</option>
                <option value="Ward 01">Ward 01 (Kasba Peth Heritage)</option>
                <option value="Ward 02">Ward 02 (Bhavani Peth Wholesale)</option>
                <option value="Ward 03">Ward 03 (Somwar Peth Terminal)</option>
                <option value="Ward 04">Ward 04 (Budhwar Peth Circle)</option>
              </optgroup>
              <optgroup label="West Tech Corridor">
                <option value="Ward 15">Ward 15 (Aundh Extension)</option>
                <option value="Ward 05">Ward 05 (Baner-Balewadi Smart City)</option>
                <option value="Ward 06">Ward 06 (Hinjawadi Phase 1 Tech)</option>
                <option value="Ward 07">Ward 07 (Pashan Lake Ecology)</option>
              </optgroup>
              <optgroup label="South Metro Zone">
                <option value="Ward 16">Ward 16 (Kothrud Metro Corridor)</option>
                <option value="Ward 08">Ward 08 (Karve Nagar Residential)</option>
                <option value="Ward 09">Ward 09 (Sinhagad Road Riverside)</option>
                <option value="Ward 10">Ward 10 (Dhankawadi-Katraj Lake)</option>
                <option value="Ward 11">Ward 11 (Sahakar Nagar Hills)</option>
              </optgroup>
              <optgroup label="East Airport & IT Corridor">
                <option value="Ward 12">Ward 12 (Viman Nagar Airport)</option>
                <option value="Ward 13">Ward 13 (Kalyani Nagar Tech)</option>
                <option value="Ward 17">Ward 17 (Koregaon Park Heritage)</option>
                <option value="Ward 18">Ward 18 (Wadgaon Sheri Expansion)</option>
                <option value="Ward 19">Ward 19 (Hadapsar Industrial)</option>
                <option value="Ward 20">Ward 20 (Magarpatta Cyber City)</option>
              </optgroup>
              <optgroup label="North & Cantonment">
                <option value="Ward 21">Ward 21 (Cantonment Board)</option>
                <option value="Ward 22">Ward 22 (Yerawada Central)</option>
                <option value="Ward 23">Ward 23 (Vishrantwadi Defense)</option>
                <option value="Ward 24">Ward 24 (Dhanori Urban Extension)</option>
              </optgroup>
            </select>

          </div>

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
          {/* AI Drone Border Studio Trigger */}
          {onOpenUploadDrone && (
            <button
              onClick={onOpenUploadDrone}
              id="header-upload-drone-btn"
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                droneImage
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/40'
              }`}
              title="Upload Drone Image & Run AI Model to Detect and Bound Borders"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {droneImage ? 'AI Drone Borders' : 'Upload Drone & Bound'}
              </span>
              {droneImage && (
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  {droneImage.detectedBorders?.length ? `${droneImage.detectedBorders.length} Bounded` : 'Loaded'}
                </span>
              )}
            </button>
          )}

          {onOpenUploadTaxRecord && (
            <button
              onClick={onOpenUploadTaxRecord}
              id="header-upload-tax-btn"
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                hasTaxRecords
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500/40'
              }`}
              title="Upload Municipal Tax Record from File Explorer (.CSV, .JSON, .PDF, .XLSX)"
            >
              <Receipt className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Upload Tax Record</span>
              {hasTaxRecords && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Tax records active"></span>
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

          {onOpenDatasetPdf && (
            <button
              onClick={onOpenDatasetPdf}
              id="header-datasets-pdf-btn"
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer border border-emerald-400/30"
              title="View, Preview, and Download Drone & Cadastral Datasets Catalog in PDF Format"
            >
              <FileText className="h-3.5 w-3.5 text-white" />
              <span className="font-semibold">Datasets (PDF)</span>
              <span className="hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-300/40">
                Ready
              </span>
            </button>
          )}
        </div>

      </div>

      {/* Large Ward Selection Modal (24 Urban Wards & All Urban Wards Grid) */}
      <WardSelectModal 
        isOpen={isWardModalOpen}
        onClose={() => setIsWardModalOpen(false)}
        selectedWard={selectedWard}
        onSelectWard={onSelectWard}
        totalParcelsCount={parcels.length > 5 ? parcels.length : 14850}
      />
    </header>
  );
};
