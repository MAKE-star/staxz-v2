import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import Animated, {
  FadeIn, FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const PHOTOS = [
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=85',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=85',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=85',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=85',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=85',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=85',
];

const STATS = [
  { value: '10k+', label: 'Clients',     icon: 'account-group-outline' },
  { value: '85%',  label: 'Your cut',    icon: 'cash-multiple' },
  { value: '24h',  label: '1st booking', icon: 'lightning-bolt' },
];

const TAGS = ['Makeup Artists', 'Hair Stylists', 'Nail Techs', 'Lash Techs', 'Brow Artists', 'Spa Therapists'];

export default function OnboardingWelcome() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const pulse   = useSharedValue(1);
  const tagX    = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 950, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: 950, easing: Easing.inOut(Easing.ease) }),
      ), -1, false
    );
    tagX.value = withRepeat(
      withTiming(-(width * 1.5), { duration: 9000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const tagStyle   = useAnimatedStyle(() => ({ transform: [{ translateX: tagX.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: '#7B4FA6' }}>
      <StatusBar barStyle="light-content" backgroundColor="#7B4FA6" translucent />

      {/* Top safe area fill — solid purple so no white gap */}
      <View style={{ height: insets.top, backgroundColor: '#7B4FA6' }} />

      {/* === PHOTO MOSAIC — fills top half === */}
      <View style={{ height: height * 0.46, flexDirection: 'row', gap: 3, paddingHorizontal: 3 }}>
        <View style={{ flex: 1.1, gap: 3 }}>
          <View style={{ flex: 1.3, borderRadius: 18, overflow: 'hidden' }}>
            <Image source={{ uri: PHOTOS[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          <View style={{ flex: 0.7, borderRadius: 18, overflow: 'hidden' }}>
            <Image source={{ uri: PHOTOS[1] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
        </View>
        <View style={{ flex: 1.4, borderRadius: 18, overflow: 'hidden' }}>
          <Image source={{ uri: PHOTOS[2] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(123,79,166,0.15)' }} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flex: 0.7, borderRadius: 18, overflow: 'hidden' }}>
            <Image source={{ uri: PHOTOS[3] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          <View style={{ flex: 1.3, borderRadius: 18, overflow: 'hidden' }}>
            <Image source={{ uri: PHOTOS[4] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
        </View>
      </View>

      {/* === BOTTOM CARD — rounded top, purple → deep purple === */}
      <View style={{ flex: 1, backgroundColor: '#7B4FA6', borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingHorizontal: 26, paddingTop: 14, paddingBottom: insets.bottom + 24 }}>

        {/* Scrolling tag marquee */}
        <View style={{ overflow: 'hidden', marginBottom: 16 }}>
          <Animated.View style={[{ flexDirection: 'row', gap: 8 }, tagStyle]}>
            {[...TAGS, ...TAGS, ...TAGS].map((t, i) => (
              <View key={i} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(236,72,153,0.7)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Headline */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 34, marginBottom: 6, letterSpacing: -0.5 }}>
            Your beauty business,{'\n'}
            <Text style={{ color: '#FFADD9' }}>on your terms. ✨</Text>
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 20, marginBottom: 18 }}>
            Join thousands of Nigerian beauty professionals growing their brand on Staxz.
          </Text>
        </Animated.View>

        {/* Stats row */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)}
          style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
          {STATS.map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
              padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}>
              <MCI name={s.icon as any} size={22} color='rgba(255,255,255,0.9)' />
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff', marginTop: 4 }}>{s.value}</Text>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTAs */}
        <Animated.View entering={FadeInUp.delay(450).duration(500)} style={{ gap: 10 }}>
          <Animated.View style={pulseStyle}>
            <TouchableOpacity onPress={() => router.push('/(provider)/onboarding/step1')}
              style={{ borderRadius: 18, height: 58, alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#EC4899',
                shadowColor: '#EC4899', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
                elevation: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17, letterSpacing: 0.3 }}>
                Start your application
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={{ borderRadius: 18, height: 50, alignItems: 'center', justifyContent: 'center',
            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 15 }}>
              I already have an account
            </Text>
          </TouchableOpacity>

          <Text style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 11, marginTop: 4 }}>
            Free to join · Takes 5 minutes · Start earning today
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}