import { X, Info, Zap, Lightbulb, Scale, Ruler } from 'lucide-react';
import { useAnatomy } from '../../context/AnatomyContext';
import { organData, systemNames, systemColors } from '../../data/organData';

export default function OrganDetail() {
  const { selectedOrgan, setSelectedOrgan } = useAnatomy();

  if (!selectedOrgan) return null;

  const organ = organData[selectedOrgan];
  if (!organ) return null;

  const systemColor = systemColors[organ.system];

  return (
    <div className="absolute right-0 top-0 bottom-0 z-20 w-80 lg:w-96 pointer-events-auto">
      <div className="flex flex-col m-3 mt-20 mb-3 h-[calc(100%-5.75rem)] rounded-2xl bg-slate-900/80 border border-white/[0.06] backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider mb-2"
                style={{
                  backgroundColor: systemColor + '20',
                  color: systemColor,
                }}
              >
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: systemColor }} />
                {systemNames[organ.system]} System
              </div>
              <h2 className="text-xl font-semibold text-white/90 leading-tight">{organ.name}</h2>
            </div>
            <button
              onClick={() => setSelectedOrgan(null)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
          <Section icon={<Info className="w-4 h-4" />} title="Overview" color={systemColor}>
            <p className="text-sm text-white/50 leading-relaxed">{organ.description}</p>
          </Section>

          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Scale className="w-3.5 h-3.5" />} label="Weight" value={organ.weight} />
            <StatCard icon={<Ruler className="w-3.5 h-3.5" />} label="Size" value={organ.size} />
          </div>

          <Section icon={<Zap className="w-4 h-4" />} title="Functions" color={systemColor}>
            <ul className="space-y-2">
              {organ.functions.map((fn, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/50">
                  <div
                    className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: systemColor }}
                  />
                  {fn}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<Lightbulb className="w-4 h-4" />} title="Did You Know?" color={systemColor}>
            <ul className="space-y-2">
              {organ.facts.map((fact, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/45">
                  <span className="text-white/20 flex-shrink-0 font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ color }}>{icon}</span>
        <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-white/30">{icon}</span>
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm text-white/70 font-medium">{value}</p>
    </div>
  );
}
