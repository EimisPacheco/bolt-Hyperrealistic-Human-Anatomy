import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnatomy } from '../../context/AnatomyContext';
import { createRibGeometry, createSpineGeometry } from '../../lib/geometries';

export default function Skeleton() {
  const { showSkeleton, xrayMode, selectedOrgan } = useAnatomy();

  const { ribs, spine } = useMemo(() => {
    const ribGeometries: { geo: THREE.BufferGeometry; key: string }[] = [];

    for (let i = 0; i < 12; i++) {
      ribGeometries.push({ geo: createRibGeometry(i, 1), key: `rib-r-${i}` });
      ribGeometries.push({ geo: createRibGeometry(i, -1), key: `rib-l-${i}` });
    }

    return {
      ribs: ribGeometries,
      spine: createSpineGeometry(),
    };
  }, []);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#E8DCC8',
      emissive: '#2A2418',
      emissiveIntensity: 0.08,
      roughness: 0.35,
      metalness: 0,
      transparent: true,
      opacity: 0.25,
    }),
    []
  );

  useFrame(() => {
    const target = xrayMode ? 0.5 : selectedOrgan ? 0.1 : 0.25;
    material.opacity = THREE.MathUtils.lerp(material.opacity, target, 0.08);
  });

  if (!showSkeleton) return null;

  return (
    <group position={[0, 0.95, 0]}>
      {ribs.map(({ geo, key }) => (
        <mesh key={key} geometry={geo} material={material} />
      ))}
      {spine && <mesh geometry={spine} material={material} />}
    </group>
  );
}
