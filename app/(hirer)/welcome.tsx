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
    uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=90',
    headline: 'Find beauty pros',
    accent: 'near you.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&q=90',
    headline: 'Book home service',
    accent: 'or walk-in.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',
    headline: 'Pay securely,',
    accent: 'every time.',
  },
  {
    uri: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=90',
    headline: 'Look your best,',
    accent: 'on your schedule.',
  },
];

export default function HirerWelcome() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
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

      {/* Full-bleed image */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width, height }, imgStyle]}>
        <Image source={{ uri: slide.uri }} style={{ width, height }} resizeMode="cover" />
      </Animated.View>

      {/* Gradient overlay */}
      <View style={{ position: 'absolute', top: height * 0.4, left: 0, right: 0, bottom: 0 }}>
        <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0.15)' }} />
        <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0.68)' }} />
        <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0.82)' }} />
        <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0.92)' }} />
      </View>

      {/* Bottom content */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28, paddingBottom: insets.bottom + 40 }}>

        {/* Slide dots — centered */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
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
            Discover top-rated beauty and grooming professionals in Lagos.
          </Text>
        </Animated.View>

        {/* Get Started */}
        <Animated.View style={btnStyle}>
          <TouchableOpacity
            onPress={() => router.replace('/(hirer)/(tabs)')}
            style={{ backgroundColor: '#fff', borderRadius: 16, height: 60,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 }, elevation: 10 }}>
            <Text style={{ color: '#0D0A14', fontWeight: '900', fontSize: 17, letterSpacing: 0.3 }}>
              Explore Providers
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}