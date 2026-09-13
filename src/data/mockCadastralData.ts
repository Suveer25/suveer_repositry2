import { Parcel, ETLJob, ClusterStatus, TiePoint } from '../types';

// Centroid reference: Urban Extension Sector 14 (UTM Zone 43N / WGS84)
export const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'P-104-1',
    ulpin: 'MH-27-014-9843-01',
    surveyNo: '104/1',
    subDivision: '1A',
    villageName: 'Shivajinagar Urban Zone',
    wardNo: 'Ward 14',
    ownerName: 'Venkatesh R. Kulkarni & Sons',
    fatherHusbandName: 'Ramchandra Kulkarni',
    landUse: 'Residential',
    recordedAreaSqm: 840.0,
    surveyedAreaSqm: 864.5,
    discrepancySqm: 24.5,
    discrepancyPercent: 2.92,
    aiConfidenceScore: 94.8,
    status: 'harmonized',
    polygon: [
      { lng: 73.8540, lat: 18.5230 },
      { lng: 73.8562, lat: 18.5234 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8538, lat: 18.5215 },
      { lng: 73.8540, lat: 18.5230 }
    ],
    legacyPolygon: [
      { lng: 73.8539, lat: 18.5232 },
      { lng: 73.8564, lat: 18.5236 },
      { lng: 73.8561, lat: 18.5217 },
      { lng: 73.8536, lat: 18.5213 },
      { lng: 73.8539, lat: 18.5232 }
    ],
    samExtractedPolygon: [
      { lng: 73.8540, lat: 18.5230 },
      { lng: 73.8562, lat: 18.5234 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8538, lat: 18.5215 },
      { lng: 73.8540, lat: 18.5230 }
    ],
    centroid: { lng: 73.8550, lat: 18.5224 },
    tiePointsCount: 14,
    dsmElevationMeters: 564.2,
    buildings: [
      {
        id: 'BLD-104-1A',
        class: 'Residential',
        confidence: 0.96,
        floors: 3,
        heightMeters: 10.5,
        areaSqm: 280.0,
        isEncroached: false,
        bbox: [73.8545, 18.5220, 73.8555, 18.5228]
      }
    ],
    verticalUnits: [
      {
        unitId: 'VU-104-1-01',
        subUlpin: 'MH-27-014-9843-01/FL01',
        floorLevel: 'Ground Floor',
        ownerName: 'Venkatesh R. Kulkarni',
        usageType: 'Residential Apartment',
        carpetAreaSqm: 124.0,
        undividedSharePercent: 33.3,
        taxAssessmentNo: 'MC-2026-9843-A'
      },
      {
        unitId: 'VU-104-1-02',
        subUlpin: 'MH-27-014-9843-01/FL02',
        floorLevel: '1st Floor',
        ownerName: 'Sunita V. Kulkarni',
        usageType: 'Residential Apartment',
        carpetAreaSqm: 124.0,
        undividedSharePercent: 33.3,
        taxAssessmentNo: 'MC-2026-9843-B'
      },
      {
        unitId: 'VU-104-1-03',
        subUlpin: 'MH-27-014-9843-01/FL03',
        floorLevel: '2nd Floor Penthouse',
        ownerName: 'Rohan V. Kulkarni',
        usageType: 'Residential Apartment',
        carpetAreaSqm: 132.0,
        undividedSharePercent: 33.4,
        taxAssessmentNo: 'MC-2026-9843-C'
      }
    ],
    taxRecord: {
      id: 'tax-pmc-104-1',
      assessmentNo: 'PMC-PT-2026-9843-01',
      assessmentYear: '2025-2026',
      taxpayerName: 'Venkatesh R. Kulkarni & Sons',
      propertyAddress: 'Plot 1A Model Colony, Ward 14 Shivajinagar',
      wardZone: 'Ward 14',
      ratableValueAnnual: 385000,
      assessedTaxAmount: 42850,
      paymentStatus: 'PAID',
      lastPaidDate: '2026-04-12',
      receiptNumber: 'PMC-REC-9843-01',
      assessedBuiltUpAreaSqm: 280.0,
      carpetAreaSqm: 238.0,
      usageCategory: 'Residential',
      sourceFile: 'PMC_Ward14_Property_Tax_Register_2025_26.csv',
      uploadedAt: '2026-09-10 14:32 UTC',
      verifiedWithDroneBoundary: true,
      areaVarianceWithSurveySqm: 0.0,
      notes: 'Fully reconciled with 3-storey building footprint (280 m²)'
    },
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-10 14:32 UTC',
    surveyorNotes: 'Boundary marks reconciled with high-res drone orthomosaic. SAM edge matches ground boundary wall.',
    postgisGeomText: 'POLYGON((73.8540 18.5230, 73.8562 18.5234, 73.8560 18.5218, 73.8538 18.5215, 73.8540 18.5230))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-104-2',
    ulpin: 'MH-27-014-9843-02',
    surveyNo: '104/2',
    subDivision: '1B',
    villageName: 'Shivajinagar Urban Zone',
    wardNo: 'Ward 14',
    ownerName: 'Shri Balaji Commercial Logistics LLP',
    fatherHusbandName: 'Director: Anand Patwardhan',
    landUse: 'Commercial',
    recordedAreaSqm: 1120.0,
    surveyedAreaSqm: 1245.8,
    discrepancySqm: 125.8,
    discrepancyPercent: 11.23,
    aiConfidenceScore: 68.4,
    status: 'conflict_encroachment',
    polygon: [
      { lng: 73.8562, lat: 18.5234 },
      { lng: 73.8588, lat: 18.5238 },
      { lng: 73.8585, lat: 18.5219 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8562, lat: 18.5234 }
    ],
    legacyPolygon: [
      { lng: 73.8564, lat: 18.5236 },
      { lng: 73.8582, lat: 18.5237 },
      { lng: 73.8580, lat: 18.5220 },
      { lng: 73.8561, lat: 18.5217 },
      { lng: 73.8564, lat: 18.5236 }
    ],
    samExtractedPolygon: [
      { lng: 73.8562, lat: 18.5234 },
      { lng: 73.8588, lat: 18.5238 },
      { lng: 73.8585, lat: 18.5219 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8562, lat: 18.5234 }
    ],
    centroid: { lng: 73.8574, lat: 18.5227 },
    tiePointsCount: 9,
    dsmElevationMeters: 563.8,
    buildings: [
      {
        id: 'BLD-104-2A',
        class: 'Commercial',
        confidence: 0.94,
        floors: 4,
        heightMeters: 14.8,
        areaSqm: 620.0,
        isEncroached: false,
        bbox: [73.8566, 18.5222, 73.8580, 18.5232]
      },
      {
        id: 'BLD-104-ENC-1',
        class: 'Encroached_Structure',
        confidence: 0.91,
        floors: 1,
        heightMeters: 3.8,
        areaSqm: 68.4,
        isEncroached: true,
        encroachmentSqm: 54.2,
        bbox: [73.8583, 18.5220, 73.8588, 18.5228]
      }
    ],
    topologyIssues: [
      {
        id: 'TOP-01',
        type: 'BOUNDARY_OVERLAP',
        severity: 'high',
        description: 'East compound wall overlaps with Municipal Right-of-Way buffer by 0.65m.',
        affectedAreaSqm: 54.2,
        coordinates: [
          { lng: 73.8585, lat: 18.5222 },
          { lng: 73.8588, lat: 18.5228 }
        ],
        suggestedAction: 'Execute Shapely polygon clipping against Municipal RoW master polygon.',
        resolved: false
      }
    ],
    taxRecord: {
      id: 'tax-pmc-104-2',
      assessmentNo: 'PMC-PT-2026-9843-02',
      assessmentYear: '2025-2026',
      taxpayerName: 'Shri Balaji Commercial Logistics LLP',
      propertyAddress: 'Warehouse Hub Sector 14, Ward 14 Shivajinagar',
      wardZone: 'Ward 14',
      ratableValueAnnual: 920000,
      assessedTaxAmount: 128400,
      paymentStatus: 'DUE',
      lastPaidDate: '2025-10-01',
      receiptNumber: 'PMC-DEMAND-2026-104',
      assessedBuiltUpAreaSqm: 620.0,
      carpetAreaSqm: 540.0,
      usageCategory: 'Commercial',
      sourceFile: 'PMC_Ward14_Property_Tax_Register_2025_26.csv',
      uploadedAt: '2026-09-11 09:15 UTC',
      verifiedWithDroneBoundary: false,
      areaVarianceWithSurveySqm: 68.4,
      notes: 'Discrepancy: unassessed shed extension 68.4 m² detected by YOLOv8 drone inspection'
    },
    lastHarmonizedAt: '2026-09-11 09:15 UTC',
    surveyorNotes: 'YOLOv8 detected unauthorized shed extending into designated road reservation. Revenue Notice required.',
    postgisGeomText: 'POLYGON((73.8562 18.5234, 73.8588 18.5238, 73.8585 18.5219, 73.8560 18.5218, 73.8562 18.5234))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-105-0',
    ulpin: 'MH-27-014-9843-03',
    surveyNo: '105',
    subDivision: 'Main',
    villageName: 'Shivajinagar Urban Zone',
    wardNo: 'Ward 14',
    ownerName: 'Municipal Corporation Water Works Dept',
    fatherHusbandName: 'Commissioner, PMC',
    landUse: 'Public Utility',
    recordedAreaSqm: 1450.0,
    surveyedAreaSqm: 1448.2,
    discrepancySqm: -1.8,
    discrepancyPercent: -0.12,
    aiConfidenceScore: 99.1,
    status: 'harmonized',
    polygon: [
      { lng: 73.8538, lat: 18.5215 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8558, lat: 18.5201 },
      { lng: 73.8536, lat: 18.5198 },
      { lng: 73.8538, lat: 18.5215 }
    ],
    legacyPolygon: [
      { lng: 73.8536, lat: 18.5213 },
      { lng: 73.8561, lat: 18.5217 },
      { lng: 73.8557, lat: 18.5200 },
      { lng: 73.8534, lat: 18.5197 },
      { lng: 73.8536, lat: 18.5213 }
    ],
    samExtractedPolygon: [
      { lng: 73.8538, lat: 18.5215 },
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8558, lat: 18.5201 },
      { lng: 73.8536, lat: 18.5198 },
      { lng: 73.8538, lat: 18.5215 }
    ],
    centroid: { lng: 73.8548, lat: 18.5208 },
    tiePointsCount: 18,
    dsmElevationMeters: 565.1,
    buildings: [
      {
        id: 'BLD-105-PUMP',
        class: 'Industrial',
        confidence: 0.98,
        floors: 2,
        heightMeters: 7.2,
        areaSqm: 380.0,
        isEncroached: false,
        bbox: [73.8542, 18.5204, 73.8552, 18.5212]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-08 17:40 UTC',
    surveyorNotes: 'Public utility boundary confirmed with R-Tree spatial index match in PostGIS.',
    postgisGeomText: 'POLYGON((73.8538 18.5215, 73.8560 18.5218, 73.8558 18.5201, 73.8536 18.5198, 73.8538 18.5215))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-106-A',
    ulpin: 'MH-27-014-9843-04',
    surveyNo: '106/A',
    subDivision: 'A',
    villageName: 'Shivajinagar Urban Zone',
    wardNo: 'Ward 14',
    ownerName: 'Priya & Devendra S. Deshmukh',
    fatherHusbandName: 'Suresh Deshmukh',
    landUse: 'Residential',
    recordedAreaSqm: 720.0,
    surveyedAreaSqm: 765.3,
    discrepancySqm: 45.3,
    discrepancyPercent: 6.29,
    aiConfidenceScore: 78.2,
    status: 'review_required',
    polygon: [
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8585, lat: 18.5219 },
      { lng: 73.8582, lat: 18.5203 },
      { lng: 73.8558, lat: 18.5201 },
      { lng: 73.8560, lat: 18.5218 }
    ],
    legacyPolygon: [
      { lng: 73.8561, lat: 18.5217 },
      { lng: 73.8580, lat: 18.5220 },
      { lng: 73.8578, lat: 18.5202 },
      { lng: 73.8557, lat: 18.5200 },
      { lng: 73.8561, lat: 18.5217 }
    ],
    samExtractedPolygon: [
      { lng: 73.8560, lat: 18.5218 },
      { lng: 73.8584, lat: 18.5219 },
      { lng: 73.8582, lat: 18.5203 },
      { lng: 73.8558, lat: 18.5201 },
      { lng: 73.8560, lat: 18.5218 }
    ],
    centroid: { lng: 73.8571, lat: 18.5210 },
    tiePointsCount: 11,
    dsmElevationMeters: 563.1,
    buildings: [
      {
        id: 'BLD-106-RES',
        class: 'Residential',
        confidence: 0.93,
        floors: 2,
        heightMeters: 6.8,
        areaSqm: 215.0,
        isEncroached: false,
        bbox: [73.8565, 18.5206, 73.8576, 18.5214]
      }
    ],
    topologyIssues: [
      {
        id: 'TOP-02',
        type: 'SLIVER_POLYGON',
        severity: 'medium',
        description: 'Micro-sliver polygon of 3.2 sqm detected at western junction with parcel 105.',
        affectedAreaSqm: 3.2,
        coordinates: [
          { lng: 73.8559, lat: 18.5209 },
          { lng: 73.8560, lat: 18.5211 },
          { lng: 73.8559, lat: 18.5210 }
        ],
        suggestedAction: 'Apply GeoPandas snap_to_vertex rule to merge sliver into larger adjacent parcel.',
        resolved: false
      }
    ],
    lastHarmonizedAt: '2026-09-12 08:20 UTC',
    surveyorNotes: 'Micro-sliver needs automated topological snapping before finalized cadastral registry.',
    postgisGeomText: 'POLYGON((73.8560 18.5218, 73.8585 18.5219, 73.8582 18.5203, 73.8558 18.5201, 73.8560 18.5218))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-107-0',
    ulpin: 'MH-27-014-9843-05',
    surveyNo: '107',
    subDivision: 'Khasra 4',
    villageName: 'Shivajinagar Urban Zone',
    wardNo: 'Ward 14',
    ownerName: 'Green Meadows Heritage Agro-Forestry',
    fatherHusbandName: 'Trustee: Dr. Meera N. Sen',
    landUse: 'Agricultural',
    recordedAreaSqm: 3200.0,
    surveyedAreaSqm: 3192.4,
    discrepancySqm: -7.6,
    discrepancyPercent: -0.24,
    aiConfidenceScore: 97.4,
    status: 'harmonized',
    polygon: [
      { lng: 73.8588, lat: 18.5238 },
      { lng: 73.8615, lat: 18.5242 },
      { lng: 73.8611, lat: 18.5219 },
      { lng: 73.8585, lat: 18.5219 },
      { lng: 73.8588, lat: 18.5238 }
    ],
    legacyPolygon: [
      { lng: 73.8582, lat: 18.5237 },
      { lng: 73.8612, lat: 18.5240 },
      { lng: 73.8609, lat: 18.5218 },
      { lng: 73.8580, lat: 18.5220 },
      { lng: 73.8582, lat: 18.5237 }
    ],
    samExtractedPolygon: [
      { lng: 73.8588, lat: 18.5238 },
      { lng: 73.8615, lat: 18.5242 },
      { lng: 73.8611, lat: 18.5219 },
      { lng: 73.8585, lat: 18.5219 },
      { lng: 73.8588, lat: 18.5238 }
    ],
    centroid: { lng: 73.8599, lat: 18.5229 },
    tiePointsCount: 16,
    dsmElevationMeters: 561.4,
    buildings: [
      {
        id: 'BLD-107-SHED',
        class: 'Industrial',
        confidence: 0.95,
        floors: 1,
        heightMeters: 4.2,
        areaSqm: 140.0,
        isEncroached: false,
        bbox: [73.8592, 18.5224, 73.8602, 18.5232]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-09 11:22 UTC',
    surveyorNotes: 'Zero-shot SAM segmentation neatly traced natural hedge line and irrigation ditch.',
    postgisGeomText: 'POLYGON((73.8588 18.5238, 73.8615 18.5242, 73.8611 18.5219, 73.8585 18.5219, 73.8588 18.5238))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-15-201',
    ulpin: 'MH-27-015-1024-01',
    surveyNo: '201/1',
    subDivision: 'Hissa 1',
    villageName: 'Aundh Extension',
    wardNo: 'Ward 15',
    ownerName: 'Devika Singhania & Partners',
    fatherHusbandName: 'Late Harish Singhania',
    landUse: 'Commercial',
    recordedAreaSqm: 1450.0,
    surveyedAreaSqm: 1458.2,
    discrepancySqm: 8.2,
    discrepancyPercent: 0.57,
    aiConfidenceScore: 96.8,
    status: 'harmonized',
    polygon: [
      { lng: 73.8050, lat: 18.5580 },
      { lng: 73.8080, lat: 18.5585 },
      { lng: 73.8075, lat: 18.5565 },
      { lng: 73.8048, lat: 18.5562 },
      { lng: 73.8050, lat: 18.5580 }
    ],
    legacyPolygon: [
      { lng: 73.8049, lat: 18.5582 },
      { lng: 73.8082, lat: 18.5587 },
      { lng: 73.8076, lat: 18.5564 },
      { lng: 73.8046, lat: 18.5560 },
      { lng: 73.8049, lat: 18.5582 }
    ],
    samExtractedPolygon: [
      { lng: 73.8050, lat: 18.5580 },
      { lng: 73.8080, lat: 18.5585 },
      { lng: 73.8075, lat: 18.5565 },
      { lng: 73.8048, lat: 18.5562 },
      { lng: 73.8050, lat: 18.5580 }
    ],
    centroid: { lng: 73.8063, lat: 18.5573 },
    tiePointsCount: 16,
    dsmElevationMeters: 558.0,
    buildings: [
      {
        id: 'BLD-15-201A',
        class: 'Commercial',
        confidence: 0.97,
        floors: 5,
        heightMeters: 17.5,
        areaSqm: 620.0,
        isEncroached: false,
        bbox: [73.8055, 18.5568, 73.8070, 18.5578]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-11 14:15 UTC',
    surveyorNotes: 'Aundh suburban tech corridor commercial plot. Drone ortho 5cm resolution matched with PMC master road layout.',
    postgisGeomText: 'POLYGON((73.8050 18.5580, 73.8080 18.5585, 73.8075 18.5565, 73.8048 18.5562, 73.8050 18.5580))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-15-202',
    ulpin: 'MH-27-015-1024-02',
    surveyNo: '202/B',
    subDivision: 'Hissa 2',
    villageName: 'Aundh Extension',
    wardNo: 'Ward 15',
    ownerName: 'Dr. Alok Nath Mukherjee',
    fatherHusbandName: 'Subhash Mukherjee',
    landUse: 'Residential',
    recordedAreaSqm: 920.0,
    surveyedAreaSqm: 934.0,
    discrepancySqm: 14.0,
    discrepancyPercent: 1.52,
    aiConfidenceScore: 93.5,
    status: 'harmonized',
    polygon: [
      { lng: 73.8082, lat: 18.5585 },
      { lng: 73.8110, lat: 18.5590 },
      { lng: 73.8105, lat: 18.5570 },
      { lng: 73.8078, lat: 18.5567 },
      { lng: 73.8082, lat: 18.5585 }
    ],
    legacyPolygon: [
      { lng: 73.8080, lat: 18.5586 },
      { lng: 73.8112, lat: 18.5592 },
      { lng: 73.8107, lat: 18.5568 },
      { lng: 73.8076, lat: 18.5565 },
      { lng: 73.8080, lat: 18.5586 }
    ],
    samExtractedPolygon: [
      { lng: 73.8082, lat: 18.5585 },
      { lng: 73.8110, lat: 18.5590 },
      { lng: 73.8105, lat: 18.5570 },
      { lng: 73.8078, lat: 18.5567 },
      { lng: 73.8082, lat: 18.5585 }
    ],
    centroid: { lng: 73.8094, lat: 18.5578 },
    tiePointsCount: 12,
    dsmElevationMeters: 559.2,
    buildings: [
      {
        id: 'BLD-15-202A',
        class: 'Residential',
        confidence: 0.94,
        floors: 3,
        heightMeters: 10.2,
        areaSqm: 310.0,
        isEncroached: false,
        bbox: [73.8085, 18.5572, 73.8098, 18.5582]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-11 15:30 UTC',
    surveyorNotes: 'Residential twin bungalow layout with validated cadastral boundaries.',
    postgisGeomText: 'POLYGON((73.8082 18.5585, 73.8110 18.5590, 73.8105 18.5570, 73.8078 18.5567, 73.8082 18.5585))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-16-301',
    ulpin: 'MH-27-016-4412-01',
    surveyNo: '301/K',
    subDivision: 'Metro Plot 1',
    villageName: 'Kothrud Metro Corridor',
    wardNo: 'Ward 16',
    ownerName: 'MahaMetro Rail Transit Authority',
    fatherHusbandName: 'Govt. of Maharashtra',
    landUse: 'Public Utility',
    recordedAreaSqm: 2400.0,
    surveyedAreaSqm: 2410.5,
    discrepancySqm: 10.5,
    discrepancyPercent: 0.44,
    aiConfidenceScore: 98.2,
    status: 'harmonized',
    polygon: [
      { lng: 73.8100, lat: 18.5080 },
      { lng: 73.8135, lat: 18.5085 },
      { lng: 73.8130, lat: 18.5060 },
      { lng: 73.8095, lat: 18.5056 },
      { lng: 73.8100, lat: 18.5080 }
    ],
    legacyPolygon: [
      { lng: 73.8098, lat: 18.5082 },
      { lng: 73.8138, lat: 18.5087 },
      { lng: 73.8132, lat: 18.5058 },
      { lng: 73.8092, lat: 18.5054 },
      { lng: 73.8098, lat: 18.5082 }
    ],
    samExtractedPolygon: [
      { lng: 73.8100, lat: 18.5080 },
      { lng: 73.8135, lat: 18.5085 },
      { lng: 73.8130, lat: 18.5060 },
      { lng: 73.8095, lat: 18.5056 },
      { lng: 73.8100, lat: 18.5080 }
    ],
    centroid: { lng: 73.8115, lat: 18.5070 },
    tiePointsCount: 22,
    dsmElevationMeters: 572.5,
    buildings: [
      {
        id: 'BLD-16-301-METRO',
        class: 'Commercial',
        confidence: 0.99,
        floors: 2,
        heightMeters: 14.0,
        areaSqm: 880.0,
        isEncroached: false,
        bbox: [73.8105, 18.5065, 73.8125, 18.5078]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-12 07:10 UTC',
    surveyorNotes: 'Metro Line 2 transit station & passenger depot concourse. Right-of-Way clearly delineated.',
    postgisGeomText: 'POLYGON((73.8100 18.5080, 73.8135 18.5085, 73.8130 18.5060, 73.8095 18.5056, 73.8100 18.5080))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  },
  {
    id: 'P-16-302',
    ulpin: 'MH-27-016-4412-02',
    surveyNo: '302/M',
    subDivision: 'Metro Plot 2',
    villageName: 'Kothrud Metro Corridor',
    wardNo: 'Ward 16',
    ownerName: 'Venkatesh Builders & Promoters LLP',
    fatherHusbandName: 'M.D. S. Venkatesh',
    landUse: 'Residential',
    recordedAreaSqm: 1800.0,
    surveyedAreaSqm: 1845.0,
    discrepancySqm: 45.0,
    discrepancyPercent: 2.50,
    aiConfidenceScore: 92.1,
    status: 'review_required',
    polygon: [
      { lng: 73.8138, lat: 18.5086 },
      { lng: 73.8170, lat: 18.5090 },
      { lng: 73.8165, lat: 18.5066 },
      { lng: 73.8132, lat: 18.5062 },
      { lng: 73.8138, lat: 18.5086 }
    ],
    legacyPolygon: [
      { lng: 73.8135, lat: 18.5088 },
      { lng: 73.8172, lat: 18.5092 },
      { lng: 73.8168, lat: 18.5064 },
      { lng: 73.8130, lat: 18.5060 },
      { lng: 73.8135, lat: 18.5088 }
    ],
    samExtractedPolygon: [
      { lng: 73.8138, lat: 18.5086 },
      { lng: 73.8170, lat: 18.5090 },
      { lng: 73.8165, lat: 18.5066 },
      { lng: 73.8132, lat: 18.5062 },
      { lng: 73.8138, lat: 18.5086 }
    ],
    centroid: { lng: 73.8151, lat: 18.5076 },
    tiePointsCount: 18,
    dsmElevationMeters: 574.0,
    buildings: [
      {
        id: 'BLD-16-302A',
        class: 'Residential',
        confidence: 0.95,
        floors: 6,
        heightMeters: 19.5,
        areaSqm: 540.0,
        isEncroached: false,
        bbox: [73.8142, 18.5070, 73.8158, 18.5082]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-12 07:45 UTC',
    surveyorNotes: 'High-rise residential development adjacent to Metro feeder road.',
    postgisGeomText: 'POLYGON((73.8138 18.5086, 73.8170 18.5090, 73.8165 18.5066, 73.8132 18.5062, 73.8138 18.5086))',
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  }
];

export const INITIAL_TIE_POINTS: TiePoint[] = [
  { id: 'TP-01', sourceX: 142, sourceY: 284, targetLng: 73.8540, targetLat: 18.5230, confidence: 0.98, residualErrorMeters: 0.08, type: 'LoFTR' },
  { id: 'TP-02', sourceX: 412, sourceY: 298, targetLng: 73.8562, targetLat: 18.5234, confidence: 0.97, residualErrorMeters: 0.11, type: 'LoFTR' },
  { id: 'TP-03', sourceX: 405, sourceY: 512, targetLng: 73.8560, targetLat: 18.5218, confidence: 0.95, residualErrorMeters: 0.14, type: 'SuperGlue' },
  { id: 'TP-04', sourceX: 138, sourceY: 498, targetLng: 73.8538, targetLat: 18.5215, confidence: 0.99, residualErrorMeters: 0.06, type: 'Manual_GCP' },
  { id: 'TP-05', sourceX: 720, sourceY: 310, targetLng: 73.8588, targetLat: 18.5238, confidence: 0.94, residualErrorMeters: 0.16, type: 'LoFTR' },
  { id: 'TP-06', sourceX: 712, sourceY: 520, targetLng: 73.8585, targetLat: 18.5219, confidence: 0.96, residualErrorMeters: 0.12, type: 'SuperGlue' },
  { id: 'TP-07', sourceX: 402, sourceY: 740, targetLng: 73.8558, targetLat: 18.5201, confidence: 0.98, residualErrorMeters: 0.09, type: 'LoFTR' },
  { id: 'TP-08', sourceX: 135, sourceY: 732, targetLng: 73.8536, targetLat: 18.5198, confidence: 0.97, residualErrorMeters: 0.10, type: 'LoFTR' }
];

export const INITIAL_ETL_JOBS: ETLJob[] = [
  {
    id: 'JOB-202609-081',
    jobName: 'Ward14_LoFTR_RubberSheet_Cadastre.py',
    module: 'LOFTR_RUBBERSHEET',
    status: 'completed',
    progress: 100,
    startedAt: '2026-09-12 09:40:12',
    completedAt: '2026-09-12 09:41:45',
    durationSeconds: 93,
    inputDataset: 'revenue_village_cadastral_sheet_1974_scanned.tif (300 DPI)',
    outputFormat: 'GeoTIFF (EPSG:32643 - UTM Zone 43N)',
    logs: [
      '[OpenCV] Normalized contrast with CLAHE (clipLimit=3.0, tileGrid=8x8)',
      '[PyTorch:LoFTR] Initializing detector-free feature matcher on NVIDIA A10G',
      '[PyTorch:LoFTR] Found 2,418 dense correspondence pairs across tiles',
      '[RANSAC] Computed Thin Plate Spline (TPS) transformation matrix',
      '[GDAL:Warp] Warped legacy raster to 5cm drone orthomosaic coordinate space',
      '[Quality Assurance] Mean Residual RMSE: 0.114 meters (< 0.15m compliance achieved)'
    ],
    metrics: {
      crsSource: 'Local Grid (Arbitrary Scan Coordinates)',
      crsTarget: 'EPSG:32643 (UTM 43N)',
      featuresProcessed: 2418,
      gpuAllocation: 'A10G-0 (4.2 GB VRAM)',
      rmseMeters: 0.114
    }
  },
  {
    id: 'JOB-202609-082',
    jobName: 'Drone_YOLOv8x_Building_Encroachment_Detection.py',
    module: 'YOLOV8_INFERENCE',
    status: 'completed',
    progress: 100,
    startedAt: '2026-09-12 09:45:00',
    completedAt: '2026-09-12 09:47:18',
    durationSeconds: 138,
    inputDataset: 'ward14_drone_orthomosaic_5cm_res.tif (8.4 GB COG)',
    outputFormat: 'PostGIS ST_MultiPolygon (building_footprints)',
    logs: [
      '[Rasterio] Reading Cloud-Optimized GeoTIFF blocks in 1024x1024 windows',
      '[YOLOv8x-Seg] Model loaded with custom urban cadastre weights v4.2',
      '[Inference] Detected 418 structural footprints with avg confidence 0.942',
      '[Shapely] Computed spatial intersection with PostGIS cadastral boundary lines',
      '[Topology] Flagged 3 encroachment anomalies exceeding legal setback lines'
    ],
    metrics: {
      featuresProcessed: 418,
      gpuAllocation: 'A10G-0 (6.8 GB VRAM)',
      meanIoU: 0.894
    }
  },
  {
    id: 'JOB-202609-083',
    jobName: 'ZeroShot_SAM_Parcel_Delineation.py',
    module: 'SAM_SEGMENTATION',
    status: 'completed',
    progress: 100,
    startedAt: '2026-09-12 09:50:10',
    completedAt: '2026-09-12 09:53:02',
    durationSeconds: 172,
    inputDataset: 'ward14_drone_ortho + LiDAR_DSM_Elevation.tif',
    outputFormat: 'GeoPandas GeoDataFrame -> PostGIS parcels table',
    logs: [
      '[SAM-ViT-H] Segment Anything Model running high-res zero-shot prompt grid',
      '[Fiona/Rasterio] Ingested DSM elevation gradient as supplementary boundary cue',
      '[Vectorization] Extracted 52 crisp parcel boundary candidate polygons',
      '[Topology] Filtered small artifacts, smoothed parcel perimeter vertices'
    ],
    metrics: {
      featuresProcessed: 52,
      gpuAllocation: 'A10G-1 (11.2 GB VRAM)',
      meanIoU: 0.948
    }
  },
  {
    id: 'JOB-202609-084',
    jobName: 'PostGIS_Shapely_Automated_Topology_Cleanup.py',
    module: 'TOPOLOGY_AUDIT',
    status: 'running',
    progress: 68,
    startedAt: '2026-09-12 10:18:22',
    inputDataset: 'postgis://gis_admin:***@localhost:5432/urban_cadastre_db/parcels',
    outputFormat: 'PostGIS Master Cadastre (Cleaned Topology)',
    logs: [
      '[PostGIS] Executing ST_Validate and ST_Node to identify multi-polygon slivers',
      '[Shapely] Resolving 12 boundary overlaps using area-proportional division',
      '[GeoPandas] Dissolving 4 micro-slivers (< 3.5 sqm) into parent boundaries',
      '[R-Tree] Rebuilding PostGIS GiST index on column geom...'
    ],
    metrics: {
      featuresProcessed: 38,
      sliversRemoved: 4
    }
  }
];

export const INITIAL_CLUSTER_STATUS: ClusterStatus = {
  k8sStatus: 'Operational',
  activePods: 14,
  gpuNodes: [
    {
      name: 'gpu-worker-node-01',
      model: 'NVIDIA A10G (24GB)',
      vramUsedGb: 14.8,
      vramTotalGb: 24.0,
      gpuUtilPercent: 78,
      temperatureC: 64,
      assignedTask: 'LoFTR Rubber-Sheeting & SAM Delineation'
    },
    {
      name: 'gpu-worker-node-02',
      model: 'NVIDIA T4 (16GB)',
      vramUsedGb: 8.4,
      vramTotalGb: 16.0,
      gpuUtilPercent: 52,
      temperatureC: 58,
      assignedTask: 'YOLOv8 Structural Encroachment Inference'
    }
  ],
  postgisStats: {
    version: 'PostgreSQL 16.3 + PostGIS 3.4.2 Spatial DB',
    activeConnections: 18,
    totalParcelsIndexed: 14850,
    rTreeIndexHitRatio: 99.4,
    dbSizeMb: 4820
  },
  celeryWorkers: [
    { workerId: 'celery@worker-geodl-01', status: 'BUSY', concurrency: 8, activeJob: 'JOB-202609-084' },
    { workerId: 'celery@worker-geodl-02', status: 'IDLE', concurrency: 8 },
    { workerId: 'celery@worker-etl-tile-01', status: 'IDLE', concurrency: 16 }
  ],
  redisQueueDepth: 1
};

export const mockCadastralParcels = INITIAL_PARCELS;
export const mockEtlJobs = INITIAL_ETL_JOBS;
export const mockClusterStatus = INITIAL_CLUSTER_STATUS;
export const mockTiePoints = INITIAL_TIE_POINTS;
