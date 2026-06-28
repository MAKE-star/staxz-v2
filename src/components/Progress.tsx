import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, FadeIn } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../constants';

const STEPS = [
  { label: 'Business', route: '/(provider)/onboarding/step1' },
  { label: 'Services',  route: '/(provider)/onboarding/step2' },
  { label: 'Portfolio', route: '/(provider)/onboarding/step3' },
  { label: 'Location',  route: '/(provider)/onboarding/step4' },
  { label: 'Go Live',   route: '/(provider)/onboarding/step5' },
];

// Subtle dot pattern background component
export function DotBackground() {
  const dots = [];
  const cols = 12, rows = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View key={`${r}-${c}`} style={{
          width: 3, height: 3, borderRadius: 1.5,
          backgroundColor: '#9B6FD4',
          opacity: 0.07 + (Math.sin(r * 0.8 + c * 0.5) * 0.04),
          margin: 14,
        }} />
      );
    }
  }
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents="none">
      {dots}
    </View>
  );
}

export function Progress({ current, onBack }: { current: number; onBack: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pct    = Math.round((current / (STEPS.length - 1)) * 100);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(pct, { duration: 600 });
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({ width: `${barWidth.value}%` }));

  return (
    <View style={{ backgroundColor: C.bg0, paddingHorizontal: 24, paddingTop: insets.top + 10, paddingBottom: 18 }}>
      <DotBackground />

      {/* Back */}
      <TouchableOpacity onPress={onBack}
        style={{ marginBottom: 14, width: 34, height: 34, borderRadius: 17,
          backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
          shadowColor: '#9B6FD4', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2,
          borderWidth: 1, borderColor: C.border }}>
        <ChevronLeft size={20} color={C.text0} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Step label + % */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <Animated.View entering={FadeIn.duration(300)}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#9B6FD4', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 3 }}>
            Step {current + 1} of {STEPS.length}
          </Text>
          <Text style={{ fontSize: 19, fontWeight: '900', color: C.text0 }}>
            {STEPS[current].label}
          </Text>
        </Animated.View>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#9B6FD4', letterSpacing: -1 }}>
          {pct}%
        </Text>
      </View>

      {/* Track */}
      <View style={{ height: 5, backgroundColor: C.bg3, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
        <Animated.View style={[{ height: 5, backgroundColor: '#9B6FD4', borderRadius: 99 }, barStyle]} />
      </View>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {STEPS.map((s, i) => (
          <StepDot key={i} index={i} current={current} label={s.label}
            onPress={() => { if (i < current) router.push(s.route as any); }} />
        ))}
      </View>
    </View>
  );
}

function StepDot({ index, current, label, onPress }: { index: number; current: number; label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const isCompleted = index < current;
  const isActive    = index === current;

  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    if (!isCompleted) return;
    scale.value = withSpring(0.8, {}, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!isCompleted} style={{ alignItems: 'center', gap: 4 }}>
      <Animated.View style={[{
        width: isActive ? 24 : 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: isCompleted ? '#4CAF82' : isActive ? '#9B6FD4' : C.bg3,
      }, dotStyle]} />
      {isActive && (
        <Text style={{ fontSize: 8, color: '#9B6FD4', fontWeight: '700' }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}