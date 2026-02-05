import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnatomy } from '../../context/AnatomyContext';
import type { OrganData } from '../../types';
import { createOrganTexture, createNormalMap, createRoughnessMap } from '../../lib/materialUtils';

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

  const textures = useMemo(() => {
    const colorTexture = createOrganTexture(data.color, 1024, 1024);
    const normalMap = createNormalMap(1024, 1024);
    const roughnessMap = createRoughnessMap(0.4, 512, 512);

    return { colorTexture, normalMap, roughnessMap };
  }, [data.color]);

  const material = useMemo(() => {
    const baseColor = new THREE.Color(data.color);

    return new THREE.MeshPhysicalMaterial({
      map: textures.colorTexture,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughnessMap: textures.roughnessMap,
      roughness: 0.4,
      metalness: 0,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      transmission: 0.15,
      thickness: 1.5,
      ior: 1.4,
      sheen: 0.6,
      sheenRoughness: 0.6,
      sheenColor: baseColor.clone().multiplyScalar(0.4),
      attenuationColor: baseColor.clone().multiplyScalar(0.85),
      attenuationDistance: 0.5,
      specularIntensity: 0.5,
      specularColor: new THREE.Color(0xFFFFFF),
      emissive: new THREE.Color(data.emissiveColor),
      emissiveIntensity: 0.12,
    });
  }, [data.color, data.emissiveColor, textures]);

  useEffect(() => {
    return () => {
      textures.colorTexture.dispose();
      textures.normalMap.dispose();
      textures.roughnessMap.dispose();
      material.dispose();
    };
  }, [textures, material]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
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
