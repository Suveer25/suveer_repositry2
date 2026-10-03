export interface Coordinate {
  lng: number;
  lat: number;
}

export interface TiePoint {
  id: string;
  sourceX: number; // Legacy pixel/map coordinate
  sourceY: number;
  targetLng: number; // Drone Ortho georeferenced
  targetLat: number;
  confidence: number;
  residualErrorMeters: number;
  type: 'LoFTR' | 'SuperGlue' | 'Manual_GCP';
}

export interface BuildingFootprint {
  id: string;
  class: 'Residential' | 'Commercial' | 'Industrial' | 'Encroached_Structure' | 'Boundary_Wall';
  confidence: number;
  floors: number;
  heightMeters: number;
  areaSqm: number;
  isEncroached: boolean;
  encroachmentSqm?: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

export interface VerticalUnit {
  unitId: string;
  subUlpin: string;
  floorLevel: string;
  ownerName: string;
  usageType: 'Residential Apartment' | 'Retail Shop' | 'Office Suite' | 'Terrace Utility';
  carpetAreaSqm: number;
  undividedSharePercent: number;
  taxAssessmentNo: string;
}

export interface TopologyIssue {
  id: string;
  type: 'SLIVER_POLYGON' | 'BOUNDARY_OVERLAP' | 'DISJOINT_GAP' | 'AREA_MISMATCH';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedAreaSqm: number;
  coordinates: Coordinate[];
  suggestedAction: string;
  resolved: boolean;
}

export interface TaxRecord {
  id: string;
  assessmentNo: string; // e.g., 'PMC-PT-2026-9843-01'
  assessmentYear: string; // e.g., '2025-2026'
  taxpayerName: string;
  propertyAddress: string;
  wardZone: string;
  ratableValueAnnual: number;
  assessedTaxAmount: number;
  paymentStatus: 'PAID' | 'DUE' | 'PARTIAL' | 'EXEMPT';
  lastPaidDate?: string;
  receiptNumber?: string;
  assessedBuiltUpAreaSqm: number;
  carpetAreaSqm?: number;
  usageCategory: 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial' | 'Exempt Institutional';
  sourceFile?: string;
  uploadedAt: string;
  verifiedWithDroneBoundary?: boolean;
  areaVarianceWithSurveySqm?: number;
  notes?: string;
}

export interface Parcel {
  id: string;
  ulpin: string; // 14-digit Unique Land Parcel Identification Number (Bhu-Aadhaar)
  surveyNo: string;
  subDivision: string;
  villageName: string;
  wardNo: string;
  ownerName: string;
  fatherHusbandName: string;
  landUse: 'Residential' | 'Commercial' | 'Agricultural' | 'Public Utility' | 'Water Body';
  recordedAreaSqm: number; // From paper revenue Record of Rights (RoR)
  surveyedAreaSqm: number; // From Drone Orthomosaic + SAM extraction
  discrepancySqm: number;
  discrepancyPercent: number;
  aiConfidenceScore: number; // 0 - 100%
  status: 'harmonized' | 'review_required' | 'conflict_encroachment' | 'unregistered';
  polygon: Coordinate[]; // Harmonized polygon coordinates
  legacyPolygon: Coordinate[]; // Digitized legacy paper boundary
  samExtractedPolygon: Coordinate[]; // SAM zero-shot segmented boundary
  centroid: Coordinate;
  tiePointsCount: number;
  dsmElevationMeters: number;
  buildings: BuildingFootprint[];
  verticalUnits?: VerticalUnit[];
  taxRecord?: TaxRecord;
  topologyIssues: TopologyIssue[];
  lastHarmonizedAt: string;
  surveyorNotes: string;
  postgisGeomText: string;
  crs: string;
}

export interface UrbanWard {
  id: string;
  wardNo: string;
  name: string;
  city: string;
  state: string;
  statementType: string;
  zone: string;
  epsgCrs: string;
  centroid: Coordinate;
}

export interface ETLJob {
  id: string;
  jobName: string;
  module: 'GDAL_REPROJECT' | 'LOFTR_RUBBERSHEET' | 'SAM_SEGMENTATION' | 'YOLOV8_INFERENCE' | 'TOPOLOGY_AUDIT' | 'RASTERIO_TILING';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0 - 100
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  inputDataset: string;
  outputFormat: string;
  logs: string[];
  metrics: {
    crsSource?: string;
    crsTarget?: string;
    featuresProcessed?: number;
    gpuAllocation?: string;
    meanIoU?: number;
    rmseMeters?: number;
    sliversRemoved?: number;
    tilesGenerated?: number;
  };
}

export interface ClusterStatus {
  k8sStatus: 'Operational' | 'Scaling' | 'Degraded';
  activePods: number;
  gpuNodes: {
    name: string;
    model: 'NVIDIA A10G (24GB)' | 'NVIDIA T4 (16GB)';
    vramUsedGb: number;
    vramTotalGb: number;
    gpuUtilPercent: number;
    temperatureC: number;
    assignedTask: string;
  }[];
  postgisStats: {
    version: string;
    activeConnections: number;
    totalParcelsIndexed: number;
    rTreeIndexHitRatio: number;
    dbSizeMb: number;
  };
  celeryWorkers: {
    workerId: string;
    status: 'BUSY' | 'IDLE';
    concurrency: number;
    activeJob?: string;
  }[];
  redisQueueDepth: number;
}

export interface BoundedBorderPolygon {
  id: string;
  label: string;
  classification: 'Cadastral_Boundary' | 'Agricultural_Ridge' | 'Compound_Wall' | 'Building_Footprint' | 'Road_Corridor';
  confidence: number;
  normalizedPolygon: { x: number; y: number }[]; // 0..1 relative to image width & height
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY] normalized 0..1
  estimatedAreaSqm: number;
  perimeterMeters: number;
  cornerStones: { id: string; x: number; y: number; label: string }[];
  geoPolygon?: Coordinate[];
  color: string;
  isEncroached?: boolean;
}

export interface DroneBoundaryDetectionResult {
  imageId: string;
  imageName: string;
  dimensions: { width: number; height: number };
  detectedBorders: BoundedBorderPolygon[];
  overallConfidence: number;
  modelUsed: 'SAM_ViT_Huge' | 'Gemini_Vision_AI' | 'Canny_Contour_Detector' | 'Hybrid_GeoAI';
  processingTimeMs: number;
  boundaryCount: number;
  totalAreaSqm: number;
  status: 'detected' | 'committed';
}

export interface DroneImageData {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  uploadDate: string;
  resolutionGsd: string;
  crs: string;
  opacity: number;
  sourceType: 'custom_upload' | 'sample_orthomosaic';
  detectedBorders?: BoundedBorderPolygon[];
  geoBoundingBox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  isBounded?: boolean;
}
