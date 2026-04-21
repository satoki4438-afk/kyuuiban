import type { Direction } from '../../lib/kyusei/types';
import {
  calculateBearing, calculateDistanceM, getBearingDirection, isInDirections,
} from '../../utils/bearing';

const BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PHOTO_BASE = 'https://maps.googleapis.com/maps/api/place/photo';

export type Category = '神社寺' | 'カフェ' | '公園' | 'パワースポット' | '温泉';

const CATEGORY_CONFIG: Record<Category, { type: string; keyword: string }> = {
  '神社寺':      { type: 'shrine',              keyword: '神社 寺院' },
  'カフェ':      { type: 'cafe',                keyword: '' },
  '公園':        { type: 'park',                keyword: '' },
  'パワースポット': { type: 'tourist_attraction', keyword: 'パワースポット' },
  '温泉':        { type: 'spa',                 keyword: '温泉' },
};

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  ratingsTotal: number;
  distance: number;
  bearing: number;
  direction: Direction;
  photoRef: string | null;
  vicinity: string;
}

export async function searchNearbySpots(params: {
  location: { latitude: number; longitude: number };
  radiusM: number;
  category: Category;
  luckyDirections: Direction[];
}): Promise<Spot[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!;
  const cfg = CATEGORY_CONFIG[params.category];

  const url = new URL(BASE);
  url.searchParams.set('location', `${params.location.latitude},${params.location.longitude}`);
  url.searchParams.set('radius', String(Math.min(params.radiusM, 50000)));
  url.searchParams.set('type', cfg.type);
  if (cfg.keyword) url.searchParams.set('keyword', cfg.keyword);
  url.searchParams.set('language', 'ja');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  const data = await res.json() as { status: string; results?: any[] };

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API: ${data.status}`);
  }

  return (data.results ?? [])
    .map((r: any): Spot => {
      const spotLoc = { latitude: r.geometry.location.lat, longitude: r.geometry.location.lng };
      const bearing = calculateBearing(params.location, spotLoc);
      return {
        id: r.place_id as string,
        name: r.name as string,
        lat: r.geometry.location.lat as number,
        lng: r.geometry.location.lng as number,
        rating: (r.rating as number | undefined) ?? null,
        ratingsTotal: (r.user_ratings_total as number | undefined) ?? 0,
        distance: calculateDistanceM(params.location, spotLoc),
        bearing,
        direction: getBearingDirection(bearing),
        photoRef: (r.photos?.[0]?.photo_reference as string | undefined) ?? null,
        vicinity: (r.vicinity as string | undefined) ?? '',
      };
    })
    .filter(s => isInDirections(s.bearing, params.luckyDirections))
    .sort((a, b) => a.distance - b.distance);
}

export function getPhotoUrl(ref: string): string {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!;
  return `${PHOTO_BASE}?maxwidth=400&photo_reference=${ref}&key=${apiKey}`;
}
