import * as THREE from 'three';
import { fbm } from './noise';

export function createOrganTexture(
  baseColor: string,
  width = 512,
  height = 512
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.Texture();
  }

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const color = new THREE.Color(baseColor);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const u = x / width;
      const v = y / height;

      const fineNoise = fbm(u * 40, v * 40, 0, 4, 2.2, 0.5);
      const mediumNoise = fbm(u * 15, v * 15, 1, 3, 2.0, 0.6);
      const coarseNoise = fbm(u * 5, v * 5, 2, 2, 2.0, 0.55);

      const veinPattern = Math.abs(fbm(u * 25, v * 25, 3, 4, 2.5, 0.4));
      const isVein = veinPattern < 0.15 ? 1 : 0;

      const colorVariation = (fineNoise * 0.08 + mediumNoise * 0.12 + coarseNoise * 0.15);
      const veinDarkening = isVein * -0.25;

      const finalVariation = 1 + colorVariation + veinDarkening;

      data[idx] = Math.max(0, Math.min(255, color.r * 255 * finalVariation));
      data[idx + 1] = Math.max(0, Math.min(255, color.g * 255 * finalVariation));
      data[idx + 2] = Math.max(0, Math.min(255, color.b * 255 * finalVariation));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}

export function createNormalMap(width = 512, height = 512): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.Texture();
  }

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const heightMap: number[][] = [];

  for (let y = 0; y < height; y++) {
    heightMap[y] = [];
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;

      const detail = fbm(u * 60, v * 60, 0, 6, 2.3, 0.45) * 0.5 +
                    fbm(u * 30, v * 30, 1, 4, 2.1, 0.5) * 0.3 +
                    fbm(u * 10, v * 10, 2, 3, 2.0, 0.5) * 0.2;

      heightMap[y][x] = detail;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const left = heightMap[y][Math.max(0, x - 1)];
      const right = heightMap[y][Math.min(width - 1, x + 1)];
      const up = heightMap[Math.max(0, y - 1)][x];
      const down = heightMap[Math.min(height - 1, y + 1)][x];

      const dx = (right - left) * 0.5;
      const dy = (down - up) * 0.5;

      const normal = new THREE.Vector3(-dx, -dy, 1).normalize();

      data[idx] = Math.floor((normal.x * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((normal.y * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((normal.z * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}

export function createRoughnessMap(
  baseRoughness = 0.5,
  width = 512,
  height = 512
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.Texture();
  }

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const u = x / width;
      const v = y / height;

      const variation = fbm(u * 20, v * 20, 5, 4, 2.0, 0.5) * 0.2;
      const roughness = Math.max(0, Math.min(1, baseRoughness + variation));

      const value = Math.floor(roughness * 255);
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}
