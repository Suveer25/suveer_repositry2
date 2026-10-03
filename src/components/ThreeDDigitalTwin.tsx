import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Sun, 
  Mountain, 
  Building2, 
  Eye, 
  FileCheck2, 
  Compass, 
  RotateCw, 
  Sliders
} from 'lucide-react';
import { Parcel } from '../types';

interface ThreeDDigitalTwinProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
}

export const ThreeDDigitalTwin: React.FC<ThreeDDigitalTwinProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel
}) => {
  const [pitchAngle, setPitchAngle] = useState(55); // degrees
  const [rotationAngle, setRotationAngle] = useState(30); // degrees
  const [heightMultiplier, setHeightMultiplier] = useState(1.8);
  const [showDsmMesh, setShowDsmMesh] = useState(true);
  const [showVerticalCadastre, setShowVerticalCadastre] = useState(true);
  const [selectedFloorUnit, setSelectedFloorUnit] = useState<string | null>(null);

  const activeParcel = selectedParcel || parcels[0] || null;

  if (!activeParcel) {
    return (
      <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex items-center justify-center text-slate-400">
        <p>No cadastral parcels available for 3D digital twin rendering.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      
      {/* 3D Scene Controls & Layer Configuration Bar (Left Panel) */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-4 text-xs">
        
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Box className="h-4 w-4 text-emerald-400" />
            <span>3D Digital Twin</span>
          </div>
          <p className="text-slate-400 mt-0.5">
            DSM Elevation & Vertical Cadastre
          </p>
        </div>

        {/* Parcel Selector */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-slate-300 font-semibold block">Survey Parcel:</label>
          <select 
            aria-label="Select Survey Parcel"
            value={activeParcel.id}
            onChange={(e) => {
              const p = parcels.find(item => item.id === e.target.value);
              if (p) onSelectParcel(p);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            {parcels.map(p => (
              <option key={p.id} value={p.id}>
                {p.surveyNo} - {p.ownerName} ({p.landUse})
              </option>
            ))}
          </select>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Elevation: {activeParcel.dsmElevationMeters} m</span>
            <span className="text-emerald-400">{activeParcel.ulpin}</span>
          </div>
        </div>

        {/* 3D Camera Controls */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              Camera Controls
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Pitch:</span>
              <span className="font-mono text-slate-200">{pitchAngle}°</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="75" 
              value={pitchAngle}
              onChange={(e) => setPitchAngle(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Rotation:</span>
              <span className="font-mono text-slate-200">{rotationAngle}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="90" 
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Extrusion:</span>
              <span className="font-mono text-slate-200">{heightMultiplier}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.1" 
              value={heightMultiplier}
              onChange={(e) => setHeightMultiplier(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
            />
          </div>
        </div>

        {/* 3D Layers Toggles */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-semibold mb-1">Overlays</div>
          
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-slate-300 flex items-center gap-2">
              <Mountain className="h-3.5 w-3.5 text-blue-400" />
              DSM Mesh
            </span>
            <input 
              type="checkbox" 
              checked={showDsmMesh} 
              onChange={(e) => setShowDsmMesh(e.target.checked)}
              className="accent-emerald-500 h-4 w-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-slate-300 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              Vertical Property Units
            </span>
            <input 
              type="checkbox" 
              checked={showVerticalCadastre} 
              onChange={(e) => setShowVerticalCadastre(e.target.checked)}
              className="accent-emerald-500 h-4 w-4 rounded"
            />
          </label>
        </div>

        {/* Vertical Cadastre Unit Titles */}
        {activeParcel.verticalUnits && activeParcel.verticalUnits.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Floor Units</span>
              <span className="text-[10px] text-emerald-400 font-mono">3D Cadastre</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {activeParcel.verticalUnits.map(unit => (
                <button
                  key={unit.unitId}
                  onClick={() => setSelectedFloorUnit(unit.unitId)}
                  className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                    selectedFloorUnit === unit.unitId
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between font-semibold">
                    <span>{unit.floorLevel}</span>
                    <span className="font-mono text-[10px] text-slate-400">{unit.carpetAreaSqm} m²</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                    {unit.subUlpin}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 flex justify-between">
                    <span>{unit.ownerName}</span>
                    <span className="text-emerald-400">{unit.undividedSharePercent}% UDS</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3D Isometric Viewport (Right Area) */}
      <div className="flex-1 h-full bg-slate-950 relative flex items-center justify-center p-6 overflow-hidden">
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono backdrop-blur-md flex items-center gap-1.5">
            <Box className="h-3.5 w-3.5 text-emerald-400" />
            3D Stage
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-emerald-400 text-xs font-mono backdrop-blur-md">
            Elevation: {activeParcel.dsmElevationMeters}m
          </span>
        </div>

        {/* 3D Perspective Visualizer Container */}
        <div 
          className="relative w-full max-w-3xl aspect-[4/3] flex items-center justify-center transition-all duration-300"
          style={{
            perspective: '1200px'
          }}
        >
          {/* Transform stage */}
          <div 
            className="relative w-[500px] h-[400px] transition-transform duration-300 ease-out preserve-3d"
            style={{
              transform: `rotateX(${pitchAngle}deg) rotateZ(${rotationAngle}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Ground Elevation Plane (DTM Base) */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/20 shadow-2xl"
              style={{ transform: 'translateZ(0px)' }}
            >
              {/* DSM Elevation Wireframe Grid */}
              {showDsmMesh && (
                <div className="w-full h-full grid grid-cols-8 grid-rows-8 opacity-30 border border-emerald-500/40">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="border border-emerald-500/30 transition-colors hover:bg-emerald-500/20"
                    />
                  ))}
                </div>
              )}

              {/* Parcel Ground Boundary Outline */}
              <div className="absolute inset-10 border-2 border-emerald-400/80 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-emerald-300 bg-slate-950/80 px-2 py-1 rounded border border-emerald-500/30">
                  Cadastral Plot: {activeParcel.surveyNo} ({activeParcel.recordedAreaSqm} m²)
                </span>
              </div>
            </div>

            {/* 3D Extruded Buildings */}
            {activeParcel.buildings.map((bld, idx) => {
              const floorCount = bld.floors;
              const buildingHeightPx = bld.heightMeters * 6 * heightMultiplier;

              return (
                <div
                  key={bld.id}
                  className="absolute transition-all duration-300"
                  style={{
                    left: '120px',
                    top: '90px',
                    width: '260px',
                    height: '220px',
                    transform: `translateZ(${10}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Multi-story floor plates (Vertical Cadastre Representation) */}
                  {Array.from({ length: floorCount }).map((_, floorIdx) => {
                    const floorZ = (floorIdx / floorCount) * buildingHeightPx;
                    const isFloorSelected = selectedFloorUnit === `VU-104-1-0${floorIdx + 1}`;
                    const floorColor = bld.isEncroached 
                      ? 'border-rose-500/80 bg-rose-950/40' 
                      : isFloorSelected 
                        ? 'border-emerald-400 bg-emerald-500/30' 
                        : 'border-cyan-500/60 bg-slate-900/60';

                    return (
                      <div
                        key={`floor-${floorIdx}`}
                        className={`absolute inset-0 rounded border-2 shadow-lg backdrop-blur-sm transition-all duration-200 flex flex-col justify-between p-3 ${floorColor}`}
                        style={{
                          transform: `translateZ(${floorZ}px)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-white">
                          <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700">
                            Floor {floorIdx + 1} ({bld.class})
                          </span>
                          <span className="text-emerald-400 font-bold">
                            +{(floorIdx * 3.2).toFixed(1)}m
                          </span>
                        </div>

                        {showVerticalCadastre && (
                          <div className="text-[10px] text-slate-300 font-mono bg-slate-950/70 p-1.5 rounded border border-slate-800">
                            <div>Unit ULPIN: {activeParcel.ulpin}/FL{floorIdx + 1}</div>
                            <div className="text-slate-400">Share: {(100 / floorCount).toFixed(1)}% UDS</div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* 3D Roof Plate with Height Tag */}
                  <div
                    className="absolute inset-0 rounded-lg border-2 border-emerald-400 bg-gradient-to-br from-emerald-600/60 to-teal-800/80 shadow-2xl flex items-center justify-center text-center text-white"
                    style={{
                      transform: `translateZ(${buildingHeightPx}px)`
                    }}
                  >
                    <div className="bg-slate-950/90 px-3 py-1.5 rounded-lg border border-emerald-400 font-mono text-xs shadow-xl">
                      <div className="font-bold text-emerald-300">Roof Height: {bld.heightMeters}m</div>
                      <div className="text-[10px] text-slate-400">{bld.floors} Floors • {bld.areaSqm} m²</div>
                    </div>
                  </div>

                  {/* Vertical Column Pillars */}
                  {[
                    'top-0 left-0',
                    'top-0 right-0',
                    'bottom-0 left-0',
                    'bottom-0 right-0'
                  ].map((pos, pIdx) => (
                    <div
                      key={`pillar-${pIdx}`}
                      className={`absolute ${pos} w-1 bg-emerald-400/80`}
                      style={{
                        height: `${buildingHeightPx}px`,
                        transform: 'rotateX(-90deg)',
                        transformOrigin: 'bottom'
                      }}
                    />
                  ))}
                </div>
              );
            })}

            {/* Simulated Road Buffer Corridor */}
            <div 
              className="absolute left-[-40px] right-[-40px] bottom-[-20px] h-12 bg-slate-800/90 border-y-2 border-dashed border-amber-400/60 flex items-center justify-center font-mono text-[10px] text-amber-300"
              style={{ transform: 'translateZ(2px)' }}
            >
              MUNICIPAL RIGHT-OF-WAY (12.0m ROAD SETBACK BUFFER)
            </div>

          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Ground Parcel Bound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Vertical Floor Unit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Setback Line</span>
          </div>
        </div>

      </div>

    </div>
  );
};
