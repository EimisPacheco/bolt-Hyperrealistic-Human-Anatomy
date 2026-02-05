import type { Vector3Tuple } from 'three';

export interface OrganData {
  id: string;
  name: string;
  system: OrganSystem;
  description: string;
  functions: string[];
  facts: string[];
  weight: string;
  size: string;
  color: string;
  emissiveColor: string;
  position: Vector3Tuple;
  scale: Vector3Tuple;
}

export type OrganSystem =
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'nervous'
  | 'urinary'
  | 'lymphatic'
  | 'skeletal';

export interface AnatomyState {
  selectedOrgan: string | null;
  hoveredOrgan: string | null;
  visibleSystems: OrganSystem[];
  showBody: boolean;
  showSkeleton: boolean;
  xrayMode: boolean;
  autoRotate: boolean;
}
