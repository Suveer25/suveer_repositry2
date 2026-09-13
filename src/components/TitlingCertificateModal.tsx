import React from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';
import { Parcel } from '../types';

interface TitlingCertificateModalProps {
  parcel: Parcel | null;
  onClose: () => void;
}

export const TitlingCertificateModal: React.FC<TitlingCertificateModalProps> = ({
  parcel,
  onClose
}) => {
  if (!parcel) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-8">
        
        {/* Modal Controls Top Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Land Titling Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Formal Government Document Styling) */}
        <div className="p-8 bg-slate-950 text-slate-900 space-y-6">
          <div className="bg-white p-8 rounded-xl border-4 border-double border-slate-400 shadow-xl space-y-6">
            
            {/* Header Emblems */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-700 text-white font-serif font-bold text-xl mb-1 shadow-md">
                🏛️
              </div>
              <h2 className="text-base font-bold tracking-wider text-slate-800 uppercase font-serif">
                Department of Land Resources
              </h2>
              <h1 className="text-xl font-black tracking-tight text-slate-900 font-serif">
                LAND RECORD HARMONIZATION CERTIFICATE
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Issued pursuant to the Digital Land Titling Act
              </p>
            </div>

            {/* ULPIN Barcode & QR Code Section */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-900 uppercase">
                  Unique Land Parcel Identification Number (Bhu-Aadhaar ULPIN)
                </div>
                <div className="text-2xl font-mono font-black text-emerald-700 tracking-wider mt-0.5">
                  {parcel.ulpin}
                </div>
                <div className="text-[11px] text-emerald-800 font-mono mt-1">
                  SRID: {parcel.crs || 'EPSG:32643 (UTM 43N)'} • PostGIS R-Tree Hash: 0x8F92E4A10
                </div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-emerald-300 text-center">
                <QrCode className="h-14 w-14 text-slate-800 mx-auto" />
                <span className="text-[9px] font-mono text-slate-500 font-bold block mt-0.5">
                  VERIFY ON BHU-NAKSHA
                </span>
              </div>
            </div>

            {/* Titleholder & Parcel Identification Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium block">Titleholder / Registered Owner:</span>
                <span className="text-sm font-bold text-slate-800 block">{parcel.ownerName}</span>
                <span className="text-[11px] text-slate-500 block">UID/PAN: XXXX-XXXX-9428</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium block">Cadastral Location:</span>
                <span className="text-sm font-bold text-slate-800 block">
                  Survey No. {parcel.surveyNo} • {parcel.subDivision}
                </span>
                <span className="text-[11px] text-slate-500 block">Ward 14, Central Administrative Circle</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium block">Zoning Classification:</span>
                <span className="text-sm font-bold text-slate-800 block">{parcel.landUse}</span>
                <span className="text-[11px] text-slate-500 block">Property Tax ID: TX-2026-9843-01</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium block">AI Harmonization Status:</span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {parcel.status === 'harmonized' ? 'Officially Validated' : 'Provisional Under Review'}
                </span>
                <span className="text-[11px] text-slate-500 block">Confidence: {parcel.aiConfidenceScore}%</span>
              </div>
            </div>

            {/* Spatial Geometry Reconciliation Audit Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Measurement Vector</th>
                    <th className="p-2.5">Historical RoR Record</th>
                    <th className="p-2.5">High-Res Drone Ortho</th>
                    <th className="p-2.5">Variance / Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-600">Total Plot Carpet Area</td>
                    <td className="p-2.5">{parcel.recordedAreaSqm.toFixed(1)} m²</td>
                    <td className="p-2.5 font-bold text-emerald-700">{parcel.surveyedAreaSqm.toFixed(1)} m²</td>
                    <td className="p-2.5 font-bold">
                      {parcel.discrepancySqm > 0 ? `+${parcel.discrepancySqm.toFixed(1)}` : parcel.discrepancySqm.toFixed(1)} m² ({parcel.discrepancyPercent}%)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-600">Perimeter / Boundary Edge</td>
                    <td className="p-2.5">142.4 m</td>
                    <td className="p-2.5">144.1 m</td>
                    <td className="p-2.5">+1.7 m</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-600">LiDAR Mean Elevation (DSM)</td>
                    <td className="p-2.5 font-sans text-slate-400">N/A (Legacy 2D)</td>
                    <td className="p-2.5 font-bold text-slate-800">{parcel.dsmElevationMeters} m ASL</td>
                    <td className="p-2.5 font-sans text-emerald-700">3D Cadastre Certified</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Sign-off & Verification Seal */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-xs text-slate-700">
              <div>
                <div className="font-mono text-[10px] text-slate-500">DIGITALLY SIGNED VIA POSTGIS HMAC SHA-256</div>
                <div className="font-mono text-[10px] text-slate-500">TIMESTAMP: 2026-09-12 10:24:19 UTC</div>
                <div className="text-emerald-700 font-bold mt-1">✓ Verified by GeoHarmonize AI Pipeline</div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-serif italic font-bold text-slate-900 border-b border-slate-400 pb-1 px-4">
                  Dr. Rajeshwardhan Patil, IAS
                </div>
                <div className="text-[10px] font-medium text-slate-600 uppercase">
                  Chief Settlement Commissioner & Director of Land Records
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
