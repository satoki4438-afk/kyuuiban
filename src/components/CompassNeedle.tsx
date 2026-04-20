import React from 'react';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

interface Props {
  size?: number;
}

export default function CompassNeedle({ size = 80 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const tip = 6;
  const base = size / 2 - 4;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon
        points={`${cx},${tip} ${cx - 5},${cy} ${cx + 5},${cy}`}
        fill={COLORS.gold}
      />
      <Polygon
        points={`${cx},${size - tip} ${cx - 5},${cy} ${cx + 5},${cy}`}
        fill="#555"
      />
      <Circle cx={cx} cy={cy} r={5} fill={COLORS.bgPrimary} stroke={COLORS.gold} strokeWidth={1.5} />
    </Svg>
  );
}
