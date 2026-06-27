import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle,
  withSequence, withTiming, withSpring,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { api } from '../../src/api';
import { useAuth } from '../../src/store/auth';
import { C } from '../../src/constants';

export default function OtpScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { phone, mode, role } = useLocalSearchParams<{ phone: string; mode: string; role: string }>();
  const { setAuth } = useAuth();
  const [code, setCode]       = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [timer, setTimer]     = useState(60);
  const refs = useRef<(TextInput | null)[]>([]);
  const shakeX  = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 55 }), withTiming(10, { duration: 55 }),
      withTiming(-10, { duration: 55 }), withTiming(10, { duration: 55 }),
      withTiming(0,   { duration: 55 }),
    );
  };

  const shakeStyle  = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));
  const btnStyle    = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const onChange = (val: string, i: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code]; next[i] = val.slice(-1); setCode(next);
    setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d)) verify(next.join(''));
  };

  const verify = async (fullCode: string) => {
    setLoading(true); setError('');
    btnScale.value = withSpring(0.96, {}, () => { btnScale.value = withSpring(1); });
    try {
      const res = await api('/auth/verify-otp', { method: 'POST', body: { phone, code: fullCode, role: role || 'hirer' } });
      const me  = await api('/auth/me', { token: res.data.accessToken });
      await setAuth(res.data.accessToken, me.data);
      const userRole = me.data.role;
      const isNew    = res.data.isNewUser;
      if (isNew && userRole !== 'admin') {
        router.replace(role === 'provider' ? '/(provider)/onboarding' : '/(hirer)/(tabs)');
      } else {
        if      (userRole === 'admin')    router.replace('/(admin)/(tabs)');
        else if (userRole === 'provider') router.replace('/(provider)/(tabs)');
        else                              router.replace('/(hirer)/(tabs)');
      }
    } catch (e: any) {
      setError(e.message ?? 'Invalid code. Please try again.');
      setCode(['','','','','','']);
      refs.current[0]?.focus();
      shake();
    } finally { setLoading(false); }
  };

  const resend = async () => {
    if (timer > 0) return;
    try {
      await api('/auth/request-otp', { method: 'POST', body: { phone, mode } });
      setTimer(60); setError('');
    } catch (e: any) { setError(e.message); }
  };

  const allFilled = code.every(d => d);

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
          {/* Lock icon */}
          <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#EC4899',
            alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Text style={{ fontSize: 28 }}>🔐</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Enter OTP</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ color: '#FFADD9', fontWeight: '800' }}>{phone}</Text>
          </Text>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: 28, paddingTop: 40 }}>
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>

          {/* OTP boxes */}
          <Animated.View style={[{ flexDirection: 'row', gap: 10, marginBottom: 16 }, shakeStyle]}>
            {code.map((d, i) => (
              <TextInput key={i}
                ref={el => { refs.current[i] = el; }}
                value={d}
                onChangeText={v => onChange(v, i)}
                onKeyPress={({ nativeEvent: { key } }) => {
                  if (key === 'Backspace' && !d && i > 0) {
                    const next = [...code]; next[i-1] = ''; setCode(next);
                    refs.current[i-1]?.focus();
                  }
                }}
                keyboardType="number-pad" maxLength={1} selectTextOnFocus
                style={{ flex: 1, height: 64, borderRadius: 16, borderWidth: 2.5,
                  borderColor: error ? C.red : d ? C.primary : C.border,
                  backgroundColor: d ? C.primaryLo : '#fff',
                  fontSize: 26, fontWeight: '900', color: C.primary, textAlign: 'center',
                }}
              />
            ))}
          </Animated.View>

          {error ? (
            <Animated.View entering={FadeInDown.duration(300)}
              style={{ backgroundColor: C.redLo, borderRadius: 12, padding: 12, marginBottom: 20,
                borderWidth: 1, borderColor: C.red + '30', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16 }}>⚠️</Text>
              <Text style={{ fontSize: 13, color: C.red, flex: 1, fontWeight: '600' }}>{error}</Text>
            </Animated.View>
          ) : <View style={{ height: 20 }} />}

          {/* Verify button */}
          <Animated.View style={btnStyle}>
            <TouchableOpacity onPress={() => verify(code.join(''))} disabled={loading || !allFilled}
              style={{ backgroundColor: allFilled && !loading ? C.primary : C.bg3, borderRadius: 16, height: 58,
                alignItems: 'center', justifyContent: 'center',
                elevation: allFilled ? 10 : 0, shadowColor: C.primary, shadowOpacity: allFilled ? 0.45 : 0,
                shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, marginBottom: 24 }}>
              <Text style={{ color: allFilled && !loading ? '#fff' : C.text2, fontWeight: '900', fontSize: 16 }}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Resend */}
          <TouchableOpacity onPress={resend} disabled={timer > 0} style={{ alignItems: 'center', padding: 12 }}>
            {timer > 0
              ? <Text style={{ fontSize: 14, color: C.text2 }}>
                  Resend code in <Text style={{ fontWeight: '800', color: C.primary }}>{timer}s</Text>
                </Text>
              : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 16 }}>🔄</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#EC4899' }}>Resend OTP</Text>
                </View>
            }
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}