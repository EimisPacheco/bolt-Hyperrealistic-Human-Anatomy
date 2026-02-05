import { Html } from '@react-three/drei';
import { useAnatomy } from '../../context/AnatomyContext';
import { organData, systemColors } from '../../data/organData';

export default function OrganLabel() {
  const { hoveredOrgan, selectedOrgan } = useAnatomy();

  const organId = hoveredOrgan || selectedOrgan;
  if (!organId) return null;

  const organ = organData[organId];
  if (!organ) return null;

  const color = systemColors[organ.system];

  return (
    <group position={[organ.position[0], organ.position[1] + 0.25, organ.position[2]]}>
      <Html center distanceFactor={4} style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-md whitespace-nowrap shadow-xl">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-medium text-white/80">{organ.name}</span>
        </div>
      </Html>
    </group>
  );
}
