import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Camera,
  CheckCircle2,
  Sparkles,
  Copy,
  Eye,
  Check
} from 'lucide-react';
import { DATASET_CATALOG, createDatasetPdfDocument, downloadDatasetPdf } from '../utils/generateDatasetPdf';

interface DatasetListPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetListPdfModal: React.FC<DatasetListPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'preview'>('catalog');
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadClient = () => {
    try {
      downloadDatasetPdf('GeoHarmonize_Drone_Cadastral_Datasets_Reference.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.warn('Direct PDF download fallback:', err);
      const link = document.createElement('a');
      link.href = '/api/datasets/pdf?download=true';
      link.download = 'GeoHarmonize_Drone_Cadastral_Datasets_Reference.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handlePreviewPdf = () => {
    try {
      if (!previewBlobUrl) {
        const doc = createDatasetPdfDocument();
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        setPreviewBlobUrl(blobUrl);
      }
      setActiveTab('preview');
    } catch (err) {
      console.warn('Embedded PDF creation fallback:', err);
      setPreviewBlobUrl('/api/datasets/pdf');
      setActiveTab('preview');
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/api/datasets/pdf`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const categories = [
    { id: 'Sample Aerial Imagery', label: '1. Sample Drone Orthomosaics (In-App Presets)', icon: Camera, color: 'text-emerald-400' },
    { id: 'Cadastral Standards', label: '2. National Cadastral Standards & Bhu-Aadhaar', icon: Shield, color: 'text-blue-400' },
    { id: 'AI Training Datasets', label: '3. AI Drone Boundary Segmentation Datasets', icon: Sparkles, color: 'text-purple-400' },
    { id: 'Open Geospatial Repositories', label: '4. Open Geospatial Vector Repositories', icon: Database, color: 'text-amber-400' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="dataset-pdf-modal-container"
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base">
                  Drone & Cadastral Datasets Reference Directory
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  PDF Available
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete catalog of aerial survey imagery, national cadastral schemas (SVAMITVA, DILRMP), and AI boundary training benchmarks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewPdf}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Preview PDF directly in browser"
            >
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Preview</span>
            </button>

            <button
              onClick={handleDownloadClient}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              title="Download formatted PDF document instantly"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Navigation */}
        <div className="px-6 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dataset Catalog Grid
            </button>
            <button
              onClick={handlePreviewPdf}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>Embedded PDF Preview</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            ISO 19152 (LADM) • EPSG:32643
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {activeTab === 'preview' ? (
            <div className="w-full h-full min-h-[520px] flex flex-col gap-3">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Viewing: GeoHarmonize_Drone_Cadastral_Datasets_Reference.pdf</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadClient}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Back to Catalog
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full min-h-[460px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <iframe
                  src={previewBlobUrl || '/api/datasets/pdf'}
                  className="w-full h-full min-h-[460px] border-0"
                  title="Official Datasets Catalog PDF Document"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Top Quick Action Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 shadow-lg flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      <span>Official Dataset Catalog Specification (PDF)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                        v2.4
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Download or preview the document directly. Includes calibrated GSD specs, CRS coordinates, and official government portal links.
                    </p>
                  </div>

                  {downloadSuccess && (
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs flex items-center gap-1.5 animate-in fade-in">
                      <Check className="h-3.5 w-3.5" />
                      <span>Downloaded successfully!</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  {/* Primary Instant Download Button (Client-side, never fails) */}
                  <button
                    onClick={handleDownloadClient}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    title="Generate and download PDF directly in your browser"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>1-Click Download PDF</span>
                  </button>

                  {/* Instant In-Modal Preview */}
                  <button
                    onClick={handlePreviewPdf}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Open PDF preview right inside the application"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-400" />
                    <span>View PDF Preview</span>
                  </button>

                  {/* Copy Direct URL */}
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy direct download link to clipboard"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Direct Link'}</span>
                  </button>

                  {/* Server Static Direct Link */}
                  <a
                    href="/GeoHarmonize_Drone_Cadastral_Datasets_Reference.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors ml-auto"
                    title="Open static PDF file hosted on server"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    <span>Static File Link</span>
                  </a>
                </div>
              </div>

          {/* Categorized Dataset List */}
          {categories.map((cat) => {
            const Icon = cat.icon;
            const items = DATASET_CATALOG.filter(d => d.category === cat.id);
            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Icon className={`h-4 w-4 ${cat.color}`} />
                  <h4 className="font-bold text-sm text-white">
                    {cat.label}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 ml-auto">
                    {items.length} Resources
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {items.map((item, idx) => (
                    <div 
                      key={`${item.name}-${idx}`}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="font-semibold text-slate-100 text-xs">
                          {item.name}
                        </div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 shrink-0 break-all"
                        >
                          <span className="truncate max-w-[280px] sm:max-w-xs">{item.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed">
                        {item.description}
                      </p>

                      {item.technicalSpecs && (
                        <div className="pt-1.5 border-t border-slate-800/80 font-mono text-[11px] text-emerald-400/90">
                          {item.technicalSpecs}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            Standard: ISO 19152 (LADM) • PostGIS EPSG:32643 (UTM 43N)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewPdf}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>Preview Tab</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownloadClient}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Dataset List (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
