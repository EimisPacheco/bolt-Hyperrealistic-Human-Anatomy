import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnatomy } from '../../context/AnatomyContext';

function createTorsoGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 40;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = (t - 0.5) * 2.8;
    let r: number;

    if (t < 0.08) {
      r = 0.15 + t * 1.2;
    } else if (t < 0.15) {
      r = 0.25 + (t - 0.08) * 2.5;
    } else if (t < 0.25) {
      r = 0.42 + Math.sin((t - 0.15) * Math.PI / 0.1) * 0.03;
    } else if (t < 0.4) {
      r = 0.42 - (t - 0.25) * 0.4;
    } else if (t < 0.55) {
      r = 0.36 - (t - 0.4) * 0.15;
    } else if (t < 0.7) {
      r = 0.34 + (t - 0.55) * 0.3;
    } else if (t < 0.85) {
      r = 0.38 - (t - 0.7) * 0.6;
    } else {
      r = 0.29 - (t - 0.85) * 1.2;
    }

    points.push(new THREE.Vector2(Math.max(0.01, r), y));
  }

  return new THREE.LatheGeometry(points, 48);
}

function createHeadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.22, 32, 24);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);

    if (y < -0.05) {
      const jawNarrow = 1 - Math.abs(y + 0.05) * 0.4;
      pos.setX(i, x * jawNarrow);
    }

    pos.setY(i, y * 1.15);
  }

  geo.computeVertexNormals();
  return geo;
}

export default function BodyShell() {
  const { showBody, xrayMode, selectedOrgan } = useAnatomy();
  const groupRef = useRef<THREE.Group>(null);

  const torsoGeo = useMemo(() => createTorsoGeometry(), []);
  const headGeo = useMemo(() => createHeadGeometry(), []);

  const material = useMemo(
    () => {
      try {
        return new THREE.MeshPhysicalMaterial({
          color: '#E8D4C0',
          emissive: '#3A2820',
          emissiveIntensity: 0.05,
          roughness: 0.45,
          metalness: 0,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
          transmission: 0.25,
          thickness: 2.0,
          ior: 1.38,
          clearcoat: 0.3,
          clearcoatRoughness: 0.4,
          sheen: 0.4,
          sheenRoughness: 0.7,
          sheenColor: new THREE.Color('#FFE0C8'),
          attenuationColor: new THREE.Color('#FFD5B0'),
          attenuationDistance: 1.0,
          specularIntensity: 0.3,
          specularColor: new THREE.Color(0xFFFFFF),
        });
      } catch (e) {
        console.error('Error creating body shell material:', e);
        return new THREE.MeshStandardMaterial({
          color: '#E8D4C0',
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
        });
      }
    },
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const mat = material;
    const targetOpacity = xrayMode ? 0.05 : selectedOrgan ? 0.04 : 0.08;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
  });

  if (!showBody) return null;

  return (
    <group ref={groupRef}>
      <mesh geometry={torsoGeo} material={material} position={[0, 0.4, 0]} />
      <mesh geometry={headGeo} material={material} position={[0, 2.85, 0]} />

      <mesh material={material} position={[0, 2.35, 0.03]}>
        <cylinderGeometry args={[0.08, 0.1, 0.35, 16]} />
      </mesh>

      <mesh material={material} position={[-0.58, 1.45, 0]}>
        <capsuleGeometry args={[0.07, 0.55, 8, 16]} />
      </mesh>
      <mesh material={material} position={[0.58, 1.45, 0]}>
        <capsuleGeometry args={[0.07, 0.55, 8, 16]} />
      </mesh>

      <mesh material={material} position={[-0.62, 0.7, 0.02]}>
        <capsuleGeometry args={[0.06, 0.55, 8, 16]} />
      </mesh>
      <mesh material={material} position={[0.62, 0.7, 0.02]}>
        <capsuleGeometry args={[0.06, 0.55, 8, 16]} />
      </mesh>

      <mesh material={material} position={[-0.18, -0.85, 0]}>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
      </mesh>
      <mesh material={material} position={[0.18, -0.85, 0]}>
        <capsuleGeometry args={[0.1, 0.7, 8, 16]} />
      </mesh>

      <mesh material={material} position={[-0.18, -1.75, 0.02]}>
        <capsuleGeometry args={[0.08, 0.7, 8, 16]} />
      </mesh>
      <mesh material={material} position={[0.18, -1.75, 0.02]}>
        <capsuleGeometry args={[0.08, 0.7, 8, 16]} />
      </mesh>
    </group>
  );
}
