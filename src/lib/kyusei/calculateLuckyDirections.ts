import type { BanPositions, Direction, LuckyInfo } from './types';
import { NINE_STARS, SEISHO_MAP, OPPOSITE_DIRECTION, DIRECTION_ORDER } from './constants';

export function calculateLuckyDirections(
  honmeiSei: number,
  ban: BanPositions
): LuckyInfo {
  const myGogyou = NINE_STARS[honmeiSei - 1].gogyou;
  const compatible = SEISHO_MAP[myGogyou];

  const luckyDirections: Direction[] = [];
  const avoidDirections: Direction[] = [];

  DIRECTION_ORDER.forEach(dir => {
    const starId = ban.positions[dir];
    const starGogyou = NINE_STARS[starId - 1].gogyou;
    if (compatible.includes(starGogyou)) {
      luckyDirections.push(dir);
    }
  });

  let goouSatsuDir: Direction = '北';
  DIRECTION_ORDER.forEach(dir => {
    if (ban.positions[dir] === 5) {
      goouSatsuDir = dir;
      avoidDirections.push(dir);
    }
  });

  const ankenSatsuDir = OPPOSITE_DIRECTION[goouSatsuDir];
  avoidDirections.push(ankenSatsuDir);

  DIRECTION_ORDER.forEach(dir => {
    const starId = ban.positions[dir];
    if (starId === honmeiSei && !avoidDirections.includes(dir)) {
      avoidDirections.push(dir);
    }
  });

  return {
    luckyDirections,
    avoidDirections,
    commonBad: {
      goouSatsu: goouSatsuDir,
      ankenSatsu: ankenSatsuDir,
      saiha: '北',
      gappa: '北',
      nippa: '北',
    },
  };
}
