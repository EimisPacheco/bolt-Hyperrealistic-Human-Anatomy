import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnatomy } from '../../context/AnatomyContext';
import type { OrganData } from '../../types';

interface OrganMeshProps {
  data: OrganData;
  geometry: THREE.BufferGeometry;
  animate?: 'pulse' | 'breathe' | null;
}

export default function OrganMesh({ data, geometry, animate }: OrganMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverRef = useRef(0);
  const { selectedOrgan, hoveredOrgan, setSelectedOrgan, setHoveredOrgan, xrayMode, visibleSystems } = useAnatomy();

  const isSelected = selectedOrgan === data.id;
  const isHovered = hoveredOrgan === data.id;
  const isVisible = visibleSystems.includes(data.system);
  const isOtherSelected = selectedOrgan !== null && !isSelected;

  const material = useMemo(() => {
    const baseColor = new THREE.Color(data.color);

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.05,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(data.emissiveColor),
      emissiveIntensity: 0.15,
    });
  }, [data.color, data.emissiveColor]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const time = state.clock.elapsedTime;

    const targetHover = isHovered || isSelected ? 1 : 0;
    hoverRef.current = THREE.MathUtils.lerp(hoverRef.current, targetHover, 0.1);

    mat.emissiveIntensity = 0.15 + hoverRef.current * 0.4;

    if (xrayMode) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isSelected ? 0.9 : isHovered ? 0.7 : 0.3, 0.08);
    } else if (isOtherSelected) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.15, 0.08);
    } else {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.08);
    }

    if (animate === 'pulse') {
      const pulse = 1 + Math.sin(time * 3.5) * 0.02;
      mesh.scale.setScalar(pulse);
    } else if (animate === 'breathe') {
      const breath = 1 + Math.sin(time * 1.2) * 0.015;
      mesh.scale.set(1, breath, 1);
    }

    if (isSelected) {
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, data.position[2] + 0.15, 0.05);
    } else {
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, data.position[2], 0.05);
    }
  });

  if (!isVisible) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={data.position}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedOrgan(data.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(data.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'default';
      }}
    />
  );
}
