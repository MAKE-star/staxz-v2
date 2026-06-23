import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, FadeIn } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { C } from '../constants';

const STEPS = [
  { label: 'Business', icon: '🏢', route: '/(provider)/onboarding/step1' },
  { label: 'Services',  icon: '✂️', route: '/(provider)/onboarding/step2' },
  { label: 'Portfolio', icon: '📸', route: '/(provider)/onboarding/step3' },
  { label: 'Location',  icon: '📍', route: '/(provider)/onboarding/step4' },
  { label: 'Go Live',   icon: '🚀', route: '/(provider)/onboarding/step5' },
];

export function Progress({ current, onBack }: { current: number; onBack: () => void }) {
  const router = useRouter();
  const pct = Math.round((current / (STEPS.length - 1)) * 100);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(pct, { duration: 600 });
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <View style={{ backgroundColor: C.bg0, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      {/* Back */}
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: C.text0 }}>←</Text>
      </TouchableOpacity>

      {/* Label + percentage */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <Animated.View entering={FadeIn.duration(300)}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.text2, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
            Step {current + 1} of {STEPS.length}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: C.text0 }}>
            {STEPS[current].icon}  {STEPS[current].label}
          </Text>
        </Animated.View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: C.primaryMid, letterSpacing: -1 }}>
          {pct}%
        </Text>
      </View>

      {/* Progress track */}
      <View style={{ height: 6, backgroundColor: C.bg3, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
        <Animated.View style={[{ height: 6, backgroundColor: C.primary, borderRadius: 99 }, barStyle]} />
      </View>

      {/* Tappable dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {STEPS.map((s, i) => (
          <StepDot key={i} index={i} current={current} label={s.label} onPress={() => {
            if (i < current) router.push(s.route as any);
          }} />
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
    scale.value = withSpring(0.85, {}, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!isCompleted} style={{ alignItems: 'center', gap: 4 }}>
      <Animated.View style={[{
        width: isActive ? 10 : 8,
        height: isActive ? 10 : 8,
        borderRadius: isActive ? 5 : 4,
        backgroundColor: isCompleted ? C.green : isActive ? C.primary : C.bg3,
      }, dotStyle]} />
      {isActive && (
        <Text style={{ fontSize: 8, color: C.primary, fontWeight: '700' }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}