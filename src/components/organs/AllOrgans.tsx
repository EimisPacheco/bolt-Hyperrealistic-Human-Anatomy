import { useMemo } from 'react';
import OrganMesh from './OrganMesh';
import { organData } from '../../data/organData';
import {
  createBrainGeometry,
  createHeartGeometry,
  createLungGeometry,
  createLiverGeometry,
  createStomachGeometry,
  createKidneyGeometry,
  createSpleenGeometry,
  createPancreasGeometry,
  createBladderGeometry,
  createSmallIntestineGeometry,
  createLargeIntestineGeometry,
  createTracheaGeometry,
  createEsophagusGeometry,
  createAortaGeometry,
} from '../../lib/geometries';

export default function AllOrgans() {
  const geometries = useMemo(
    () => ({
      brain: createBrainGeometry(),
      heart: createHeartGeometry(),
      leftLung: createLungGeometry(true),
      rightLung: createLungGeometry(false),
      liver: createLiverGeometry(),
      stomach: createStomachGeometry(),
      leftKidney: createKidneyGeometry(),
      rightKidney: createKidneyGeometry(),
      spleen: createSpleenGeometry(),
      pancreas: createPancreasGeometry(),
      bladder: createBladderGeometry(),
      smallIntestine: createSmallIntestineGeometry(),
      largeIntestine: createLargeIntestineGeometry(),
      trachea: createTracheaGeometry(),
      esophagus: createEsophagusGeometry(),
      aorta: createAortaGeometry(),
    }),
    []
  );

  return (
    <group>
      <OrganMesh data={organData.brain} geometry={geometries.brain} />
      <OrganMesh data={organData.heart} geometry={geometries.heart} animate="pulse" />
      <OrganMesh data={organData.leftLung} geometry={geometries.leftLung} animate="breathe" />
      <OrganMesh data={organData.rightLung} geometry={geometries.rightLung} animate="breathe" />
      <OrganMesh data={organData.liver} geometry={geometries.liver} />
      <OrganMesh data={organData.stomach} geometry={geometries.stomach} />
      <OrganMesh data={organData.leftKidney} geometry={geometries.leftKidney} />
      <OrganMesh data={organData.rightKidney} geometry={geometries.rightKidney} />
      <OrganMesh data={organData.spleen} geometry={geometries.spleen} />
      <OrganMesh data={organData.pancreas} geometry={geometries.pancreas} />
      <OrganMesh data={organData.bladder} geometry={geometries.bladder} />
      <OrganMesh data={organData.smallIntestine} geometry={geometries.smallIntestine} />
      <OrganMesh data={organData.largeIntestine} geometry={geometries.largeIntestine} />
      <OrganMesh data={organData.trachea} geometry={geometries.trachea} />
      <OrganMesh data={organData.esophagus} geometry={geometries.esophagus} />
      <OrganMesh data={organData.aorta} geometry={geometries.aorta} animate="pulse" />
    </group>
  );
}
