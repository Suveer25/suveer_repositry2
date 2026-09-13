import React, { useState } from 'react';
import { 
  Sparkles, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  Code, 
  Terminal, 
  Scissors, 
  Combine, 
  RefreshCw
} from 'lucide-react';
import { Parcel, TopologyIssue } from '../types';

interface TopologyCleanerProps {
  parcels: Parcel[];
  onResolveTopology: (parcelId: string, issueId: string) => void;
  onRunPostgisQuery: (sql: string) => Promise<any>;
}

export const TopologyCleaner: React.FC<TopologyCleanerProps> = ({
  parcels,
  onResolveTopology,
  onRunPostgisQuery
}) => {
  const [sqlQuery, setSqlQuery] = useState<string>(
    `-- Automated PostGIS Area Variance Audit & R-Tree Spatial Scan\nSELECT \n  ulpin, \n  survey_no, \n  owner, \n  ST_Area(geom::geography) AS st_area_sqm, \n  recorded_area_sqm, \n  (ST_Area(geom::geography) - recorded_area_sqm) AS delta_sqm\nFROM parcels\nWHERE ST_Area(geom::geography) > 500\nORDER BY delta_sqm DESC;`
  );

  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // All topology issues aggregated across parcels
  const allIssues = parcels.flatMap(p => 
    p.topologyIssues.map(issue => ({
      ...issue,
      parcelId: p.id,
      surveyNo: p.surveyNo,
      ulpin: p.ulpin
    }))
  );

  const handleExecuteSql = async () => {
    setIsExecuting(true);
    try {
      const res = await onRunPostgisQuery(sqlQuery);
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const presetQueries = [
    {
      title: 'Audit Area (ST_Area)',
      sql: `-- Area reconciliation with PostGIS\nSELECT ulpin, survey_no, owner, ST_Area(geom::geography) AS st_area_sqm, recorded_area_sqm FROM parcels;`
    },
    {
      title: 'Find Overlaps (ST_Overlaps)',
      sql: `-- Identify contested boundary intersections\nSELECT a.ulpin, b.ulpin, ST_Area(ST_Intersection(a.geom, b.geom)::geography) AS overlap_sqm \nFROM parcels a, parcels b \nWHERE a.id != b.id AND ST_Overlaps(a.geom, b.geom);`
    },
    {
      title: 'Encroachments (ST_Intersects)',
      sql: `-- Check building footprint breach of municipal road buffer\nSELECT p.ulpin, p.survey_no, b.class, ST_Area(ST_Intersection(b.geom, road.geom)::geography) as encroachment_sqm\nFROM parcels p \nJOIN buildings b ON p.id = b.parcel_id\nJOIN municipal_roads road ON ST_Intersects(b.geom, road.geom);`
    },
    {
      title: 'Auto-Fix (ST_Snap)',
      sql: `-- Dissolve micro-slivers (< 3.5m²) into adjacent parent polygon\nUPDATE parcels p \nSET geom = ST_MakeValid(ST_Snap(p.geom, adj.geom, 0.15))\nFROM parcels adj \nWHERE adj.id != p.id AND ST_DWithin(p.geom, adj.geom, 0.15);`
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[620px] bg-slate-950 flex flex-col lg:flex-row overflow-hidden text-xs">
      
      {/* Left Column: Automated Topology Checks (Shapely & GeoPandas) */}
      <div className="w-full lg:w-1/2 bg-slate-900/90 border-r border-slate-800 p-4 overflow-y-auto space-y-4">
        
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Topology Engine</span>
          </div>
          <p className="text-slate-400 mt-0.5">
            Topology QA/QC & Sliver Elimination
          </p>
        </div>

        {/* Rule Status Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Total Parcels</div>
            <div className="text-lg font-bold text-white font-mono">{parcels.length}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Harmonized</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {parcels.filter(p => p.status === 'harmonized').length}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Slivers</div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {allIssues.filter(i => i.type === 'SLIVER_POLYGON' && !i.resolved).length}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Encroachments</div>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {allIssues.filter(i => i.type === 'BOUNDARY_OVERLAP' && !i.resolved).length}
            </div>
          </div>
        </div>

        {/* Active Topology Anomaly Queue */}
        <div className="space-y-2">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Topology Defects</span>
            <span className="text-[10px] text-slate-500 font-mono">GeoPandas</span>
          </div>

          {allIssues.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">Zero Topological Violations</p>
              <p className="text-[11px] text-slate-500 mt-1">All parcel boundaries conform strictly to Planar Partition Topology.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allIssues.map(issue => (
                <div 
                  key={issue.id} 
                  className={`p-3 rounded-xl border transition-all ${
                    issue.resolved 
                      ? 'bg-slate-950/60 border-slate-800 opacity-60'
                      : issue.severity === 'high' 
                        ? 'bg-rose-950/20 border-rose-800/40' 
                        : 'bg-amber-950/20 border-amber-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        issue.resolved
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : issue.severity === 'high' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {issue.type}
                      </span>
                      <span className="text-slate-300 font-semibold">
                        Survey No. {issue.surveyNo}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-slate-400">
                      Area: {issue.affectedAreaSqm} m²
                    </span>
                  </div>

                  <p className="text-slate-300 mt-1.5">{issue.description}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Shapely Rule: {issue.suggestedAction}
                    </span>

                    {!issue.resolved ? (
                      <button
                        onClick={() => onResolveTopology(issue.parcelId, issue.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Scissors className="h-3 w-3" />
                        <span>Auto-Resolve</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> Resolved in PostGIS
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Interactive PostGIS Spatial SQL Console */}
      <div className="w-full lg:w-1/2 bg-slate-950 p-4 flex flex-col space-y-3 overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-white font-bold text-sm">PostGIS SQL Console</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            GiST Indexed
          </span>
        </div>

        {/* Preset Query Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {presetQueries.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSqlQuery(preset.sql)}
              className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap text-[10px] transition-colors cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* SQL Input Area */}
        <div className="relative rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-400 font-mono text-[10px]">
            <span>query.sql</span>
            <span>urban_cadastre_db</span>
          </div>
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={7}
            className="w-full p-3 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none selection:bg-emerald-500/30"
            spellCheck={false}
          />
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 text-[10px] font-mono">
              PostGIS 3.4
            </span>
            <button
              onClick={handleExecuteSql}
              disabled={isExecuting}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Run SQL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Execution Plan & Output Table */}
        <div className="flex-1 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-300">Execution Plan & Output Rows</span>
            </div>
            {queryResult && (
              <span className="text-emerald-400 font-bold">
                {queryResult.rowCount} rows in {queryResult.executionTimeMs} ms
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto p-3 font-mono text-[11px]">
            {queryResult ? (
              <div className="space-y-3">
                {queryResult.plan && (
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-purple-300 text-[10px]">
                    <div className="text-slate-500 mb-0.5">EXPLAIN (ANALYZE):</div>
                    {queryResult.plan}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        {Object.keys(queryResult.rows[0] || {}).map((col) => (
                          <th key={col} className="p-2 whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="border-b border-slate-800/50 hover:bg-slate-800/30 text-slate-200">
                          {Object.values(row).map((val: any, cIdx: number) => (
                            <td key={cIdx} className="p-2 whitespace-nowrap">
                              {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-center">
                Click "Execute Spatial SQL" above to query PostGIS R-Tree geometries in real-time.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
