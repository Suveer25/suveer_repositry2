import React, { useState, useMemo } from 'react';
import { 
  X, 
  Building2, 
  Search, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Grid
} from 'lucide-react';
import { URBAN_WARDS_LIST, WARD_ZONES, UrbanWardItem } from '../data/urbanWardsList';

interface WardSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWard: string;
  onSelectWard: (wardNo: string) => void;
  totalParcelsCount?: number;
}

export const WardSelectModal: React.FC<WardSelectModalProps> = ({
  isOpen,
  onClose,
  selectedWard,
  onSelectWard,
  totalParcelsCount = 14850
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');

  const filteredWards = useMemo(() => {
    return URBAN_WARDS_LIST.filter(ward => {
      const matchesZone = selectedZone === 'ALL' || ward.zone === selectedZone;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = 
        !query ||
        ward.wardNo.toLowerCase().includes(query) ||
        ward.name.toLowerCase().includes(query) ||
        ward.zoneLabel.toLowerCase().includes(query) ||
        ward.description.toLowerCase().includes(query);
      return matchesZone && matchesQuery;
    });
  }, [searchQuery, selectedZone]);

  if (!isOpen) return null;

  const handleSelect = (wardNo: string) => {
    onSelectWard(wardNo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Select Urban Revenue Ward
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  24 Municipal Wards
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose an individual urban ward or select All Urban Wards to view the complete metropolitan cadastre.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-800 bg-slate-950/50 space-y-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by ward name, ward number (e.g. Ward 14, Ward 15), or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {WARD_ZONES.map(z => {
              const active = selectedZone === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {z.label}
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {z.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: Large Ward Options */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Featured Large Button: ALL URBAN WARDS */}
          <div>
            <button
              onClick={() => handleSelect('ALL')}
              id="select-all-urban-wards-large-btn"
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group cursor-pointer ${
                selectedWard === 'ALL'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/70 border-slate-700 hover:border-emerald-500/70 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl border ${
                  selectedWard === 'ALL'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-emerald-400 border-slate-700 group-hover:border-emerald-500/40'
                }`}>
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      All Urban Wards
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Metropolitan Spatial Extent
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Display all 24 municipal revenue wards across the full geographic boundary envelope.
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-300">
                    <span>24 Wards Active</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{totalParcelsCount.toLocaleString()} Total Parcels</span>
                    <span>•</span>
                    <span>EPSG:32643 UTM 43N</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedWard === 'ALL' ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Active Selection</span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                    <span>Select All</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Grid of Individual Large Ward Selection Buttons */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span className="font-semibold text-slate-200">
                Individual Urban Revenue Wards ({filteredWards.length})
              </span>
              <span>Click any ward button to focus vector cadastre</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredWards.map(ward => {
                const isSelected = selectedWard.toLowerCase() === ward.wardNo.toLowerCase();

                return (
                  <button
                    key={ward.id}
                    onClick={() => handleSelect(ward.wardNo)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      {/* Top Row: Ward ID & Zone */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-800 text-emerald-400 border-slate-700'
                          }`}>
                            {ward.wardNo}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {ward.zoneLabel}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ward.surveyStatus === 'Harmonized'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ward.surveyStatus === 'Completed'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {ward.surveyStatus}
                        </span>
                      </div>

                      {/* Ward Name */}
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                        {ward.name}
                      </h4>

                      {/* Description */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {ward.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Status */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-slate-300 font-semibold">{ward.parcelCount.toLocaleString()} parcels</span>
                        <span>•</span>
                        <span>{ward.totalAreaHectares} ha</span>
                      </div>

                      {isSelected ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected
                        </span>
                      ) : (
                        <span className="text-slate-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          Select Ward
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredWards.length === 0 && (
              <div className="py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                <Search className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No urban wards match your filter</p>
                <p className="text-xs mt-1">Try searching for a different ward number, area, or zone.</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Active Selection:</span>
            <span className="text-emerald-400 font-bold">
              {selectedWard === 'ALL' ? 'All Urban Wards (24 Wards)' : selectedWard}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
