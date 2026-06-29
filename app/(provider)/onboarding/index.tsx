import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withRepeat, withSequence,
  FadeInUp, Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    uri: 'https://images.unsplash.com/flagged/photo-1580820258381-20c91a156841?w=800&q=90',
    headline: 'Your beauty business,',
    accent: 'on your terms.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&q=90',
    headline: 'Reach thousands',
    accent: 'of clients near you.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=90',
    headline: 'Get paid directly',
    accent: 'to your bank.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=90',
    headline: 'Build your brand,',
    accent: 'grow your income.',
  },
];

export default function OnboardingWelcome() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const opacity  = useSharedValue(1);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    const t = setInterval(() => {
      opacity.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }, () => {
        opacity.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) });
      });
      setTimeout(() => setIdx(i => (i + 1) % SLIDES.length), 600);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    btnScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000 }),
        withTiming(1,    { duration: 1000 }),
      ), -1, false
    );
  }, []);

  const imgStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));
  const slide    = SLIDES[idx];

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed image — no gaps, no boxes */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width, height }, imgStyle]}>
        <Image source={{ uri: slide.uri }} style={{ width, height }} resizeMode="cover" />
      </Animated.View>

      {/* Smooth gradient — pure View opacity layers fading naturally */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none">
        {/* Top — completely transparent */}
        <View style={{ flex: 0.45, backgroundColor: 'transparent' }} />
        {/* Fade zone — gradual */}
        <View style={{ flex: 0.08, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        <View style={{ flex: 0.08, backgroundColor: 'rgba(0,0,0,0.12)' }} />
        <View style={{ flex: 0.08, backgroundColor: 'rgba(0,0,0,0.22)' }} />
        <View style={{ flex: 0.08, backgroundColor: 'rgba(0,0,0,0.35)' }} />
        <View style={{ flex: 0.08, backgroundColor: 'rgba(0,0,0,0.52)' }} />
        <View style={{ flex: 0.07, backgroundColor: 'rgba(0,0,0,0.68)' }} />
        <View style={{ flex: 0.06, backgroundColor: 'rgba(0,0,0,0.82)' }} />
        <View style={{ flex: 0.05, backgroundColor: 'rgba(0,0,0,0.92)' }} />
        <View style={{ flex: 0.05, backgroundColor: 'rgba(0,0,0,0.97)' }} />
      </View>

      {/* Bottom content */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28, paddingBottom: insets.bottom + 40 }}>

        {/* Slide dots — centered */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24,
          justifyContent: 'center', alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={{
              height: 4, borderRadius: 2,
              width: i === idx ? 24 : 6,
              backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.35)',
            }} />
          ))}
        </View>

        {/* Headline */}
        <Animated.View entering={FadeInUp.duration(400)} key={idx}>
          <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff', lineHeight: 42,
            marginBottom: 10, letterSpacing: -0.5 }}>
            {slide.headline}{'\n'}
            <Text style={{ color: '#9B6FD4' }}>{slide.accent}</Text>
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 23, marginBottom: 36 }}>
            Join thousands of Nigerian beauty professionals earning more on Staxz.
          </Text>
        </Animated.View>

        {/* Proceed */}
        <Animated.View style={btnStyle}>
          <TouchableOpacity
            onPress={() => router.replace('/(provider)/onboarding/step1')}
            style={{ backgroundColor: '#fff', borderRadius: 16, height: 60,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 }, elevation: 10 }}>
            <Text style={{ color: '#0D0A14', fontWeight: '900', fontSize: 17, letterSpacing: 0.3 }}>
              Proceed
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}