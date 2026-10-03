import { jsPDF } from 'jspdf';

export interface DatasetItem {
  name: string;
  category: 'Sample Aerial Imagery' | 'Cadastral Standards' | 'AI Training Datasets' | 'Open Geospatial Repositories';
  url: string;
  description: string;
  technicalSpecs?: string;
}

export const DATASET_CATALOG: DatasetItem[] = [
  // 1. Sample Drone Orthomosaic Imagery
  {
    name: 'Ward 14 Shivajinagar Urban Compound Orthomosaic (Preset 1)',
    category: 'Sample Aerial Imagery',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325',
    description: 'High-resolution nadir aerial survey photography covering urban residential parcel compounds, boundary walls, and access corridors.',
    technicalSpecs: 'Resolution: 4.8 cm/px GSD • Dimensions: 4096x3072 • CRS: EPSG:32643 (UTM 43N)'
  },
  {
    name: 'Ward 15 Aundh Agricultural Plot & Ridge Boundary (Preset 2)',
    category: 'Sample Aerial Imagery',
    url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61',
    description: 'Calibrated top-down aerial imagery displaying agricultural plot boundaries, hedgerows, and irrigation ditch ridges for SAM zero-shot delineation.',
    technicalSpecs: 'Resolution: 5.2 cm/px GSD • Dimensions: 3840x2880 • CRS: EPSG:32643 (UTM 43N)'
  },
  {
    name: 'Ward 16 Kothrud Metro Commercial Subdivision (Preset 3)',
    category: 'Sample Aerial Imagery',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    description: 'Nadir drone survey imagery of commercial land subdivisions, road setback alignments, and multi-tenant structural boundaries.',
    technicalSpecs: 'Resolution: 4.5 cm/px GSD • Dimensions: 4096x3072 • CRS: EPSG:32643 (UTM 43N)'
  },

  // 2. Cadastral Spatial Schemas & Standards
  {
    name: 'SVAMITVA Drone Survey Scheme Portal',
    category: 'Cadastral Standards',
    url: 'https://svamitva.nic.in',
    description: 'Survey of Villages and Mapping with Improvised Technology in Village Areas by Ministry of Panchayati Raj & Survey of India. Establishes the 5cm drone orthomosaic standard for property cards (Sampatti Patrak).',
    technicalSpecs: 'Authority: Survey of India (SoI) • Ground Sample Distance: <= 5cm • Spatial Datum: WGS 84 / UTM'
  },
  {
    name: 'DILRMP & Bhu-Aadhaar (ULPIN) Standards',
    category: 'Cadastral Standards',
    url: 'https://dilrmp.gov.in',
    description: 'Digital India Land Records Modernization Programme by Department of Land Resources (DoLR), Ministry of Rural Development. Standardizes the 14-digit Unique Land Parcel Identification Number (Bhu-Aadhaar).',
    technicalSpecs: 'ULPIN Formula: Lat/Long Centroid Encoding (14-Character Alphanumeric) • ISO 19152 LADM Aligned'
  },
  {
    name: 'ISRO Bhuvan Indian Geo-Platform',
    category: 'Cadastral Standards',
    url: 'https://bhuvan.nrsc.gov.in',
    description: 'National Remote Sensing Centre (NRSC) / ISRO spatial web portal providing Indian satellite imagery, topographic maps, village cadastral boundaries, and thematic raster layers.',
    technicalSpecs: 'Data Layers: Cartosat, LISS-IV, Bhuvan Thematic • Web Services: OGC WMS 1.3.0 / WFS 2.0.0'
  },

  // 3. AI Training Datasets & Benchmarks
  {
    name: 'OpenAerialMap (OAM) Global Drone Repository',
    category: 'AI Training Datasets',
    url: 'https://openaerialmap.org',
    description: 'Open-access, crowd-sourced repository of worldwide drone, UAV, and aerial orthomosaics with open GeoTIFF downloads and COG (Cloud Optimized GeoTIFF) endpoints.',
    technicalSpecs: 'Format: GeoTIFF, COG, TileJSON • License: Creative Commons Attribution (CC-BY 4.0)'
  },
  {
    name: 'SpaceNet Building Footprint & Parcel Extraction Datasets',
    category: 'AI Training Datasets',
    url: 'https://spacenet.ai',
    description: 'Benchmark labeled geospatial datasets designed for automated computer-vision polygon boundary delineation, building footprint extraction, and road network vectorization.',
    technicalSpecs: 'Data Volumes: 5+ Million Annotated Footprints • Sensors: WorldView-2, WorldView-3 (30cm/50cm)'
  },
  {
    name: 'Inria Aerial Image Labeling Benchmark',
    category: 'AI Training Datasets',
    url: 'https://project.inria.fr/aerialimagelabeling/',
    description: 'Gold-standard computer vision dataset for aerial semantic segmentation and boundary extraction across diverse urban and rural densities (0.3m resolution).',
    technicalSpecs: 'Coverage: 810 km² • Cities: Austin, Chicago, Kitsap, Vienna, Tyrol • Labeled: Building & Parcel Masks'
  },
  {
    name: 'Meta AI Segment Anything (SAM) Dataset (SA-1B)',
    category: 'AI Training Datasets',
    url: 'https://ai.meta.com/datasets/segment-anything/',
    description: 'The dataset powering zero-shot boundary delineation and promptable segmentation (ViT-Huge / ViT-Large models) used for interactive boundary tracing in this app.',
    technicalSpecs: 'Volume: 1.1 Billion Segmentation Masks • 11 Million High-Resolution Images • Zero-Shot Capable'
  },
  {
    name: 'OpenStreetMap (OSM) Global Vector Geodata',
    category: 'Open Geospatial Repositories',
    url: 'https://www.openstreetmap.org',
    description: 'Collaborative spatial database providing boundary polygons, parcel boundaries, land use classifications, and infrastructure corridors worldwide.',
    technicalSpecs: 'Format: GeoJSON, OSM PBF, Overpass API • CRS: EPSG:4326 (WGS 84)'
  }
];

/**
 * Builds and returns a fully styled jsPDF document
 */
export function createDatasetPdfDocument(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = 18;

  // Helper for adding page header
  const addHeader = (title: string, sub: string) => {
    // Top banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 24, pageWidth, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(sub, margin, 18);

    doc.setTextColor(52, 211, 153); // emerald-400
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL REFERENCE SPECIFICATION', pageWidth - margin, 14, { align: 'right' });
  };

  // Helper for adding footer
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('GeoHarmonize AI Cadastral Engine • Drone Boundary Detection & PostGIS Harmonization', margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // PAGE 1: COVER & OVERVIEW
  addHeader(
    'GEOHARMONIZE: URBAN LAND RECORD INTELLIGENCE',
    'AI Drone Boundary Detection & Cadastral Vector Harmonization'
  );

  y = 36;

  // Document Title Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Geospatial & Drone Dataset Directory', margin + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('Official catalog of drone orthomosaic imagery presets, national cadastral survey standards', margin + 6, y + 17);
  doc.text('(SVAMITVA, DILRMP Bhu-Aadhaar ULPIN), and public computer-vision boundary training benchmarks.', margin + 6, y + 22);

  // Metadata pills
  const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`Document Version: 2.4-LADMR`, margin + 6, y + 31);
  doc.setTextColor(71, 85, 105);
  doc.text(`Published: ${nowStr} • Format: ISO 19152 & PostGIS EPSG:32643 (UTM 43N)`, margin + 54, y + 31);

  y += 46;

  // Categories rendering
  const categories = [
    'Sample Aerial Imagery',
    'Cadastral Standards',
    'AI Training Datasets',
    'Open Geospatial Repositories'
  ] as const;

  for (const cat of categories) {
    const items = DATASET_CATALOG.filter(d => d.category === cat);
    if (items.length === 0) continue;

    // Check page overflow
    if (y > pageHeight - 45) {
      doc.addPage();
      addHeader('GEOHARMONIZE: DATASET DIRECTORY', 'AI Drone Boundary Detection & Cadastral Standards');
      y = 34;
    }

    // Category Header
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(margin, y, 3, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(cat.toUpperCase(), margin + 6, y + 6);

    y += 11;

    for (const item of items) {
      const boxHeight = item.technicalSpecs ? 24 : 19;

      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        addHeader('GEOHARMONIZE: DATASET DIRECTORY', 'AI Drone Boundary Detection & Cadastral Standards');
        y = 34;
      }

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(item.name, margin + 4, y + 6);

      // Description (wrapped)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      const splitDesc = doc.splitTextToSize(item.description, contentWidth - 8);
      doc.text(splitDesc[0] || '', margin + 4, y + 11);

      // Technical Specs
      if (item.technicalSpecs) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(16, 149, 107); // emerald-700
        doc.text(item.technicalSpecs, margin + 4, y + 16);
      }

      // Clickable URL
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(37, 99, 235); // blue-600
      const urlY = item.technicalSpecs ? y + 21 : y + 16;
      doc.textWithLink(item.url, margin + 4, urlY, { url: item.url });

      y += boxHeight + 3.5;
    }

    y += 3;
  }

  // Final summary box
  if (y > pageHeight - 40) {
    doc.addPage();
    addHeader('GEOHARMONIZE: DATASET DIRECTORY', 'AI Drone Boundary Detection & Cadastral Standards');
    y = 34;
  }

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('How to Use These Datasets with GeoHarmonize:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Upload any GeoTIFF, PNG, or JPEG from OpenAerialMap or your UAV flight using the [Upload Drone Image] tool.', margin + 4, y + 11);
  doc.text('2. The integrated SAM (Segment Anything) and Canny/Contour models will detect and bound parcel borders automatically.', margin + 4, y + 15);
  doc.text('3. Commit bounded vector borders into PostGIS with official 14-character Bhu-Aadhaar (ULPIN) identifiers.', margin + 4, y + 19);

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc;
}

/**
 * Direct download trigger in browser
 */
export function downloadDatasetPdf(filename: string = 'GeoHarmonize_Drone_Cadastral_Datasets_Reference.pdf') {
  const doc = createDatasetPdfDocument();
  doc.save(filename);
}
