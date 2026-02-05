import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import AllOrgans from './organs/AllOrgans';
import Skeleton from './organs/Skeleton';
import BodyShell from './organs/BodyShell';
import OrganLabel from './ui/OrganLabel';
import { useAnatomy } from '../context/AnatomyContext';

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#F0F0F0" />
      <directionalLight position={[3, 5, 4]} intensity={2.5} color="#FFFFFF" castShadow />
      <directionalLight position={[-2, 3, -3]} intensity={0.8} color="#FFFFFF" />
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#FFFBF5" distance={8} />
      <pointLight position={[0, -1, -2]} intensity={0.6} color="#F8F8FF" distance={6} />
      <spotLight
        position={[0, 6, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#FFFFFF"
        distance={12}
      />
      <hemisphereLight args={['#FFFFFF', '#808080', 0.3]} />
    </>
  );
}

function Effects() {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={0.12}
        luminanceThreshold={0.95}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <SSAO
        radius={0.08}
        intensity={25}
        luminanceInfluence={0.6}
        worldDistanceThreshold={0.5}
        worldDistanceFalloff={0.1}
        worldProximityThreshold={0.3}
        worldProximityFalloff={0.1}
        color={new THREE.Color('#000000')}
      />
    </EffectComposer>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#333" wireframe />
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
        toneMappingExposure: 1.3,
      }}
      onPointerMissed={() => setSelectedOrgan(null)}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#1A1F2A']} />
      <fog attach="fog" args={['#1A1F2A', 6, 14]} />

      <SceneLighting />

      <Suspense fallback={<LoadingFallback />}>
        <Environment preset="studio" />

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

      <Effects />

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
