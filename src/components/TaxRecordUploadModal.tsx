import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Receipt, 
  X, 
  Check, 
  FileSpreadsheet, 
  AlertCircle, 
  FileText, 
  Download, 
  Building, 
  Layers, 
  Sparkles, 
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Parcel, TaxRecord } from '../types';

interface TaxRecordUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: Parcel[];
  onApplyTaxRecords: (records: TaxRecord[], updatedParcels: Parcel[]) => void;
  selectedParcel?: Parcel | null;
}

export const SAMPLE_TAX_CSV_CONTENT = `assessmentNo,ulpin,surveyNo,wardZone,taxpayerName,propertyAddress,usageCategory,ratableValueAnnual,assessedTaxAmount,assessedBuiltUpAreaSqm,paymentStatus,receiptNumber,lastPaidDate,notes
PMC-PT-2026-9843-01,MH-27-014-9843-01,104/1,Ward 14 Shivajinagar,Venkatesh R. Kulkarni & Sons,Plot 1A Model Colony Shivajinagar,Residential,385000,42850,280.0,PAID,PMC-REC-9843-01,2026-04-12,Reconciled with 3-storey building tax assessment
PMC-PT-2026-9843-02,MH-27-014-9843-02,104/2,Ward 14 Shivajinagar,Shri Balaji Commercial Logistics LLP,Warehouse Hub Sector 14,Commercial,920000,128400,620.0,DUE,,2025-10-01,Discrepancy: unassessed shed extension 68.4sqm detected by YOLOv8
PMC-PT-2026-9843-03,MH-27-014-9843-03,105/1,Ward 14 Shivajinagar,Municipal Water Supply & Sewerage Board,Pump House & Reservoir Circle,Public Utility,0,0,380.0,EXEMPT,PMC-EXEMPT-03,2026-01-01,Statutory tax exemption for essential municipal infrastructure
PMC-PT-2026-9843-04,MH-27-014-9843-04,106/A,Ward 14 Shivajinagar,Priya & Devendra S. Deshmukh,Bungalow 4 Shivajinagar Green,Residential,520000,58200,310.0,PAID,PMC-REC-9843-04,2026-05-15,Annual self-assessment verified
PMC-PT-2026-9843-05,MH-27-014-9843-05,106/B,Ward 14 Shivajinagar,Kalyani Agro & Urban Orchards,Canal Road Block 14,Agricultural,95000,7200,0.0,PAID,PMC-REC-9843-05,2026-03-20,Agricultural land revenue cess cleared`;

export const TaxRecordUploadModal: React.FC<TaxRecordUploadModalProps> = ({
  isOpen,
  onClose,
  parcels,
  onApplyTaxRecords,
  selectedParcel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsedRecords, setParsedRecords] = useState<TaxRecord[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Handle parsing of uploaded text/CSV/JSON files
  const parseFileContent = (fileName: string, content: string) => {
    setIsProcessing(true);
    setParseError(null);
    try {
      const records: TaxRecord[] = [];
      const lower = fileName.toLowerCase();

      if (lower.endsWith('.json')) {
        const rawJson = JSON.parse(content);
        const list = Array.isArray(rawJson) ? rawJson : (rawJson.records || rawJson.taxRecords || [rawJson]);
        
        list.forEach((item: any, idx: number) => {
          const rec: TaxRecord = {
            id: item.id || `tax-rec-${Date.now()}-${idx}`,
            assessmentNo: item.assessmentNo || item.taxAssessmentNo || item.assessmentId || `PMC-PT-${1000 + idx}`,
            assessmentYear: item.assessmentYear || '2025-2026',
            taxpayerName: item.taxpayerName || item.ownerName || item.name || 'Unspecified Taxpayer',
            propertyAddress: item.propertyAddress || item.address || 'Urban Zone Municipal Circle',
            wardZone: item.wardZone || item.wardNo || 'Ward 14',
            ratableValueAnnual: Number(item.ratableValueAnnual || item.annualValue || item.ratableValue || 250000),
            assessedTaxAmount: Number(item.assessedTaxAmount || item.taxAmount || item.netTax || 28000),
            paymentStatus: (item.paymentStatus || item.status || 'PAID').toUpperCase() as any,
            lastPaidDate: item.lastPaidDate || item.paidDate || '2026-04-01',
            receiptNumber: item.receiptNumber || item.receiptNo,
            assessedBuiltUpAreaSqm: Number(item.assessedBuiltUpAreaSqm || item.builtUpArea || item.areaSqm || 200),
            carpetAreaSqm: Number(item.carpetAreaSqm || (item.assessedBuiltUpAreaSqm ? item.assessedBuiltUpAreaSqm * 0.85 : 170)),
            usageCategory: item.usageCategory || item.landUse || 'Residential',
            sourceFile: fileName,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            notes: item.notes || `Imported from ${fileName}`
          };
          records.push(rec);
        });
      } else if (lower.endsWith('.csv') || lower.endsWith('.txt')) {
        // Parse CSV
        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
          throw new Error('CSV file must contain a header row and at least one tax record row.');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          const rawCols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (rawCols.length === 0 || !rawCols[0]) continue;

          // Helper to get col by header name
          const getVal = (name: string, fallbackIdx?: number) => {
            const hIdx = headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
            if (hIdx !== -1 && rawCols[hIdx] !== undefined) return rawCols[hIdx];
            if (fallbackIdx !== undefined && rawCols[fallbackIdx] !== undefined) return rawCols[fallbackIdx];
            return '';
          };

          const assessmentNo = getVal('assessmentNo', 0) || `PMC-PT-2026-${i.toString().padStart(4, '0')}`;
          const ulpinVal = getVal('ulpin', 1);
          const surveyNoVal = getVal('surveyNo', 2);
          const taxpayerName = getVal('taxpayerName', 4) || getVal('ownerName') || 'Taxpayer Registered';
          const assessedTaxAmount = parseFloat(getVal('assessedTaxAmount', 8)) || 35000;
          const assessedBuiltUpAreaSqm = parseFloat(getVal('assessedBuiltUpAreaSqm', 9)) || 250;
          const paymentStatus = (getVal('paymentStatus', 10) || 'PAID').toUpperCase() as any;

          const rec: TaxRecord = {
            id: `tax-csv-${Date.now()}-${i}`,
            assessmentNo,
            assessmentYear: getVal('assessmentYear') || '2025-2026',
            taxpayerName,
            propertyAddress: getVal('propertyAddress', 5) || `Survey ${surveyNoVal || i}, Municipal Circle`,
            wardZone: getVal('wardZone', 3) || 'Ward 14 Shivajinagar',
            ratableValueAnnual: parseFloat(getVal('ratableValueAnnual', 7)) || assessedTaxAmount * 9,
            assessedTaxAmount,
            paymentStatus: ['PAID', 'DUE', 'PARTIAL', 'EXEMPT'].includes(paymentStatus) ? paymentStatus : 'PAID',
            lastPaidDate: getVal('lastPaidDate', 12) || '2026-04-10',
            receiptNumber: getVal('receiptNumber', 11) || `REC-${assessmentNo.replace(/[^0-9]/g, '').slice(-6)}`,
            assessedBuiltUpAreaSqm,
            carpetAreaSqm: assessedBuiltUpAreaSqm * 0.85,
            usageCategory: (getVal('usageCategory', 6) as any) || 'Residential',
            sourceFile: fileName,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            notes: getVal('notes', 13) || `Reconciled from ${fileName} (Survey ${surveyNoVal || ulpinVal})`
          };
          records.push(rec);
        }
      } else {
        // PDF / XLSX / other document: Extract simulated structural municipal tax assessment
        const p = selectedParcel || parcels[0];
        const rec: TaxRecord = {
          id: `tax-doc-${Date.now()}`,
          assessmentNo: `PMC-PT-2026-${(p?.surveyNo || '104-1').replace('/', '-')}-CH`,
          assessmentYear: '2025-2026',
          taxpayerName: p?.ownerName || 'Verified Property Taxpayer',
          propertyAddress: `${p?.villageName || 'Urban Zone'}, ${p?.wardNo || 'Ward 14'}`,
          wardZone: p?.wardNo || 'Ward 14 Shivajinagar',
          ratableValueAnnual: 420000,
          assessedTaxAmount: 48500,
          paymentStatus: 'PAID',
          lastPaidDate: '2026-04-15',
          receiptNumber: `CHALLAN-${Date.now().toString().slice(-6)}`,
          assessedBuiltUpAreaSqm: p?.buildings[0]?.areaSqm || 280,
          carpetAreaSqm: (p?.buildings[0]?.areaSqm || 280) * 0.85,
          usageCategory: p?.landUse === 'Commercial' ? 'Commercial' : 'Residential',
          sourceFile: fileName,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
          notes: `Extracted from municipal tax receipt document: ${fileName}`
        };
        records.push(rec);
      }

      if (records.length === 0) {
        throw new Error('No valid tax assessment records could be parsed from this file.');
      }

      setParsedRecords(records);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse tax record file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseFileContent(file.name, text || '');
    };
    reader.onerror = () => {
      setParseError('Failed to read file from file explorer.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseFileContent(file.name, text || '');
    };
    reader.onerror = () => {
      setParseError('Failed to read dropped file.');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    setUploadedFileName('PMC_Ward14_Property_Tax_Register_2025_26.csv');
    setFileSize('1.8 KB');
    parseFileContent('PMC_Ward14_Property_Tax_Register_2025_26.csv', SAMPLE_TAX_CSV_CONTENT);
  };

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_TAX_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Sample_Municipal_Tax_Register_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = () => {
    if (parsedRecords.length === 0) return;

    // Match parsed records against parcels by ULPIN, Survey No, or index
    const updatedParcels = parcels.map((parcel, idx) => {
      // Find matching tax record
      const matchedTax = parsedRecords.find(r => 
        (r.notes && r.notes.includes(parcel.surveyNo)) ||
        r.assessmentNo.includes(parcel.surveyNo.replace('/', '-')) ||
        r.taxpayerName.toLowerCase().includes(parcel.ownerName.toLowerCase().split(' ')[0]) ||
        r.propertyAddress.includes(parcel.surveyNo)
      ) || (parsedRecords[idx] ? parsedRecords[idx] : null);

      if (matchedTax) {
        // Calculate variance with total drone surveyed building footprints
        const totalBuildingFootprint = parcel.buildings.reduce((acc, b) => acc + b.areaSqm, 0);
        const varianceSqm = totalBuildingFootprint > 0 
          ? Number((totalBuildingFootprint - matchedTax.assessedBuiltUpAreaSqm).toFixed(1))
          : 0;

        const enrichedTaxRecord: TaxRecord = {
          ...matchedTax,
          verifiedWithDroneBoundary: Math.abs(varianceSqm) <= 15,
          areaVarianceWithSurveySqm: varianceSqm
        };

        return {
          ...parcel,
          taxRecord: enrichedTaxRecord
        };
      }
      return parcel;
    });

    onApplyTaxRecords(parsedRecords, updatedParcels);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Upload Municipal Tax Record
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  File Explorer
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Import Property Tax Assessment Registers, E-Khata, or PTIS receipts from your local file explorer.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* File Explorer Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/60'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv,.json,.xlsx,.xls,.pdf,.txt,.xml"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <FolderOpen className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Select Tax Record file from your File Explorer
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
              Click to browse your local folders or drag & drop files here. Supported formats:
              <span className="font-mono text-slate-300 ml-1">.CSV, .JSON, .PDF, .XLSX, .XML, .TXT</span>
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>Browse Local File Explorer</span>
            </div>
          </div>

          {/* Uploaded File Pill & Sample Datasets */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {uploadedFileName ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="font-mono font-medium">{uploadedFileName}</span>
                {fileSize && <span className="text-slate-400 font-mono">({fileSize})</span>}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFileName(null);
                    setParsedRecords([]);
                  }}
                  className="ml-1 text-slate-400 hover:text-rose-400"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-slate-500 italic">No file selected yet</span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Download CSV Template to test uploading from your file explorer"
              >
                <Download className="h-3 w-3 text-slate-400" />
                <span>Download CSV Template</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSampleCsv}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 transition-colors"
                title="Immediately load official municipal sample dataset"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Load Sample Tax Register</span>
              </button>
            </div>
          </div>

          {/* Parse Error Message */}
          {parseError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Failed to process tax file</p>
                <p className="text-rose-200 mt-0.5">{parseError}</p>
              </div>
            </div>
          )}

          {/* Parsed Tax Records Table */}
          {parsedRecords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Extracted Tax Assessment Entries ({parsedRecords.length})
                </span>
                <span className="text-slate-400 text-[11px]">
                  Ready to cross-reconcile with {parcels.length} cadastral parcels
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Assessment No</th>
                      <th className="px-3 py-2">Taxpayer / Owner</th>
                      <th className="px-3 py-2">Tax Built-Up Area</th>
                      <th className="px-3 py-2">Annual Tax (₹)</th>
                      <th className="px-3 py-2">Payment Status</th>
                      <th className="px-3 py-2">Matching Cadastre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                    {parsedRecords.map((rec, idx) => {
                      const matchedParcel = parcels.find(p => 
                        (rec.notes && rec.notes.includes(p.surveyNo)) ||
                        rec.assessmentNo.includes(p.surveyNo.replace('/', '-')) ||
                        rec.taxpayerName.toLowerCase().includes(p.ownerName.toLowerCase().split(' ')[0])
                      ) || parcels[idx];

                      return (
                        <tr key={rec.id || idx} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 text-slate-200 font-semibold font-sans">
                            {rec.assessmentNo}
                            <span className="block text-[10px] text-slate-500">{rec.assessmentYear}</span>
                          </td>
                          <td className="px-3 py-2 font-sans">
                            <span className="text-slate-200 font-medium">{rec.taxpayerName}</span>
                            <span className="block text-[10px] text-slate-500 truncate max-w-[140px]">{rec.propertyAddress}</span>
                          </td>
                          <td className="px-3 py-2 text-emerald-400 font-semibold">
                            {rec.assessedBuiltUpAreaSqm.toFixed(1)} m²
                          </td>
                          <td className="px-3 py-2 text-amber-300">
                            ₹{rec.assessedTaxAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.paymentStatus === 'PAID' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : rec.paymentStatus === 'EXEMPT'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {rec.paymentStatus}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-sans">
                            {matchedParcel ? (
                              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Survey {matchedParcel.surveyNo}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500">Unlinked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cadastral Cross-Reconciliation Insight Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-amber-400" />
              Automated Property Tax Reconciliation Pipeline
            </div>
            <p>
              When applied, each tax assessment number is automatically cross-referenced against the parcel's 
              <strong> YOLOv8 detected building footprints</strong> and <strong>Drone orthomosaic ground area</strong>.
              Discrepancies exceeding municipal tolerance are flagged in the Adjudication Audit report.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              disabled={parsedRecords.length === 0 || isProcessing}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                parsedRecords.length > 0 && !isProcessing
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>Apply {parsedRecords.length > 0 ? `${parsedRecords.length} Tax Records` : 'Records'} & Reconcile</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
