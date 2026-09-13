import { Parcel } from '../types';

export interface UrbanWardItem {
  id: string;
  wardNo: string;
  name: string;
  zone: 'Central' | 'West' | 'South' | 'East' | 'North';
  zoneLabel: string;
  parcelCount: number;
  totalAreaHectares: number;
  surveyStatus: 'Completed' | 'In Progress' | 'Harmonized';
  coordinates: { lng: number; lat: number };
  description: string;
}

export const URBAN_WARDS_LIST: UrbanWardItem[] = [
  {
    id: 'ward-14',
    wardNo: 'Ward 14',
    name: 'Shivajinagar Urban Central',
    zone: 'Central',
    zoneLabel: 'Central Revenue Circle',
    parcelCount: 1480,
    totalAreaHectares: 245.8,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.8567, lat: 18.5228 },
    description: 'Core administrative & commercial hub with high-density cadastral coverage and 3D vertical units.'
  },
  {
    id: 'ward-15',
    wardNo: 'Ward 15',
    name: 'Aundh Extension',
    zone: 'West',
    zoneLabel: 'West Tech Corridor',
    parcelCount: 1820,
    totalAreaHectares: 312.4,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.8062, lat: 18.5584 },
    description: 'Modern planned residential layout with suburban arterial connectivity and riverfront setbacks.'
  },
  {
    id: 'ward-16',
    wardNo: 'Ward 16',
    name: 'Kothrud Metro Line 2 Corridor',
    zone: 'South',
    zoneLabel: 'South Metro Zone',
    parcelCount: 2150,
    totalAreaHectares: 380.2,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.8118, lat: 18.5074 },
    description: 'High-density transit-oriented development zone along Metro corridor with active RoW boundary audits.'
  },
  {
    id: 'ward-01',
    wardNo: 'Ward 01',
    name: 'Kasba Peth Heritage Core',
    zone: 'Central',
    zoneLabel: 'Central Revenue Circle',
    parcelCount: 940,
    totalAreaHectares: 110.5,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8563, lat: 18.5195 },
    description: 'Historic core with complex Gaothan gaothan legacy parcels and narrow shared party walls.'
  },
  {
    id: 'ward-02',
    wardNo: 'Ward 02',
    name: 'Bhavani Peth Wholesale Market',
    zone: 'Central',
    zoneLabel: 'Central Revenue Circle',
    parcelCount: 1120,
    totalAreaHectares: 142.0,
    surveyStatus: 'In Progress',
    coordinates: { lng: 73.8680, lat: 18.5080 },
    description: 'Dense commercial trading hub undergoing high-resolution drone orthomosaic rectification.'
  },
  {
    id: 'ward-03',
    wardNo: 'Ward 03',
    name: 'Somwar Peth Railway Terminal',
    zone: 'Central',
    zoneLabel: 'Central Revenue Circle',
    parcelCount: 880,
    totalAreaHectares: 128.6,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8640, lat: 18.5240 },
    description: 'Mixed railway institutional land and dense residential tenement clusters.'
  },
  {
    id: 'ward-04',
    wardNo: 'Ward 04',
    name: 'Budhwar Peth Commercial Circle',
    zone: 'Central',
    zoneLabel: 'Central Revenue Circle',
    parcelCount: 760,
    totalAreaHectares: 96.4,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8540, lat: 18.5160 },
    description: 'High ratable value commercial district with multi-floor shop & vertical ownership deeds.'
  },
  {
    id: 'ward-05',
    wardNo: 'Ward 05',
    name: 'Baner-Balewadi Smart City Hub',
    zone: 'West',
    zoneLabel: 'West Tech Corridor',
    parcelCount: 2340,
    totalAreaHectares: 490.0,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.7840, lat: 18.5590 },
    description: 'Smart City pilot corridor with underground utility easements and 3D GIS twin integration.'
  },
  {
    id: 'ward-06',
    wardNo: 'Ward 06',
    name: 'Hinjawadi Phase 1 Tech Park',
    zone: 'West',
    zoneLabel: 'West Tech Corridor',
    parcelCount: 1560,
    totalAreaHectares: 620.0,
    surveyStatus: 'In Progress',
    coordinates: { lng: 73.7280, lat: 18.5910 },
    description: 'Major IT SEZ with large institutional footprints and multi-hectare industrial plots.'
  },
  {
    id: 'ward-07',
    wardNo: 'Ward 07',
    name: 'Pashan Lake Ecological Buffer',
    zone: 'West',
    zoneLabel: 'West Tech Corridor',
    parcelCount: 680,
    totalAreaHectares: 340.5,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.7880, lat: 18.5370 },
    description: 'Water body conservation zone requiring strict wetland buffer setback enforcement.'
  },
  {
    id: 'ward-08',
    wardNo: 'Ward 08',
    name: 'Karve Nagar Residential Enclave',
    zone: 'South',
    zoneLabel: 'South Metro Zone',
    parcelCount: 1650,
    totalAreaHectares: 260.0,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.8180, lat: 18.4900 },
    description: 'Cooperative housing society sector with established sub-division layouts.'
  },
  {
    id: 'ward-09',
    wardNo: 'Ward 09',
    name: 'Sinhagad Road Riverside Enclave',
    zone: 'South',
    zoneLabel: 'South Metro Zone',
    parcelCount: 1890,
    totalAreaHectares: 410.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8340, lat: 18.4810 },
    description: 'Mutha river riparian corridor with automated blue-line flood zone setback clipping.'
  },
  {
    id: 'ward-10',
    wardNo: 'Ward 10',
    name: 'Dhankawadi-Katraj Lake Enclave',
    zone: 'South',
    zoneLabel: 'South Metro Zone',
    parcelCount: 2020,
    totalAreaHectares: 395.0,
    surveyStatus: 'In Progress',
    coordinates: { lng: 73.8560, lat: 18.4550 },
    description: 'Hilly terrain boundary zone with 3D LiDAR DSM/DTM elevation processing.'
  },
  {
    id: 'ward-11',
    wardNo: 'Ward 11',
    name: 'Sahakar Nagar Hills',
    zone: 'South',
    zoneLabel: 'South Metro Zone',
    parcelCount: 1320,
    totalAreaHectares: 215.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8490, lat: 18.4910 },
    description: 'Low-slope hill slopes with bio-diversity park buffer boundary verification.'
  },
  {
    id: 'ward-12',
    wardNo: 'Ward 12',
    name: 'Viman Nagar Airport Enclave',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 1980,
    totalAreaHectares: 430.0,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.9140, lat: 18.5670 },
    description: 'Airport funnels and high-value tech centers with strict building height restriction layers.'
  },
  {
    id: 'ward-13',
    wardNo: 'Ward 13',
    name: 'Kalyani Nagar Tech Park',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 1420,
    totalAreaHectares: 285.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.9020, lat: 18.5470 },
    description: 'Riverside IT parks and luxury residential complexes with complete property tax linking.'
  },
  {
    id: 'ward-17',
    wardNo: 'Ward 17',
    name: 'Koregaon Park Heritage Woods',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 890,
    totalAreaHectares: 210.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8920, lat: 18.5360 },
    description: 'Plotted bungalows with mature tree canopy requiring multi-spectral LiDAR ground penetration.'
  },
  {
    id: 'ward-18',
    wardNo: 'Ward 18',
    name: 'Wadgaon Sheri IT Expansion',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 2240,
    totalAreaHectares: 450.0,
    surveyStatus: 'In Progress',
    coordinates: { lng: 73.9290, lat: 18.5520 },
    description: 'Rapidly urbanizing peri-urban boundary with ongoing revenue survey reconciliation.'
  },
  {
    id: 'ward-19',
    wardNo: 'Ward 19',
    name: 'Hadapsar Industrial Estate',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 1750,
    totalAreaHectares: 510.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.9310, lat: 18.5020 },
    description: 'Manufacturing zone with large structural polygons and heavy vehicle access corridors.'
  },
  {
    id: 'ward-20',
    wardNo: 'Ward 20',
    name: 'Magarpatta Cyber City',
    zone: 'East',
    zoneLabel: 'East Airport & IT',
    parcelCount: 1610,
    totalAreaHectares: 430.0,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.9260, lat: 18.5140 },
    description: 'Privately developed integrated township with digital spatial records and walk-to-work design.'
  },
  {
    id: 'ward-21',
    wardNo: 'Ward 21',
    name: 'Pune Cantonment Board Enclave',
    zone: 'North',
    zoneLabel: 'North & Cantonment',
    parcelCount: 1200,
    totalAreaHectares: 380.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8780, lat: 18.5120 },
    description: 'Special military & defense land registry with statutory civil-military joint surveys.'
  },
  {
    id: 'ward-22',
    wardNo: 'Ward 22',
    name: 'Yerawada Central',
    zone: 'North',
    zoneLabel: 'North & Cantonment',
    parcelCount: 1540,
    totalAreaHectares: 320.0,
    surveyStatus: 'In Progress',
    coordinates: { lng: 73.8820, lat: 18.5530 },
    description: 'Riverfront transit intersection with redevelopment slum rehabilitation projects.'
  },
  {
    id: 'ward-23',
    wardNo: 'Ward 23',
    name: 'Vishrantwadi Defense Zone',
    zone: 'North',
    zoneLabel: 'North & Cantonment',
    parcelCount: 1180,
    totalAreaHectares: 290.0,
    surveyStatus: 'Completed',
    coordinates: { lng: 73.8760, lat: 18.5710 },
    description: 'Defense corridors and arterial ring road intersections.'
  },
  {
    id: 'ward-24',
    wardNo: 'Ward 24',
    name: 'Dhanori Urban Extension',
    zone: 'North',
    zoneLabel: 'North & Cantonment',
    parcelCount: 2450,
    totalAreaHectares: 540.0,
    surveyStatus: 'Harmonized',
    coordinates: { lng: 73.8910, lat: 18.5870 },
    description: 'Rapidly growing northern residential expansion with automated drone cadastral flights.'
  }
];

export const WARD_ZONES = [
  { id: 'ALL', label: 'All Zones', count: 24 },
  { id: 'Central', label: 'Central Zone', count: 5 },
  { id: 'West', label: 'West Tech Hub', count: 4 },
  { id: 'South', label: 'South Metro', count: 5 },
  { id: 'East', label: 'East Airport & IT', count: 6 },
  { id: 'North', label: 'North & Cantonment', count: 4 }
];

export function generateParcelsForWard(wardNo: string): Parcel[] {
  const ward = URBAN_WARDS_LIST.find(w => w.wardNo.toLowerCase() === wardNo.toLowerCase());
  if (!ward) return [];

  const { lng, lat } = ward.coordinates;
  const wardNum = ward.wardNo.replace(/\D/g, '').padStart(2, '0');

  const p1: Parcel = {
    id: `P-${wardNum}-01`,
    ulpin: `MH-27-${wardNum}-5101-01`,
    surveyNo: `${wardNum}/1`,
    subDivision: 'Hissa 1',
    villageName: ward.name,
    wardNo: ward.wardNo,
    ownerName: 'Apex Urban Assets & Infrastructure',
    fatherHusbandName: 'Director: Rajesh V. Kulkarni',
    landUse: 'Commercial',
    recordedAreaSqm: 1250.0,
    surveyedAreaSqm: 1262.4,
    discrepancySqm: 12.4,
    discrepancyPercent: 0.99,
    aiConfidenceScore: 96.2,
    status: 'harmonized',
    polygon: [
      { lng: lng - 0.0015, lat: lat + 0.0010 },
      { lng: lng + 0.0012, lat: lat + 0.0014 },
      { lng: lng + 0.0009, lat: lat - 0.0008 },
      { lng: lng - 0.0017, lat: lat - 0.0006 },
      { lng: lng - 0.0015, lat: lat + 0.0010 }
    ],
    legacyPolygon: [
      { lng: lng - 0.0016, lat: lat + 0.0011 },
      { lng: lng + 0.0014, lat: lat + 0.0015 },
      { lng: lng + 0.0010, lat: lat - 0.0009 },
      { lng: lng - 0.0018, lat: lat - 0.0007 },
      { lng: lng - 0.0016, lat: lat + 0.0011 }
    ],
    samExtractedPolygon: [
      { lng: lng - 0.0015, lat: lat + 0.0010 },
      { lng: lng + 0.0012, lat: lat + 0.0014 },
      { lng: lng + 0.0009, lat: lat - 0.0008 },
      { lng: lng - 0.0017, lat: lat - 0.0006 },
      { lng: lng - 0.0015, lat: lat + 0.0010 }
    ],
    centroid: { lng, lat },
    tiePointsCount: 15,
    dsmElevationMeters: 560.0,
    buildings: [
      {
        id: `BLD-${wardNum}-01A`,
        class: 'Commercial',
        confidence: 0.98,
        floors: 4,
        heightMeters: 14.5,
        areaSqm: 480.0,
        isEncroached: false,
        bbox: [lng - 0.0008, lat - 0.0004, lng + 0.0006, lat + 0.0006]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-12 10:00 UTC',
    surveyorNotes: `${ward.name} core commercial parcel. Boundary harmonized with PostGIS master grid.`,
    postgisGeomText: `POLYGON((${lng - 0.0015} ${lat + 0.0010}, ${lng + 0.0012} ${lat + 0.0014}, ${lng + 0.0009} ${lat - 0.0008}, ${lng - 0.0017} ${lat - 0.0006}, ${lng - 0.0015} ${lat + 0.0010}))`,
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  };

  const p2: Parcel = {
    id: `P-${wardNum}-02`,
    ulpin: `MH-27-${wardNum}-5101-02`,
    surveyNo: `${wardNum}/2`,
    subDivision: 'Hissa 2',
    villageName: ward.name,
    wardNo: ward.wardNo,
    ownerName: 'Shalini Pradeep Joshi',
    fatherHusbandName: 'Pradeep Joshi',
    landUse: 'Residential',
    recordedAreaSqm: 780.0,
    surveyedAreaSqm: 791.5,
    discrepancySqm: 11.5,
    discrepancyPercent: 1.47,
    aiConfidenceScore: 94.5,
    status: 'harmonized',
    polygon: [
      { lng: lng + 0.0014, lat: lat + 0.0014 },
      { lng: lng + 0.0035, lat: lat + 0.0018 },
      { lng: lng + 0.0032, lat: lat - 0.0005 },
      { lng: lng + 0.0011, lat: lat - 0.0007 },
      { lng: lng + 0.0014, lat: lat + 0.0014 }
    ],
    legacyPolygon: [
      { lng: lng + 0.0013, lat: lat + 0.0015 },
      { lng: lng + 0.0036, lat: lat + 0.0019 },
      { lng: lng + 0.0033, lat: lat - 0.0006 },
      { lng: lng + 0.0010, lat: lat - 0.0008 },
      { lng: lng + 0.0013, lat: lat + 0.0015 }
    ],
    samExtractedPolygon: [
      { lng: lng + 0.0014, lat: lat + 0.0014 },
      { lng: lng + 0.0035, lat: lat + 0.0018 },
      { lng: lng + 0.0032, lat: lat - 0.0005 },
      { lng: lng + 0.0011, lat: lat - 0.0007 },
      { lng: lng + 0.0014, lat: lat + 0.0014 }
    ],
    centroid: { lng: lng + 0.0022, lat: lat + 0.0005 },
    tiePointsCount: 11,
    dsmElevationMeters: 561.0,
    buildings: [
      {
        id: `BLD-${wardNum}-02A`,
        class: 'Residential',
        confidence: 0.95,
        floors: 2,
        heightMeters: 7.2,
        areaSqm: 240.0,
        isEncroached: false,
        bbox: [lng + 0.0016, lat - 0.0002, lng + 0.0028, lat + 0.0010]
      }
    ],
    topologyIssues: [],
    lastHarmonizedAt: '2026-09-12 10:15 UTC',
    surveyorNotes: `${ward.name} residential plot. Compliant with town planning setbacks.`,
    postgisGeomText: `POLYGON((${lng + 0.0014} ${lat + 0.0014}, ${lng + 0.0035} ${lat + 0.0018}, ${lng + 0.0032} ${lat - 0.0005}, ${lng + 0.0011} ${lat - 0.0007}, ${lng + 0.0014} ${lat + 0.0014}))`,
    crs: 'EPSG:32643 (UTM 43N) / EPSG:4326'
  };

  return [p1, p2];
}
