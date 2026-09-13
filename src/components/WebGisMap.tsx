import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Ruler, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Crosshair, 
  Building2, 
  FileText, 
  FileCheck2,
  Eye, 
  EyeOff,
  Maximize2,
  Upload,
  Camera,
  Receipt
} from 'lucide-react';
import { Parcel, Coordinate, DroneImageData } from '../types';

interface WebGisMapProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel | null) => void;
  onHarmonizeParcel: (parcelId: string) => void;
  onOpenAiAudit: (parcel: Parcel) => void;
  onGenerateUlpin: (parcelId: string) => void;
  onOpenCertificate?: (parcel: Parcel) => void;
  droneImage?: DroneImageData | null;
  onOpenUploadDrone?: () => void;
  onUpdateDroneOpacity?: (opacity: number) => void;
  onOpenUploadTaxRecord?: (parcel?: Parcel) => void;
}

export const WebGisMap: React.FC<WebGisMapProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel,
  onHarmonizeParcel,
  onOpenAiAudit,
  onGenerateUlpin,
  onOpenCertificate,
  droneImage,
  onOpenUploadDrone,
  onUpdateDroneOpacity,
  onOpenUploadTaxRecord
}) => {
  // Map viewport state (Pan & Zoom)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Swipe slider state (0 = 100% legacy, 100 = 100% drone ortho)
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipePosition, setSwipePosition] = useState(50); // percentage

  // Measure mode
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<Coordinate[]>([]);

  // Layer Visibility
  const [showOrtho, setShowOrtho] = useState(true);
  const [showLegacy, setShowLegacy] = useState(true);
  const [showHarmonized, setShowHarmonized] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showSamMasks, setShowSamMasks] = useState(true);
  const [showTiePoints, setShowTiePoints] = useState(true);
  const [showTopologyAlerts, setShowTopologyAlerts] = useState(true);

  // Mouse coordinate probe
  const [hoverCoord, setHoverCoord] = useState<Coordinate>({ lng: 73.8565, lat: 18.5222 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Coordinate bounding box for conversion to SVG space (dynamically calculated from visible parcels)
  const bounds = useMemo(() => {
    if (!parcels || parcels.length === 0) {
      return {
        minLng: 73.8525,
        maxLng: 73.8625,
        minLat: 18.5190,
        maxLat: 18.5250
      };
    }
    let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
    parcels.forEach(p => {
      p.polygon.forEach(c => {
        if (c.lng < minLng) minLng = c.lng;
        if (c.lng > maxLng) maxLng = c.lng;
        if (c.lat < minLat) minLat = c.lat;
        if (c.lat > maxLat) maxLat = c.lat;
      });
    });
    const padLng = Math.max((maxLng - minLng) * 0.12, 0.002);
    const padLat = Math.max((maxLat - minLat) * 0.12, 0.002);
    return {
      minLng: minLng - padLng,
      maxLng: maxLng + padLng,
      minLat: minLat - padLat,
      maxLat: maxLat + padLat
    };
  }, [parcels]);

  const svgWidth = 1000;
  const svgHeight = 700;

  // Convert geo coordinates (Lng, Lat) to SVG (X, Y)
  const geoToSvg = (coord: Coordinate) => {
    const x = ((coord.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * svgWidth;
    const y = svgHeight - (((coord.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * svgHeight);
    return { x, y };
  };

  // Convert SVG coordinates (X, Y) back to Geo (Lng, Lat)
  const svgToGeo = (x: number, y: number): Coordinate => {
    const lng = bounds.minLng + (x / svgWidth) * (bounds.maxLng - bounds.minLng);
    const lat = bounds.minLat + ((svgHeight - y) / svgHeight) * (bounds.maxLat - bounds.minLat);
    return { lng, lat };
  };

  // Pan and drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement && e.target.classList.contains('interactive-parcel')) {
      return; // allow parcel selection
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left - pan.x) / zoom;
      const relativeY = (e.clientY - rect.top - pan.y) / zoom;
      const geo = svgToGeo(relativeX, relativeY);
      setHoverCoord(geo);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setMeasurePoints([]);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (measureMode) {
      if (measurePoints.length >= 2) {
        setMeasurePoints([hoverCoord]);
      } else {
        setMeasurePoints([...measurePoints, hoverCoord]);
      }
    }
  };

  // Calculate distance between measure points
  const measuredDistance = useMemo(() => {
    if (measurePoints.length < 2) return null;
    const p1 = measurePoints[0];
    const p2 = measurePoints[1];
    // Haversine approximation in meters
    const R = 6371e3;
    const φ1 = (p1.lat * Math.PI) / 180;
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  }, [measurePoints]);

  return (
    <div className="relative w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex overflow-hidden select-none">
      
      {/* 2D GIS Map Canvas Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleMapClick}
        className={`relative flex-1 h-full overflow-hidden bg-slate-950 ${
          isDragging ? 'cursor-grabbing' : measureMode ? 'cursor-crosshair' : 'cursor-grab'
        }`}
      >
        {/* Floating Map Controls (Top-Left) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3.5))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.6))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button 
            onClick={handleResetView}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-px bg-slate-800 my-0.5"></div>
          <button 
            onClick={() => setMeasureMode(!measureMode)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              measureMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Distance Measurement Tool"
          >
            <Ruler className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsSwipeActive(!isSwipeActive)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isSwipeActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Split-Screen Swipe (Cadastral vs Drone)"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>

        {/* Layer Visibility Pills (Top Center) */}
        <div className="absolute top-4 left-20 z-20 hidden md:flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl text-xs">
          <span className="text-slate-500 font-mono flex items-center gap-1 mr-1">
            <Layers className="h-3.5 w-3.5" />
            Layers:
          </span>
          <button
            onClick={() => setShowOrtho(!showOrtho)}
            className={`px-2 py-1 rounded-md transition-colors ${
              showOrtho ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Drone Ortho
          </button>
          <button
            onClick={() => setShowLegacy(!showLegacy)}
            className={`px-2 py-1 rounded-md transition-colors ${
              showLegacy ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            1974 Sheet
          </button>
          <button
            onClick={() => setShowHarmonized(!showHarmonized)}
            className={`px-2 py-1 rounded-md transition-colors ${
              showHarmonized ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            PostGIS
          </button>
          <button
            onClick={() => setShowBuildings(!showBuildings)}
            className={`px-2 py-1 rounded-md transition-colors ${
              showBuildings ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Buildings
          </button>
          <button
            onClick={() => setShowSamMasks(!showSamMasks)}
            className={`px-2 py-1 rounded-md transition-colors ${
              showSamMasks ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            SAM Masks
          </button>

          {/* Upload Drone Image Button & Active Pill */}
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          {onOpenUploadDrone && (
            <button
              onClick={onOpenUploadDrone}
              id="map-upload-drone-btn"
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer font-medium ${
                droneImage
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
              title="Upload / Replace Drone Image from File Explorer"
            >
              <Upload className="h-3 w-3 text-emerald-400" />
              <span>{droneImage ? 'Ortho: ' + droneImage.name.split('.')[0].slice(0, 14) + '...' : 'Upload Drone Ortho'}</span>
            </button>
          )}
        </div>

        {/* Legend (Bottom-Left) */}
        <div className="absolute bottom-6 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-xs">
          <div className="font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span>Confidence</span>
            <span className="font-mono text-[10px] text-slate-500">&gt; 90%</span>
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-400"></span>
              <span className="text-slate-300">Harmonized (≥ 90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-400"></span>
              <span className="text-slate-300">Review (70–89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-400"></span>
              <span className="text-slate-300">Conflict (&lt; 70%)</span>
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Scale Bar */}
        <div className="absolute bottom-6 right-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500">WGS84: </span>
            <span className="text-slate-200">{hoverCoord.lat.toFixed(6)}°N, {hoverCoord.lng.toFixed(6)}°E</span>
          </div>
          <div className="h-3 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-500">UTM 43N: </span>
            <span className="text-emerald-400">
              E {(378000 + (hoverCoord.lng - 73.85) * 105000).toFixed(1)}m, 
              N {(2048000 + (hoverCoord.lat - 18.52) * 110000).toFixed(1)}m
            </span>
          </div>
          {measureDistanceFormatted(measuredDistance)}
        </div>

        {/* Interactive SVG GIS Map Viewport */}
        <div 
          className="w-full h-full transform transition-transform duration-75 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Technical Clean GIS Dark Basemap Pattern */}
              <pattern id="orthoPattern" patternUnits="userSpaceOnUse" width="60" height="60">
                <rect width="60" height="60" fill="#0b1120" />
                <line x1="0" y1="0" x2="60" y2="0" stroke="#1e293b" strokeWidth="0.75" opacity="0.4" />
                <line x1="0" y1="0" x2="0" y2="60" stroke="#1e293b" strokeWidth="0.75" opacity="0.4" />
                <circle cx="30" cy="30" r="1" fill="#334155" opacity="0.6" />
                <rect x="12" y="14" width="18" height="12" fill="#1e293b" opacity="0.4" />
                <rect x="36" y="34" width="16" height="14" fill="#1e293b" opacity="0.3" />
              </pattern>

              {/* Scanned Paper Texture Pattern Simulation */}
              <pattern id="legacyPattern" patternUnits="userSpaceOnUse" width="60" height="60">
                <rect width="60" height="60" fill="#292218" opacity="0.4" />
                <circle cx="15" cy="15" r="1" fill="#78350f" opacity="0.3" />
                <circle cx="45" cy="35" r="1.5" fill="#78350f" opacity="0.2" />
                <line x1="0" y1="30" x2="60" y2="30" stroke="#78350f" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
              </pattern>

              {/* Glowing Filters */}
              <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.8" />
              </filter>
              <filter id="glow-conflict" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Base Coordinate Grid Lines */}
            <g className="grid-lines" stroke="#1e293b" strokeWidth="0.7" strokeDasharray="4 4">
              {[100, 250, 400, 550, 700, 850].map((x) => (
                <line key={`v-${x}`} x1={x} y1="0" x2={x} y2={svgHeight} />
              ))}
              {[100, 250, 400, 550].map((y) => (
                <line key={`h-${y}`} x1="0" y1={y} x2={svgWidth} y2={y} />
              ))}
            </g>

            {/* 1. Drone Orthomosaic Background Layer */}
            {showOrtho && (
              <g className="drone-orthomosaic-layer">
                {droneImage ? (
                  <image 
                    href={droneImage.url} 
                    x="0" 
                    y="0" 
                    width={svgWidth} 
                    height={svgHeight} 
                    preserveAspectRatio="xMidYMid slice" 
                    opacity={droneImage.opacity ?? 0.88} 
                  />
                ) : (
                  <rect width={svgWidth} height={svgHeight} fill="url(#orthoPattern)" />
                )}
                {/* Simulated Road Network & Pavement */}
                <path 
                  d="M0 320 Q300 315 550 330 T1000 340" 
                  stroke="#334155" 
                  strokeWidth="28" 
                  fill="none" 
                  opacity={droneImage ? 0.6 : 1}
                />
                <path 
                  d="M0 320 Q300 315 550 330 T1000 340" 
                  stroke="#f1f5f9" 
                  strokeWidth="1.5" 
                  strokeDasharray="10 8" 
                  fill="none" 
                  opacity={droneImage ? 0.7 : 1}
                />
                <path 
                  d="M480 0 L490 700" 
                  stroke="#334155" 
                  strokeWidth="20" 
                  fill="none" 
                  opacity={droneImage ? 0.6 : 1}
                />
              </g>
            )}

            {/* 2. Legacy Scanned Village Sheet Layer (Rubber-Sheeted) */}
            {showLegacy && (
              <g className="legacy-cadastral-layer" opacity={isSwipeActive ? 0.85 : 0.45}>
                {parcels.map((parcel) => {
                  const points = parcel.legacyPolygon
                    .map(coord => {
                      const { x, y } = geoToSvg(coord);
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={`legacy-${parcel.id}`}
                      points={points}
                      fill="url(#legacyPattern)"
                      stroke="#d97706"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  );
                })}
              </g>
            )}

            {/* 3. SAM Extracted Vector Boundaries */}
            {showSamMasks && (
              <g className="sam-delineation-layer" opacity="0.7">
                {parcels.map((parcel) => {
                  const points = parcel.samExtractedPolygon
                    .map(coord => {
                      const { x, y } = geoToSvg(coord);
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={`sam-${parcel.id}`}
                      points={points}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  );
                })}
              </g>
            )}

            {/* 4. PostGIS Master Cadastral Parcels */}
            {showHarmonized && (
              <g className="master-parcels-layer">
                {parcels.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const points = parcel.polygon
                    .map(coord => {
                      const { x, y } = geoToSvg(coord);
                      return `${x},${y}`;
                    })
                    .join(' ');

                  // Color coding based on status & AI confidence
                  let fillColor = 'rgba(16, 185, 129, 0.22)';
                  let strokeColor = '#10b981';

                  if (parcel.status === 'conflict_encroachment') {
                    fillColor = 'rgba(244, 63, 94, 0.28)';
                    strokeColor = '#f43f5e';
                  } else if (parcel.status === 'review_required') {
                    fillColor = 'rgba(245, 158, 11, 0.24)';
                    strokeColor = '#f59e0b';
                  }

                  const centroidSvg = geoToSvg(parcel.centroid);

                  return (
                    <g key={parcel.id} className="cursor-pointer">
                      <polygon
                        points={points}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3.5 : 2}
                        filter={isSelected ? 'url(#glow-selected)' : parcel.status === 'conflict_encroachment' ? 'url(#glow-conflict)' : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectParcel(parcel);
                        }}
                        className="interactive-parcel transition-all duration-200 hover:fill-opacity-50"
                      />

                      {/* Vertex Markers */}
                      {isSelected && parcel.polygon.map((coord, idx) => {
                        const { x, y } = geoToSvg(coord);
                        return (
                          <circle
                            key={`vertex-${idx}`}
                            cx={x}
                            cy={y}
                            r={4.5}
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* Parcel Centroid Tag & Survey No */}
                      <g transform={`translate(${centroidSvg.x}, ${centroidSvg.y})`} pointerEvents="none">
                        <circle cx="0" cy="0" r="14" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {parcel.surveyNo}
                        </text>
                        <text
                          x="0"
                          y="22"
                          textAnchor="middle"
                          fill="#cbd5e1"
                          fontSize="9"
                          fontWeight="500"
                          className="drop-shadow"
                        >
                          {parcel.recordedAreaSqm} m²
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* 5. YOLOv8 Building Footprints & Structural Encroachments */}
            {showBuildings && (
              <g className="yolo-buildings-layer" pointerEvents="none">
                {parcels.flatMap(parcel => 
                  parcel.buildings.map(bld => {
                    const min = geoToSvg({ lng: bld.bbox[0], lat: bld.bbox[3] });
                    const max = geoToSvg({ lng: bld.bbox[2], lat: bld.bbox[1] });
                    const width = Math.abs(max.x - min.x);
                    const height = Math.abs(max.y - min.y);

                    return (
                      <g key={bld.id}>
                        <rect
                          x={min.x}
                          y={min.y}
                          width={width}
                          height={height}
                          fill={bld.isEncroached ? 'rgba(239, 68, 68, 0.45)' : 'rgba(147, 51, 234, 0.3)'}
                          stroke={bld.isEncroached ? '#ef4444' : '#a855f7'}
                          strokeWidth={bld.isEncroached ? 2.5 : 1.5}
                          strokeDasharray={bld.isEncroached ? '4 2' : 'none'}
                          rx="2"
                        />
                        <text
                          x={min.x + 3}
                          y={min.y - 4}
                          fill={bld.isEncroached ? '#f87171' : '#c084fc'}
                          fontSize="9"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="600"
                        >
                          {bld.isEncroached ? `ENCROACHMENT: ${bld.encroachmentSqm}m²` : `${bld.class} (${bld.floors}F)`}
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
            )}

            {/* 6. LoFTR Tie Point Vectors (Connecting Scanned GCP to Drone Ortho) */}
            {showTiePoints && (
              <g className="loftr-tie-points-layer" pointerEvents="none">
                {parcels.map(parcel => {
                  if (parcel.legacyPolygon.length === 0) return null;
                  const legacyPt = geoToSvg(parcel.legacyPolygon[0]);
                  const modernPt = geoToSvg(parcel.polygon[0]);
                  return (
                    <g key={`tie-${parcel.id}`}>
                      <line
                        x1={legacyPt.x}
                        y1={legacyPt.y}
                        x2={modernPt.x}
                        y2={modernPt.y}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <circle cx={legacyPt.x} cy={legacyPt.y} r="2.5" fill="#f59e0b" />
                      <circle cx={modernPt.x} cy={modernPt.y} r="2.5" fill="#10b981" />
                    </g>
                  );
                })}
              </g>
            )}

            {/* 7. Topology Issue Callouts (Slivers & Gaps) */}
            {showTopologyAlerts && (
              <g className="topology-issues-layer" pointerEvents="none">
                {parcels.flatMap(parcel => 
                  parcel.topologyIssues.filter(t => !t.resolved).map(issue => {
                    const firstCoord = issue.coordinates[0];
                    if (!firstCoord) return null;
                    const { x, y } = geoToSvg(firstCoord);
                    return (
                      <g key={issue.id} transform={`translate(${x}, ${y})`}>
                        <circle cx="0" cy="0" r="16" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" />
                        <circle cx="0" cy="0" r="6" fill="#f43f5e" />
                        <text x="10" y="4" fill="#f43f5e" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                          {issue.type} ({issue.affectedAreaSqm} m²)
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
            )}

            {/* Measurement lines */}
            {measurePoints.map((pt, idx) => {
              const { x, y } = geoToSvg(pt);
              return (
                <circle key={`meas-pt-${idx}`} cx={x} cy={y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              );
            })}
            {measurePoints.length === 2 && (
              <line
                x1={geoToSvg(measurePoints[0]).x}
                y1={geoToSvg(measurePoints[0]).y}
                x2={geoToSvg(measurePoints[1]).x}
                y2={geoToSvg(measurePoints[1]).y}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}
          </svg>
        </div>

        {/* Split-Screen / Swipe Handle */}
        {isSwipeActive && (
          <div 
            className="absolute top-0 bottom-0 z-30 w-1 bg-teal-400 cursor-ew-resize shadow-lg flex items-center justify-center"
            style={{ left: `${swipePosition}%` }}
          >
            <div className="h-9 w-9 rounded-full bg-teal-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-md">
              <Sliders className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      {/* Right-Side Survey & Harmonization Inspector Drawer */}
      {selectedParcel ? (
        <div className="w-96 h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto flex flex-col z-30 animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 backdrop-blur-md z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Survey No. {selectedParcel.surveyNo}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedParcel.subDivision}
                </span>
              </div>
              <button 
                onClick={() => onSelectParcel(null)}
                className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                Close ✕
              </button>
            </div>
            <h2 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5 font-mono">
              ULPIN: {selectedParcel.ulpin}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedParcel.villageName} • {selectedParcel.wardNo}
            </p>
          </div>

          {/* Drawer Body Content */}
          <div className="p-4 space-y-4 text-xs">

            {/* Status & AI Confidence Card */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Status</span>
                {selectedParcel.status === 'harmonized' && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Harmonized
                  </span>
                )}
                {selectedParcel.status === 'review_required' && (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5" /> Review Needed
                  </span>
                )}
                {selectedParcel.status === 'conflict_encroachment' && (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <ShieldAlert className="h-3.5 w-3.5" /> Encroachment
                  </span>
                )}
              </div>

              {/* Progress bar for AI confidence */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedParcel.aiConfidenceScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedParcel.aiConfidenceScore >= 90 ? 'bg-emerald-500' :
                      selectedParcel.aiConfidenceScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${selectedParcel.aiConfidenceScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Area Reconciliation & Variance Delta */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-slate-300 font-semibold flex items-center justify-between">
                <span>Area Reconciliation</span>
                <span className="text-[10px] text-slate-500 font-mono">±5% Tol.</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Recorded</div>
                  <div className="text-sm font-bold text-slate-100 font-mono">
                    {selectedParcel.recordedAreaSqm.toFixed(1)} m²
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Surveyed</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {selectedParcel.surveyedAreaSqm.toFixed(1)} m²
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Variance:</span>
                <span className={`font-mono font-bold ${
                  Math.abs(selectedParcel.discrepancyPercent) <= 5 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedParcel.discrepancySqm > 0 ? `+${selectedParcel.discrepancySqm.toFixed(1)}` : selectedParcel.discrepancySqm.toFixed(1)} m² ({selectedParcel.discrepancyPercent > 0 ? '+' : ''}{selectedParcel.discrepancyPercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Owner & Registry Metadata */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="text-slate-300 font-semibold mb-1">Ownership</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Owner:</span>
                <span className="text-slate-200 font-medium text-right">{selectedParcel.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Parent/Spouse:</span>
                <span className="text-slate-300 text-right">{selectedParcel.fatherHusbandName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Land Use:</span>
                <span className="text-emerald-300 font-medium">{selectedParcel.landUse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation:</span>
                <span className="text-slate-300 font-mono">{selectedParcel.dsmElevationMeters} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GCP Points:</span>
                <span className="text-amber-400 font-mono">{selectedParcel.tiePointsCount}</span>
              </div>
            </div>

            {/* YOLOv8 Detected Building Footprints */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-slate-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  Structures ({selectedParcel.buildings.length})
                </span>
              </div>
              {selectedParcel.buildings.map(bld => (
                <div key={bld.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{bld.class}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {bld.floors} fl • {bld.areaSqm} m²
                    </div>
                  </div>
                  {bld.isEncroached ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Encroached {bld.encroachmentSqm}m²
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Approved
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Municipal Tax Record Reconciliation */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-slate-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-amber-300">
                  <Receipt className="h-3.5 w-3.5 text-amber-400" />
                  Municipal Tax Assessment
                </span>
                {selectedParcel.taxRecord ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    selectedParcel.taxRecord.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : selectedParcel.taxRecord.paymentStatus === 'EXEMPT'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {selectedParcel.taxRecord.paymentStatus}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Unlinked</span>
                )}
              </div>

              {selectedParcel.taxRecord ? (
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Assessment No:</span>
                      <span className="font-mono text-slate-200 font-semibold text-[11px]">{selectedParcel.taxRecord.assessmentNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Taxpayer:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{selectedParcel.taxRecord.taxpayerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Annual Tax:</span>
                      <span className="text-amber-300 font-mono font-medium">₹{selectedParcel.taxRecord.assessedTaxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Tax Built-Up Area:</span>
                      <span className="text-emerald-400 font-mono font-semibold">{selectedParcel.taxRecord.assessedBuiltUpAreaSqm.toFixed(1)} m²</span>
                    </div>
                    {selectedParcel.taxRecord.receiptNumber && (
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5 border-t border-slate-800">
                        <span>Receipt No:</span>
                        <span className="font-mono text-slate-300">{selectedParcel.taxRecord.receiptNumber}</span>
                      </div>
                    )}
                  </div>

                  {onOpenUploadTaxRecord && (
                    <button
                      onClick={() => onOpenUploadTaxRecord(selectedParcel)}
                      className="w-full py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Receipt className="h-3 w-3" />
                      <span>Upload / Replace Tax Record</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">
                    No municipal tax assessment or PTIS receipt currently linked to this parcel.
                  </p>
                  {onOpenUploadTaxRecord && (
                    <button
                      onClick={() => onOpenUploadTaxRecord(selectedParcel)}
                      className="w-full py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Receipt className="h-3 w-3" />
                      <span>Upload Tax Record from File Explorer</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Topology Anomalies (if any) */}
            {selectedParcel.topologyIssues.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1.5">
                <div className="text-rose-300 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Topology Conflict
                </div>
                {selectedParcel.topologyIssues.map(issue => (
                  <div key={issue.id} className="text-[11px] text-slate-300">
                    <p className="text-rose-200">{issue.description}</p>
                    <p className="text-slate-400 mt-1 italic font-mono text-[10px]">
                      Action: {issue.suggestedAction}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onHarmonizeParcel(selectedParcel.id)}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Harmonize Boundary</span>
              </button>

              <button
                onClick={() => onOpenAiAudit(selectedParcel)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Adjudication Audit</span>
              </button>

              {onOpenCertificate && (
                <button
                  onClick={() => onOpenCertificate(selectedParcel)}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                >
                  <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  <span>View Certificate</span>
                </button>
              )}

              <button
                onClick={() => onGenerateUlpin(selectedParcel.id)}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono border border-slate-800 transition-colors cursor-pointer"
              >
                Regenerate ULPIN
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="hidden xl:flex w-80 h-full bg-slate-900/60 border-l border-slate-800 p-6 flex-col items-center justify-center text-center text-slate-500">
          <Crosshair className="h-8 w-8 text-slate-700 mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No Parcel Selected</h3>
          <p className="text-xs mt-1 max-w-[200px]">
            Select any parcel on the map to view attributes and run harmonization.
          </p>
        </div>
      )}

    </div>
  );
};

function measureDistanceFormatted(dist: string | null) {
  if (!dist) return null;
  return (
    <>
      <div className="h-3 w-px bg-slate-800"></div>
      <div className="text-emerald-400 font-bold">
        Dist: {dist} m
      </div>
    </>
  );
}
