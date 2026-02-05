import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import AllOrgans from './organs/AllOrgans';
import Skeleton from './organs/Skeleton';
import BodyShell from './organs/BodyShell';
import OrganLabel from './ui/OrganLabel';
import { useAnatomy } from '../context/AnatomyContext';

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.8} color="#F5F5F0" />
      <directionalLight position={[5, 8, 6]} intensity={2.5} color="#FFFEF8" castShadow />
      <directionalLight position={[-4, 5, -4]} intensity={1.2} color="#FFF8F0" />
      <directionalLight position={[0, -2, 5]} intensity={0.6} color="#FFE8D8" />
      <pointLight position={[3, 3, 4]} intensity={1.5} color="#FFFBF5" distance={10} decay={2} />
      <pointLight position={[-3, 2, 3]} intensity={1.0} color="#FFF5EB" distance={10} decay={2} />
      <hemisphereLight args={['#FFFEF8', '#40302A', 0.6]} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#555" wireframe />
    </mesh>
  );
}

export default function AnatomyScene() {
  const { autoRotate, setSelectedOrgan } = useAnatomy();

  return (
    <Canvas
      camera={{ position: [0, 1, 4.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows
      onPointerMissed={() => setSelectedOrgan(null)}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#1A1F2A']} />
      <fog attach="fog" args={['#1A1F2A', 8, 16]} />

      <SceneLighting />

      <Suspense fallback={<LoadingFallback />}>
        <group position={[0, -0.5, 0]}>
          <AllOrgans />
          <Skeleton />
          <BodyShell />
          <OrganLabel />
        </group>

        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.3}
          scale={4}
          blur={2.5}
          far={4}
          color="#0A0F1A"
        />
      </Suspense>

      <OrbitControls
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
}
