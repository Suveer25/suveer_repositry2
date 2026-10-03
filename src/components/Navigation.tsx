import React from 'react';
import { 
  Map, 
  Box, 
  GitCompare, 
  Scan, 
  Sparkles, 
  Activity, 
  Layers, 
  Server
} from 'lucide-react';

export type ActiveTab = 
  | 'map-2d' 
  | 'digital-twin-3d' 
  | 'rubbersheeting' 
  | 'geoai-sam-yolo' 
  | 'topology-postgis' 
  | 'etl-celery' 
  | 'ogc-registry' 
  | 'cloud-gpu';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unresolvedTopologyCount: number;
  runningJobsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  unresolvedTopologyCount,
  runningJobsCount
}) => {
  const navItems = [
    {
      id: 'map-2d' as ActiveTab,
      label: '2D Map',
      icon: Map,
      badge: null
    },
    {
      id: 'digital-twin-3d' as ActiveTab,
      label: '3D Twin',
      icon: Box,
      badge: null
    },
    {
      id: 'rubbersheeting' as ActiveTab,
      label: 'Rubber-Sheeting',
      icon: GitCompare,
      badge: null
    },
    {
      id: 'geoai-sam-yolo' as ActiveTab,
      label: 'GeoAI Models',
      icon: Scan,
      badge: null
    },
    {
      id: 'topology-postgis' as ActiveTab,
      label: 'Topology',
      icon: Sparkles,
      badge: unresolvedTopologyCount > 0 ? `${unresolvedTopologyCount}` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    },
    {
      id: 'etl-celery' as ActiveTab,
      label: 'ETL Jobs',
      icon: Activity,
      badge: runningJobsCount > 0 ? `${runningJobsCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'ogc-registry' as ActiveTab,
      label: 'OGC Registry',
      icon: Layers,
      badge: null
    },
    {
      id: 'cloud-gpu' as ActiveTab,
      label: 'Cluster',
      icon: Server,
      badge: null
    }
  ];

  return (
    <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

