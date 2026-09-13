import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCheck2, 
  Globe, 
  FileText,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { Parcel } from '../types';

interface OgcRegistryViewProps {
  parcels: Parcel[];
  onOpenCertificateForParcel: (parcel: Parcel) => void;
}

export const OgcRegistryView: React.FC<OgcRegistryViewProps> = ({
  parcels,
  onOpenCertificateForParcel
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const wfsEndpoint = `${window.location.origin}/api/ogc/wfs`;
  const wmsEndpoint = `${window.location.origin}/api/ogc/wms?SERVICE=WMS&REQUEST=GetCapabilities`;

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDownloadGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      name: 'urban_cadastre_harmonized_parcels',
      features: parcels.map(p => ({
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'Polygon',
          coordinates: [p.polygon.map(c => [c.lng, c.lat])]
        },
        properties: {
          ulpin: p.ulpin,
          survey_no: p.surveyNo,
          owner: p.ownerName,
          recorded_sqm: p.recordedAreaSqm,
          surveyed_sqm: p.surveyedAreaSqm,
          discrepancy_sqm: p.discrepancySqm,
          confidence: p.aiConfidenceScore,
          status: p.status,
          crs: 'EPSG:32643 (UTM 43N)'
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urban_cadastre_ward14_harmonized_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSql = () => {
    let sql = `-- GeoHarmonize Urban Cadastre PostGIS Spatial Dump\n-- Generated on: ${new Date().toISOString()}\n-- SRID: 32643 (UTM Zone 43N)\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS master_parcels (\n  id VARCHAR(32) PRIMARY KEY,\n  ulpin VARCHAR(32) UNIQUE NOT NULL,\n  survey_no VARCHAR(32),\n  owner_name VARCHAR(255),\n  recorded_area_sqm NUMERIC(12,2),\n  surveyed_area_sqm NUMERIC(12,2),\n  confidence_score NUMERIC(5,2),\n  geom GEOMETRY(MultiPolygon, 32643)\n);\n\nCREATE INDEX IF NOT EXISTS idx_parcels_geom_gist ON master_parcels USING GIST(geom);\n\n`;

    parcels.forEach(p => {
      sql += `INSERT INTO master_parcels (id, ulpin, survey_no, owner_name, recorded_area_sqm, surveyed_area_sqm, confidence_score, geom) VALUES ('${p.id}', '${p.ulpin}', '${p.surveyNo}', '${p.ownerName.replace(/'/g, "''")}', ${p.recordedAreaSqm}, ${p.surveyedAreaSqm}, ${p.aiConfidenceScore}, ST_Multi(ST_GeomFromText('${p.postgisGeomText}', 32643)));\n`;
    });

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postgis_urban_cadastre_dump_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 p-6 overflow-y-auto text-xs space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>OGC Registry & Data Services</span>
          </div>
          <p className="text-slate-400 mt-1 max-w-2xl">
            WMS and WFS endpoints for QGIS, ArcGIS, and municipal GIS portals.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadGeoJson}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export GeoJSON</span>
          </button>

          <button
            onClick={handleDownloadSql}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCode className="h-4 w-4 text-blue-400" />
            <span>Export SQL</span>
          </button>
        </div>
      </div>

      {/* Protocol Endpoints & Integration URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* WFS Service Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>OGC WFS 2.0</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Vector GeoJSON
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Vector feature service for parcel boundaries and metadata.
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-300">
            <span className="truncate max-w-[280px]">{wfsEndpoint}</span>
            <button
              onClick={() => handleCopy(wfsEndpoint, 'wfs')}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Copy WFS URL"
            >
              {copiedUrl === 'wfs' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Format: GeoJSON</span>
            <span>CRS: EPSG:4326 / 32643</span>
          </div>
        </div>

        {/* WMS Service Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>OGC WMS 1.3.0</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Map Tiles
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Map tile service for orthomosaic and parcel layers.
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-300">
            <span className="truncate max-w-[280px]">{wmsEndpoint}</span>
            <button
              onClick={() => handleCopy(wmsEndpoint, 'wms')}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Copy WMS URL"
            >
              {copiedUrl === 'wms' ? <Check className="h-4 w-4 text-blue-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Format: image/png</span>
            <span>Tiling: TMS / XYZ</span>
          </div>
        </div>

      </div>

      {/* Official Master Cadastral Register Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Land Record Registry</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            {parcels.length} Parcels
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-2.5">ULPIN</th>
                <th className="p-2.5">Survey No.</th>
                <th className="p-2.5">Owner</th>
                <th className="p-2.5">Land Use</th>
                <th className="p-2.5">RoR Area</th>
                <th className="p-2.5">Drone Area</th>
                <th className="p-2.5">Delta</th>
                <th className="p-2.5">Confidence</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map(parcel => (
                <tr key={parcel.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 text-slate-200">
                  <td className="p-2.5 font-bold text-emerald-400">{parcel.ulpin}</td>
                  <td className="p-2.5 text-white">{parcel.surveyNo}</td>
                  <td className="p-2.5 font-sans font-medium text-slate-300">{parcel.ownerName}</td>
                  <td className="p-2.5 text-slate-400">{parcel.landUse}</td>
                  <td className="p-2.5 text-slate-300">{parcel.recordedAreaSqm.toFixed(1)} m²</td>
                  <td className="p-2.5 text-emerald-300 font-bold">{parcel.surveyedAreaSqm.toFixed(1)} m²</td>
                  <td className={`p-2.5 font-bold ${
                    Math.abs(parcel.discrepancyPercent) <= 5 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {parcel.discrepancySqm > 0 ? `+${parcel.discrepancySqm.toFixed(1)}` : parcel.discrepancySqm.toFixed(1)} m²
                  </td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {parcel.aiConfidenceScore}%
                    </span>
                  </td>
                  <td className="p-2.5">
                    {parcel.status === 'harmonized' && (
                      <span className="text-emerald-400 font-semibold">Harmonized</span>
                    )}
                    {parcel.status === 'review_required' && (
                      <span className="text-amber-400 font-semibold">Review</span>
                    )}
                    {parcel.status === 'conflict_encroachment' && (
                      <span className="text-rose-400 font-semibold">Encroachment</span>
                    )}
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => onOpenCertificateForParcel(parcel)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-sans font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileCheck2 className="h-3 w-3" />
                      <span>Certificate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
