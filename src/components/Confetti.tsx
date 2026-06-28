import { useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, Easing, runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const COLORS = ['#7B4FA6', '#9B6FD4', '#9B6FD4', '#A855F7', '#14B8A6', '#F59E0B', '#fff'];
const COUNT = 60;

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

function Particle({ color, delay }: { color: string; delay: number }) {
  const x = useSharedValue(randomBetween(0, width));
  const y = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const size = randomBetween(6, 12);

  useEffect(() => {
    y.value = withDelay(delay, withTiming(height + 40, { duration: randomBetween(1200, 2200), easing: Easing.in(Easing.quad) }));
    rotate.value = withDelay(delay, withTiming(randomBetween(180, 720), { duration: 2000 }));
    opacity.value = withDelay(delay + 1400, withTiming(0, { duration: 400 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: y.value,
    left: x.value,
    width: size,
    height: size * 0.5,
    borderRadius: 2,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return <Animated.View style={style} />;
}

export function Confetti({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: COUNT }).map((_, i) => (
        <Particle
          key={i}
          color={COLORS[i % COLORS.length]}
          delay={randomBetween(0, 600)}
        />
      ))}
    </View>
  );
}