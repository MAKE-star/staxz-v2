import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../../src/constants';

const ROLES = [
  {
    id: 'hirer',
    icon: 'account-heart-outline',
    title: "I'm a Client",
    subtitle: 'Book beauty & grooming services',
    color: '#7B4FA6',
    bullets: [
      { icon: 'map-marker-outline',   text: 'Browse providers near you' },
      { icon: 'home-outline',          text: 'Book home service or walk-in' },
      { icon: 'lock-outline',          text: 'Secure escrow payments' },
    ],
  },
  {
    id: 'provider',
    icon: 'star-outline',
    title: "I'm a Provider",
    subtitle: 'Offer beauty & grooming services',
    color: '#EC4899',
    bullets: [
      { icon: 'whatsapp',              text: 'Get bookings via WhatsApp' },
      { icon: 'bank-outline',          text: 'Paid directly to your bank' },
      { icon: 'image-multiple-outline',text: 'Build your portfolio' },
    ],
  },
];

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <StatusBar barStyle="light-content" />

      {/* Purple header */}
      <View style={{ backgroundColor: '#7B4FA6', paddingTop: insets.top + 16, paddingBottom: 36,
        paddingHorizontal: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <MCI name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EC4899',
            alignItems: 'center', justifyContent: 'center' }}>
            <MCI name="star-four-points" size={20} color="#fff" />
          </View>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, letterSpacing: 0.5 }}>STAXZ</Text>
        </View>

        <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Create Account ✨</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
          How will you use Staxz? You can switch later.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}>

        {ROLES.map((role, idx) => (
          <Animated.View key={role.id} entering={FadeInDown.delay(idx * 100).duration(400)}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/register-phone', params: { role: role.id } })}
              activeOpacity={0.9}
              style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: role.color + '30',
                padding: 22, marginBottom: 16,
                shadowColor: role.color, shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
                elevation: 4 }}>

              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: role.color + '15',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <MCI name={role.icon as any} size={28} color={role.color} />
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

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: C.border, marginBottom: 16 }} />

              {/* Bullets */}
              {role.bullets.map((b, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: i < role.bullets.length - 1 ? 12 : 0 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: role.color + '12',
                    alignItems: 'center', justifyContent: 'center' }}>
                    <MCI name={b.icon as any} size={17} color={role.color} />
                  </View>
                  <Text style={{ fontSize: 13, color: C.text1, fontWeight: '500' }}>{b.text}</Text>
                </View>
              ))}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Sign in link */}
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