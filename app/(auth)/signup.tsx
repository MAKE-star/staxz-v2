import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { C } from '../../src/constants';

const ROLES = [
  {
    id: 'hirer',
    emoji: '⭐',
    title: "I'm a Client",
    subtitle: 'Book beauty & grooming services',
    color: C.primary,
    bullets: [
      { emoji: '📍', text: 'Browse providers near you' },
      { emoji: '🏠', text: 'Book home service or walk-in' },
      { emoji: '🔒', text: 'Secure escrow payments' },
    ],
  },
  {
    id: 'provider',
    emoji: '💼',
    title: "I'm a Provider",
    subtitle: 'Offer beauty & grooming services',
    color: '#EC4899',
    bullets: [
      { emoji: '💬', text: 'Get bookings via WhatsApp' },
      { emoji: '🏦', text: 'Paid directly to your bank' },
      { emoji: '📸', text: 'Build your portfolio' },
    ],
  },
];

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Purple header */}
      <View style={{ backgroundColor: C.primary, paddingTop: insets.top + 12, paddingBottom: 40,
        paddingHorizontal: 28, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <ChevronRight size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} strokeWidth={2.5} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#EC4899',
              alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22 }}>✦</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 24, letterSpacing: 1 }}>STAXZ</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Create Account ✨</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
            How will you use Staxz? You can switch later.
          </Text>
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}>

        {ROLES.map((role, idx) => (
          <Animated.View key={role.id} entering={FadeInUp.delay(200 + idx * 120).duration(450)}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(auth)/register-phone', params: { role: role.id } })}
              activeOpacity={0.85}
              style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: role.color + '25',
                padding: 22, marginBottom: 16,
                shadowColor: role.color, shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
                elevation: 4 }}>

              {/* Header row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: role.color + '15',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 28 }}>{role.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.text0 }}>{role.title}</Text>
                  <Text style={{ fontSize: 13, color: C.text2, marginTop: 3 }}>{role.subtitle}</Text>
                </View>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: role.color,
                  alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: C.border, marginBottom: 16 }} />

              {role.bullets.map((b, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12,
                  marginBottom: i < role.bullets.length - 1 ? 12 : 0 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: role.color + '12',
                    alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16 }}>{b.emoji}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: C.text1, fontWeight: '500' }}>{b.text}</Text>
                </View>
              ))}
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 14, color: C.text1 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/phone')}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#EC4899' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}