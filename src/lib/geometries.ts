import * as THREE from 'three';
import { fbm } from './noise';

export function createBrainGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.32, 64, 48);
  const pos = geo.attributes.position;
  const normal = geo.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const nx = normal.getX(i);
    const ny = normal.getY(i);
    const nz = normal.getZ(i);

    const wrinkle = fbm(x * 8, y * 8, z * 8, 5, 2.2, 0.55) * 0.025;
    const largeWrinkle = fbm(x * 3, y * 3, z * 3, 3, 2.0, 0.5) * 0.015;
    const fissure = Math.abs(x) < 0.015 ? -0.02 : 0;
    const flattenBottom = y < -0.15 ? (y + 0.15) * 0.3 : 0;

    const displacement = wrinkle + largeWrinkle + fissure + flattenBottom;

    pos.setXYZ(i, x + nx * displacement, y * 0.85 + ny * displacement, z + nz * displacement);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createHeartGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.bezierCurveTo(0, -0.06, -0.12, -0.18, -0.18, -0.18);
  shape.bezierCurveTo(-0.3, -0.18, -0.3, -0.03, -0.3, -0.03);
  shape.bezierCurveTo(-0.3, 0.06, -0.18, 0.18, 0, 0.27);
  shape.bezierCurveTo(0.18, 0.18, 0.3, 0.06, 0.3, -0.03);
  shape.bezierCurveTo(0.3, -0.03, 0.3, -0.18, 0.18, -0.18);
  shape.bezierCurveTo(0.12, -0.18, 0, -0.06, 0, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 12,
    steps: 4,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.rotateX(Math.PI);
  geo.scale(0.8, 0.8, 0.9);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const bump = fbm(x * 12, y * 12, z * 12, 3, 2, 0.4) * 0.008;
    pos.setXYZ(i, x + bump, y + bump, z + bump);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createLungGeometry(isLeft: boolean): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.28, 48, 36);
  const pos = geo.attributes.position;
  const normal = geo.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);

    const nx = normal.getX(i);
    const ny = normal.getY(i);
    const nz = normal.getZ(i);

    x *= 0.65;
    y *= 1.4;

    const medialSide = isLeft ? x > 0.05 : x < -0.05;
    const cardiacNotch = medialSide && y > -0.05 && y < 0.15 ? -0.06 : 0;
    const taperedTop = y > 0.2 ? -(y - 0.2) * 0.15 : 0;
    const roundedBottom = y < -0.25 ? (y + 0.25) * 0.1 : 0;
    const surfaceDetail = fbm(x * 10, y * 10, z * 10, 4, 2, 0.5) * 0.008;

    const disp = cardiacNotch + taperedTop + roundedBottom + surfaceDetail;

    pos.setXYZ(i, x + nx * disp, y + ny * disp, z + nz * disp);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createLiverGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.35, 48, 32);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    y *= 0.4;
    x *= 1.2;

    if (x < -0.15) {
      const taper = 1 - ((-x - 0.15) / 0.3) * 0.6;
      y *= taper;
      z *= taper;
    }

    if (y > 0) y *= 0.7;

    const detail = fbm(x * 8, y * 12, z * 8, 3, 2, 0.4) * 0.008;
    pos.setXYZ(i, x + detail, y + detail, z + detail);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createStomachGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 32;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = (t - 0.5) * 0.5;
    let r: number;

    if (t < 0.15) {
      r = 0.04 + t * 0.4;
    } else if (t < 0.6) {
      r = 0.1 + Math.sin((t - 0.15) * Math.PI / 0.45) * 0.08;
    } else {
      r = 0.18 - (t - 0.6) * 0.35;
    }

    points.push(new THREE.Vector2(Math.max(0.01, r), y));
  }

  const geo = new THREE.LatheGeometry(points, 32);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const bendAmount = y * 0.4;
    const detail = fbm(x * 12, y * 12, z * 12, 3, 2, 0.4) * 0.005;

    pos.setXYZ(i, x + bendAmount + detail, y + detail, z + detail);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createKidneyGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.12, 32, 24);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);

    y *= 1.5;
    x *= 0.7;

    if (x > 0) {
      const indent = Math.exp(-y * y * 8) * 0.04;
      x -= indent;
    }

    const detail = fbm(x * 15, y * 15, z * 15, 3, 2, 0.4) * 0.004;
    pos.setXYZ(i, x + detail, y + detail, z + detail);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createSpleenGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.1, 32, 24);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    x *= 0.7;

    const detail = fbm(x * 14, y * 14, z * 14, 3, 2, 0.4) * 0.004;
    pos.setXYZ(i, x + detail, y * 1.3 + detail, z + detail);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createPancreasGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0, 0),
    new THREE.Vector3(-0.1, 0.02, 0.02),
    new THREE.Vector3(0, 0.01, 0.01),
    new THREE.Vector3(0.1, -0.01, 0),
    new THREE.Vector3(0.18, -0.02, -0.01),
  ]);

  const radiusSegments = 16;
  const geo = new THREE.TubeGeometry(curve, 32, 0.04, radiusSegments, false);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const headScale = x < -0.1 ? 1.3 : 1;
    const tailScale = x > 0.1 ? 0.7 + (0.18 - x) * 1.5 : 1;
    const scale = Math.min(headScale, tailScale);
    const detail = fbm(x * 15, y * 15, z * 15, 3, 2, 0.4) * 0.003;

    pos.setXYZ(i, x + detail, y * scale + detail, z * scale + detail);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createBladderGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 24;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = (t - 0.5) * 0.2;
    let r: number;

    if (t < 0.2) {
      r = 0.02 + t * 0.3;
    } else if (t < 0.7) {
      r = 0.08 + Math.sin((t - 0.2) * Math.PI / 0.5) * 0.03;
    } else {
      r = 0.11 - (t - 0.7) * 0.25;
    }

    points.push(new THREE.Vector2(Math.max(0.01, r), y));
  }

  const geo = new THREE.LatheGeometry(points, 24);
  geo.computeVertexNormals();
  return geo;
}

export function createSmallIntestineGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const coils = 8;
  const pointsPerCoil = 12;

  for (let i = 0; i <= coils * pointsPerCoil; i++) {
    const t = i / (coils * pointsPerCoil);
    const angle = t * coils * Math.PI * 2;
    const radius = 0.12 - t * 0.04;
    const jitterX = fbm(t * 20, 0, 0, 2, 2, 0.5) * 0.02;
    const jitterZ = fbm(0, 0, t * 20, 2, 2, 0.5) * 0.02;
    const x = Math.cos(angle) * radius + jitterX;
    const y = -t * 0.25 + 0.1;
    const z = Math.sin(angle) * radius * 0.7 + jitterZ;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 200, 0.018, 8, false);
  geo.computeVertexNormals();
  return geo;
}

export function createLargeIntestineGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0.2, -0.2, 0),
    new THREE.Vector3(0.22, -0.1, 0),
    new THREE.Vector3(0.22, 0, 0),
    new THREE.Vector3(0.22, 0.08, 0),
    new THREE.Vector3(0.18, 0.12, 0),
    new THREE.Vector3(0.1, 0.13, 0),
    new THREE.Vector3(0, 0.13, 0),
    new THREE.Vector3(-0.1, 0.13, 0),
    new THREE.Vector3(-0.18, 0.12, 0),
    new THREE.Vector3(-0.22, 0.08, 0),
    new THREE.Vector3(-0.22, 0, 0),
    new THREE.Vector3(-0.22, -0.08, 0),
    new THREE.Vector3(-0.2, -0.15, 0),
    new THREE.Vector3(-0.15, -0.2, 0),
    new THREE.Vector3(-0.08, -0.22, 0),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 64, 0.035, 12, false);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const haustra = Math.sin(i * 0.3) * 0.005;
    pos.setXYZ(i, x + haustra, y + haustra, z);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createTracheaGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(0, -0.05, 0),
    new THREE.Vector3(0, -0.15, 0.01),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 24, 0.03, 12, false);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ring = Math.sin(y * 40) * 0.003;
    pos.setXYZ(i, x + ring, y, z + ring);
  }

  geo.computeVertexNormals();
  return geo;
}

export function createEsophagusGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(0, 0.5, -0.02),
    new THREE.Vector3(0, 0.2, -0.03),
    new THREE.Vector3(-0.02, -0.05, -0.02),
    new THREE.Vector3(-0.03, -0.25, 0),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 32, 0.018, 10, false);
}

export function createAortaGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0, -0.1, 0.05),
    new THREE.Vector3(0, 0.05, 0.05),
    new THREE.Vector3(0, 0.15, 0.03),
    new THREE.Vector3(0.02, 0.22, 0),
    new THREE.Vector3(0.03, 0.25, -0.05),
    new THREE.Vector3(0.02, 0.22, -0.1),
    new THREE.Vector3(0, 0.15, -0.12),
    new THREE.Vector3(0, 0, -0.1),
    new THREE.Vector3(0, -0.2, -0.08),
    new THREE.Vector3(0, -0.5, -0.06),
    new THREE.Vector3(0, -0.8, -0.04),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 48, 0.025, 12, false);
  geo.computeVertexNormals();
  return geo;
}

export function createRibGeometry(index: number, side: number): THREE.BufferGeometry {
  const ribLength = 12 - index * 0.5;
  const curvePoints: THREE.Vector3[] = [];
  const segments = 24;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 0.75;
    const r = ribLength * 0.035;
    const x = Math.sin(angle) * r * side;
    const y = -index * 0.065 + Math.cos(angle) * 0.03;
    const z = -Math.cos(angle) * r * 0.5 + 0.1;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(curvePoints);
  return new THREE.TubeGeometry(curve, 20, 0.012, 6, false);
}

export function createSpineGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const vertebrae: THREE.BufferGeometry[] = [];

  for (let i = 0; i < 24; i++) {
    const v = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8);
    v.translate(0, 0.55 - i * 0.065, -0.15);
    vertebrae.push(v);

    const disc = new THREE.CylinderGeometry(0.022, 0.022, 0.02, 8);
    disc.translate(0, 0.55 - i * 0.065 - 0.03, -0.15);
    vertebrae.push(disc);
  }

  const merged = mergeGeometries(vertebrae);
  return merged || geo;
}

function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (geometries.length === 0) return null;

  let totalVerts = 0;
  let totalIndices = 0;

  for (const g of geometries) {
    totalVerts += g.attributes.position.count;
    if (g.index) totalIndices += g.index.count;
  }

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const indices = new Uint32Array(totalIndices);

  let vertOffset = 0;
  let indexOffset = 0;

  for (const g of geometries) {
    const pos = g.attributes.position;
    const norm = g.attributes.normal;

    for (let i = 0; i < pos.count; i++) {
      positions[(vertOffset + i) * 3] = pos.getX(i);
      positions[(vertOffset + i) * 3 + 1] = pos.getY(i);
      positions[(vertOffset + i) * 3 + 2] = pos.getZ(i);

      if (norm) {
        normals[(vertOffset + i) * 3] = norm.getX(i);
        normals[(vertOffset + i) * 3 + 1] = norm.getY(i);
        normals[(vertOffset + i) * 3 + 2] = norm.getZ(i);
      }
    }

    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        indices[indexOffset + i] = g.index.getX(i) + vertOffset;
      }
      indexOffset += g.index.count;
    }

    vertOffset += pos.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  if (totalIndices > 0) merged.setIndex(new THREE.BufferAttribute(indices, 1));

  return merged;
}
