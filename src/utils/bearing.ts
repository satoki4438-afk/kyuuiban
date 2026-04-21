import type { Direction } from '../lib/kyusei/types';

interface LatLng { latitude: number; longitude: number; }

export function calculateBearing(from: LatLng, to: LatLng): number {
  const dLng = (to.longitude - from.longitude) * Math.PI / 180;
  const lat1 = from.latitude * Math.PI / 180;
  const lat2 = to.latitude * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

export function calculateDistanceM(from: LatLng, to: LatLng): number {
  const R = 6371000;
  const lat1 = from.latitude * Math.PI / 180;
  const lat2 = to.latitude * Math.PI / 180;
  const dLat = (to.latitude - from.latitude) * Math.PI / 180;
  const dLng = (to.longitude - from.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
}

const DIR_RANGES: Array<{ dir: Direction; start: number; end: number }> = [
  { dir: '北',   start: 337.5, end: 22.5  },
  { dir: '北東', start: 22.5,  end: 67.5  },
  { dir: '東',   start: 67.5,  end: 112.5 },
  { dir: '南東', start: 112.5, end: 157.5 },
  { dir: '南',   start: 157.5, end: 202.5 },
  { dir: '南西', start: 202.5, end: 247.5 },
  { dir: '西',   start: 247.5, end: 292.5 },
  { dir: '北西', start: 292.5, end: 337.5 },
];

function inRange(bearing: number, start: number, end: number): boolean {
  return start > end
    ? bearing >= start || bearing < end
    : bearing >= start && bearing < end;
}

export function getBearingDirection(bearing: number): Direction {
  return DIR_RANGES.find(r => inRange(bearing, r.start, r.end))?.dir ?? '北';
}

export function isInDirections(bearing: number, dirs: Direction[]): boolean {
  return dirs.some(dir => {
    const r = DIR_RANGES.find(x => x.dir === dir);
    return r ? inRange(bearing, r.start, r.end) : false;
  });
}
