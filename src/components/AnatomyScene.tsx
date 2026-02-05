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
      <ambientLight intensity={0.6} color="#F5F5F0" />
      <directionalLight position={[5, 8, 6]} intensity={3.5} color="#FFFEF8" castShadow />
      <directionalLight position={[-4, 5, -4]} intensity={1.5} color="#FFF8F0" />
      <directionalLight position={[0, -2, 5]} intensity={0.8} color="#FFE8D8" />
      <pointLight position={[3, 3, 4]} intensity={2.0} color="#FFFBF5" distance={10} decay={2} />
      <pointLight position={[-3, 2, 3]} intensity={1.5} color="#FFF5EB" distance={10} decay={2} />
      <pointLight position={[0, -1, -3]} intensity={1.0} color="#FFE8DC" distance={8} decay={2} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.5}
        color="#FFFFFF"
        distance={15}
        decay={2}
      />
      <spotLight
        position={[4, 4, 4]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.2}
        color="#FFF8F0"
        distance={12}
        decay={2}
      />
      <hemisphereLight args={['#FFFEF8', '#40302A', 0.5]} />
    </>
  );
}

function Effects() {
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={0.25}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.95}
        mipmapBlur
        radius={0.8}
      />
      <SSAO
        radius={0.15}
        intensity={35}
        luminanceInfluence={0.7}
        worldDistanceThreshold={0.8}
        worldDistanceFalloff={0.15}
        worldProximityThreshold={0.4}
        worldProximityFalloff={0.15}
        color={new THREE.Color('#1A0808')}
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
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows
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
