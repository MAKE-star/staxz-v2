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
    uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',
    headline: 'Your beauty business,',
    accent: 'on your terms.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=90',
    headline: 'Reach thousands',
    accent: 'of clients near you.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=90',
    headline: 'Get paid directly',
    accent: 'to your bank.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=90',
    headline: 'Build your brand,',
    accent: 'grow your income.',
  },
];

export default function OnboardingWelcome() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [idx, setIdx]       = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const opacity  = useSharedValue(1);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (idx + 1) % SLIDES.length;
      setNextIdx(next);
      opacity.value = withSequence(
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      );
      setTimeout(() => setIdx(next), 700);
    }, 4500);
    return () => clearInterval(t);
  }, [idx]);

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

  const slide = SLIDES[idx];

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed slideshow image */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width, height }, imgStyle]}>
        <Image source={{ uri: slide.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </Animated.View>

      {/* Dark gradient overlay — bottom heavy */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65 }}>
        <View style={{ flex: 0.15, backgroundColor: 'rgba(0,0,0,0.0)' }} />
        <View style={{ flex: 0.15, backgroundColor: 'rgba(0,0,0,0.25)' }} />
        <View style={{ flex: 0.2,  backgroundColor: 'rgba(0,0,0,0.5)' }} />
        <View style={{ flex: 0.2,  backgroundColor: 'rgba(0,0,0,0.72)' }} />
        <View style={{ flex: 0.3,  backgroundColor: 'rgba(0,0,0,0.88)' }} />
      </View>

      {/* Bottom content */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28, paddingBottom: insets.bottom + 36 }}>

        {/* Slide dots */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
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
          <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff', lineHeight: 42, marginBottom: 8, letterSpacing: -0.5 }}>
            {slide.headline}{'\n'}
            <Text style={{ color: '#EC4899' }}>{slide.accent}</Text>
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 23, marginBottom: 36 }}>
            Join thousands of Nigerian beauty professionals earning more on Staxz.
          </Text>
        </Animated.View>

        {/* Proceed button */}
        <Animated.View style={btnStyle}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            style={{ backgroundColor: '#fff', borderRadius: 16, height: 60,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
              elevation: 12 }}>
            <Text style={{ color: '#0D0A14', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 }}>
              Proceed
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push('/(auth)/phone')}
          style={{ marginTop: 14, alignItems: 'center', padding: 10 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Already have an account? <Text style={{ color: '#fff', fontWeight: '700' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}