import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { api } from '../../src/api';
import { C } from '../../src/constants';

export default function RegisterPhoneScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { role } = useLocalSearchParams<{ role: string }>();
  const inputRef = useRef<TextInput>(null);
  const [digits, setDigits]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const scale = useSharedValue(1);

  const isProvider = role === 'provider';
  const color      = isProvider ? '#9B6FD4' : C.primary;
  const phone      = '+234' + digits;
  const valid      = /^\+234[0-9]{10}$/.test(phone);

  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const submit = async () => {
    setError('');
    if (!valid) { setError('Enter a valid 10-digit Nigerian number'); return; }
    scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1); });
    setLoading(true);
    try {
      await api('/auth/request-otp', { method: 'POST', body: { phone, mode: 'signup' } });
      router.push({ pathname: '/(auth)/otp', params: { phone, mode: 'signup', role } });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg0 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={color} />

      {/* Colored header matching role */}
      <View style={{ backgroundColor: color, paddingTop: insets.top + 12, paddingBottom: 40,
        paddingHorizontal: 28, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <ChevronRight size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} strokeWidth={2.5} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {/* Role badge */}
          <TouchableOpacity onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start', marginBottom: 20 }}>
            <Text style={{ fontSize: 18 }}>{isProvider ? '💼' : '⭐'}</Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
              Signing up as {isProvider ? 'Provider' : 'Client'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>· Change</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Enter your number</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
            We'll send you a one-time code to verify.
          </Text>
        </Animated.View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 36 }}>
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>
            Phone Number
          </Text>

          <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
              borderRadius: 16, borderWidth: 2, borderColor: error ? C.red : valid ? color : C.border,
              paddingHorizontal: 16, height: 60, marginBottom: 8,
              shadowColor: color, shadowOpacity: valid ? 0.15 : 0.04, shadowRadius: 10, elevation: valid ? 4 : 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 14, marginRight: 8, borderRightWidth: 1.5, borderRightColor: C.border }}>
              <Text style={{ fontSize: 20 }}>🇳🇬</Text>
              <Text style={{ fontSize: 15, color: C.text1, fontWeight: '700' }}>+234</Text>
            </View>
            <TextInput
              ref={inputRef}
              value={digits}
              onChangeText={v => { setDigits(v.replace(/\D/g, '').slice(0, 10)); setError(''); }}
              keyboardType="number-pad"
              placeholder="8012345678"
              maxLength={10}
              autoFocus
              style={{ flex: 1, fontSize: 17, color: C.text0, fontWeight: '600' }}
              placeholderTextColor={C.text2}
            />
            {valid && <Text style={{ fontSize: 20, color: color }}>✓</Text>}
          </TouchableOpacity>

          {error
            ? <Animated.Text entering={FadeInDown.duration(250)} style={{ fontSize: 12, color: C.red, marginBottom: 16 }}>{error}</Animated.Text>
            : <View style={{ height: 16 }} />
          }

          <Animated.View style={btnStyle}>
            <TouchableOpacity onPress={submit} disabled={loading || !valid}
              style={{ backgroundColor: valid && !loading ? color : C.bg3, borderRadius: 16, height: 58,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                elevation: valid ? 10 : 0, shadowColor: color, shadowOpacity: valid ? 0.45 : 0,
                shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, marginBottom: 24 }}>
              <Text style={{ color: valid && !loading ? '#fff' : C.text2, fontWeight: '900', fontSize: 16 }}>
                {loading ? 'Sending...' : 'Get OTP'}
              </Text>
              {!loading && <ChevronRight size={18} color={valid ? '#fff' : C.text2} strokeWidth={2.5} />}
            </TouchableOpacity>
          </Animated.View>

          {isProvider && (
            <Animated.View entering={FadeInUp.delay(400).duration(400)}
              style={{ backgroundColor: '#9B6FD410', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#9B6FD425' }}>
              <Text style={{ fontSize: 13, color: C.text1, lineHeight: 20 }}>
                After verifying, you'll set up your business profile in 5 quick steps. Takes about 5 minutes.
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}