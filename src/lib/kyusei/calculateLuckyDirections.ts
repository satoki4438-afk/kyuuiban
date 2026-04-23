import type { BanPositions, Direction, LuckyInfo } from './types';
import { NINE_STARS, SEISHO_MAP, OPPOSITE_DIRECTION, DIRECTION_ORDER } from './constants';

export function calculateLuckyDirections(
  honmeiSei: number,
  ban: BanPositions
): LuckyInfo {
  const myGogyou = NINE_STARS[honmeiSei - 1].gogyou;
  const compatible = SEISHO_MAP[myGogyou];
  const avoidDirections: Direction[] = [];

  // 五黄殺
  let goouSatsuDir: Direction = '北';
  DIRECTION_ORDER.forEach(dir => {
    if (ban.positions[dir] === 5) {
      goouSatsuDir = dir;
      avoidDirections.push(dir);
    }
  });

  // 暗剣殺（五黄殺の対面）
  const ankenSatsuDir = OPPOSITE_DIRECTION[goouSatsuDir];
  avoidDirections.push(ankenSatsuDir);

  // 本命殺（自分の星がある方位）と的殺（その対面）
  DIRECTION_ORDER.forEach(dir => {
    if (ban.positions[dir] === honmeiSei) {
      if (!avoidDirections.includes(dir)) avoidDirections.push(dir);
      const tekiDir = OPPOSITE_DIRECTION[dir];
      if (!avoidDirections.includes(tekiDir)) avoidDirections.push(tekiDir);
    }
  });

  // 吉方位: 相生・比和 かつ凶方位でない
  const luckyDirections: Direction[] = [];
  DIRECTION_ORDER.forEach(dir => {
    if (avoidDirections.includes(dir)) return;
    const starGogyou = NINE_STARS[ban.positions[dir] - 1].gogyou;
    if (compatible.includes(starGogyou)) {
      luckyDirections.push(dir);
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
