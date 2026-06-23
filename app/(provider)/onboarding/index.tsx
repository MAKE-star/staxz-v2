import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { C } from '../../../src/constants';

const { width, height } = Dimensions.get('window');

const PHOTOS = [
  { uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', label: 'Makeup' },
  { uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', label: 'Salon' },
  { uri: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', label: 'Styling' },
  { uri: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', label: 'Nails' },
];

const STATS = [
  { value: '10k+', label: 'Active clients' },
  { value: '85%', label: 'Payout rate' },
  { value: '24h', label: 'First booking' },
];

export default function OnboardingWelcome() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ), -1, false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0A14' }}>
      {/* Photo collage */}
      <View style={{ flexDirection: 'row', height: height * 0.52, gap: 3 }}>
        <View style={{ flex: 1, gap: 3 }}>
          <ImageBackground source={{ uri: PHOTOS[0].uri }} style={{ flex: 1.2 }} imageStyle={{ opacity: 0.9 }} />
          <ImageBackground source={{ uri: PHOTOS[1].uri }} style={{ flex: 0.8 }} imageStyle={{ opacity: 0.9 }} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <ImageBackground source={{ uri: PHOTOS[2].uri }} style={{ flex: 0.8 }} imageStyle={{ opacity: 0.9 }} />
          <ImageBackground source={{ uri: PHOTOS[3].uri }} style={{ flex: 1.2 }} imageStyle={{ opacity: 0.9 }} />
        </View>
      </View>



      {/* Bottom content */}
      <View style={{ flex: 1, backgroundColor: '#0D0A14', paddingHorizontal: 28, paddingTop: 28, paddingBottom: 40 }}>

        {/* Brand pill */}
        <Animated.View entering={FadeIn.delay(200)} style={{ alignSelf: 'center', backgroundColor: C.primary + '30', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16, borderWidth: 1, borderColor: C.primary + '50' }}>
          <Text style={{ color: C.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 }}>STAXZ FOR PROVIDERS</Text>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(300)} style={{ fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 38, marginBottom: 10 }}>
          Your beauty business,{'\n'}
          <Text style={{ color: C.primary }}>on your terms.</Text>
        </Animated.Text>

        <Animated.Text entering={FadeInDown.delay(400)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 21, marginBottom: 28 }}>
          Join thousands of Nigerian beauty professionals earning more with Staxz.
        </Animated.Text>

        {/* Stats row */}
        <Animated.View entering={FadeInUp.delay(500)} style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          {STATS.map((s, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(600)} style={{ gap: 12 }}>
          <Animated.View style={pulseStyle}>
            <TouchableOpacity onPress={() => router.push('/(provider)/onboarding/step1')}
              style={{ backgroundColor: C.primary, borderRadius: 16, height: 58, alignItems: 'center', justifyContent: 'center', elevation: 16, shadowColor: C.primary, shadowOpacity: 0.55, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17, letterSpacing: 0.4 }}>Start your application →</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', fontSize: 12 }}>
            Takes about 5 minutes · Free to join
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}