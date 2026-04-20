import { useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export function useCompass() {
  const heading = useSharedValue(0);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    const sub = Magnetometer.addListener(({ x, y }) => {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 360) % 360;
      heading.value = withTiming(angle, { duration: 300 });
    });
    return () => sub.remove();
  }, []);

  return heading;
}
