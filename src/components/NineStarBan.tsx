import React from 'react';
import { G, Rect, Text as SvgText } from 'react-native-svg';
import type { BanPositions, Direction } from '../lib/kyusei/types';
import { NINE_STARS } from '../lib/kyusei/constants';
import { COLORS } from '../constants/colors';

const GRID_DIRS: (Direction | 'center')[][] = [
  ['北西', '北', '北東'],
  ['西', 'center', '東'],
  ['南西', '南', '南東'],
];

interface Props {
  ban: BanPositions;
  cx: number;
  cy: number;
  cellSize?: number;
}

export default function NineStarBan({ ban, cx, cy, cellSize = 22 }: Props) {
  const total = cellSize * 3;
  const sx = cx - total / 2;
  const sy = cy - total / 2;

  return (
    <G>
      {GRID_DIRS.map((row, ri) =>
        row.map((dir, ci) => {
          const starId = dir === 'center' ? ban.chuguStar : ban.positions[dir as Direction];
          const star = NINE_STARS[starId - 1];
          const x = sx + ci * cellSize;
          const y = sy + ri * cellSize;
          const isCenter = dir === 'center';
          return (
            <G key={`${ri}-${ci}`}>
              <Rect
                x={x} y={y}
                width={cellSize} height={cellSize}
                fill={isCenter ? '#3D2870' : COLORS.bgSecondary}
                stroke={COLORS.gold}
                strokeWidth={0.5}
                strokeOpacity={0.5}
              />
              <SvgText
                x={x + cellSize / 2}
                y={y + cellSize * 0.72}
                fontSize={isCenter ? 12 : 11}
                fontWeight={isCenter ? '700' : '400'}
                fill={isCenter ? COLORS.gold : COLORS.textSecondary}
                textAnchor="middle"
              >
                {starId}
              </SvgText>
            </G>
          );
        })
      )}
    </G>
  );
}
