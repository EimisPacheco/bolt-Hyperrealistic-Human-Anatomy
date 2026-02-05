import {
  Heart,
  Wind,
  Utensils,
  Brain,
  Droplets,
  Shield,
  Bone,
  Eye,
  EyeOff,
  RotateCcw,
  Scan,
  User,
  Search,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAnatomy } from '../../context/AnatomyContext';
import { organData, systemColors, systemNames } from '../../data/organData';
import type { OrganSystem } from '../../types';

const systemIcons: Record<string, React.ReactNode> = {
  cardiovascular: <Heart className="w-3.5 h-3.5" />,
  respiratory: <Wind className="w-3.5 h-3.5" />,
  digestive: <Utensils className="w-3.5 h-3.5" />,
  nervous: <Brain className="w-3.5 h-3.5" />,
  urinary: <Droplets className="w-3.5 h-3.5" />,
  lymphatic: <Shield className="w-3.5 h-3.5" />,
  skeletal: <Bone className="w-3.5 h-3.5" />,
};

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const {
    selectedOrgan,
    setSelectedOrgan,
    visibleSystems,
    toggleSystem,
    showBody,
    toggleBody,
    showSkeleton,
    toggleSkeleton,
    xrayMode,
    toggleXray,
    autoRotate,
    toggleAutoRotate,
    resetView,
  } = useAnatomy();

  const organsBySystem = useMemo(() => {
    const grouped: Record<string, typeof organData[string][]> = {};
    Object.values(organData).forEach((organ) => {
      if (!grouped[organ.system]) grouped[organ.system] = [];
      grouped[organ.system].push(organ);
    });
    return grouped;
  }, []);

  const filteredOrgans = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return Object.values(organData).filter(
      (o) => o.name.toLowerCase().includes(q) || o.system.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (collapsed) {
    return (
      <div className="absolute left-0 top-0 bottom-0 z-20 flex flex-col items-center py-20 px-2 gap-2">
        <button
          onClick={() => setCollapsed(false)}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-0 bottom-0 z-20 w-72 lg:w-80 flex flex-col pointer-events-auto">
      <div className="flex-1 overflow-hidden flex flex-col m-3 mt-20 mb-3 rounded-2xl bg-slate-900/80 border border-white/[0.06] backdrop-blur-xl shadow-2xl">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Controls</span>
            <button
              onClick={() => setCollapsed(true)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <ControlButton active={showBody} onClick={toggleBody} icon={<User className="w-3.5 h-3.5" />} label="Body" />
            <ControlButton active={showSkeleton} onClick={toggleSkeleton} icon={<Bone className="w-3.5 h-3.5" />} label="Skeleton" />
            <ControlButton active={xrayMode} onClick={toggleXray} icon={<Scan className="w-3.5 h-3.5" />} label="X-Ray" />
            <ControlButton active={autoRotate} onClick={toggleAutoRotate} icon={<RotateCcw className="w-3.5 h-3.5" />} label="Rotate" />
            <button
              onClick={resetView}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search organs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-4 scrollbar-thin">
          {filteredOrgans ? (
            <div className="space-y-1">
              <p className="text-xs text-white/30 mb-2">{filteredOrgans.length} results</p>
              {filteredOrgans.map((organ) => (
                <OrganButton
                  key={organ.id}
                  name={organ.name}
                  color={systemColors[organ.system]}
                  active={selectedOrgan === organ.id}
                  onClick={() => setSelectedOrgan(organ.id)}
                />
              ))}
            </div>
          ) : (
            Object.entries(organsBySystem).map(([system, organs]) => (
              <div key={system}>
                <button
                  onClick={() => toggleSystem(system as OrganSystem)}
                  className="flex items-center gap-2 mb-2 group w-full"
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: visibleSystems.includes(system as OrganSystem)
                        ? systemColors[system] + '30'
                        : 'rgba(255,255,255,0.05)',
                      color: visibleSystems.includes(system as OrganSystem)
                        ? systemColors[system]
                        : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {systemIcons[system]}
                  </div>
                  <span
                    className="text-xs font-medium uppercase tracking-wider transition-colors"
                    style={{
                      color: visibleSystems.includes(system as OrganSystem)
                        ? 'rgba(255,255,255,0.6)'
                        : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {systemNames[system]}
                  </span>
                </button>

                {visibleSystems.includes(system as OrganSystem) && (
                  <div className="space-y-0.5 ml-7">
                    {organs.map((organ) => (
                      <OrganButton
                        key={organ.id}
                        name={organ.name}
                        color={systemColors[system]}
                        active={selectedOrgan === organ.id}
                        onClick={() => setSelectedOrgan(organ.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        active
          ? 'bg-white/10 border-white/20 text-white/80'
          : 'bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.06]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function OrganButton({
  name,
  color,
  active,
  onClick,
}: {
  name: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
        active
          ? 'bg-white/10 text-white/90'
          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
      }`}
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: active ? color : color + '60' }}
      />
      {name}
    </button>
  );
}
