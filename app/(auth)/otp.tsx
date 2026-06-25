import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
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
  const shakeX = useSharedValue(0);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
      withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
      withTiming(0,  { duration: 60 }),
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const onChange = (val: string, i: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code]; next[i] = val.slice(-1); setCode(next);
    setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d)) verify(next.join(''));
  };

  const verify = async (fullCode: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/verify-otp', { method: 'POST', body: { phone, code: fullCode, role: role || 'hirer' } });
      const me = await api('/auth/me', { token: res.data.accessToken });
      await setAuth(res.data.accessToken, me.data);
      const userRole = me.data.role;
      const isNew    = res.data.isNewUser;

      if (isNew && userRole !== 'admin') {
        if (role === 'provider') router.replace('/(provider)/onboarding');
        else router.replace('/(hirer)/(tabs)');
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
      setTimer(60);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const allFilled = code.every(d => d);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <StatusBar barStyle="light-content" />

      {/* Purple header */}
      <View style={{ backgroundColor: '#7B4FA6', paddingTop: insets.top + 16, paddingBottom: 36, paddingHorizontal: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <MCI name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <MCI name="message-lock-outline" size={26} color="#fff" />
        </View>

        <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Enter OTP</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
          We sent a 6-digit code to{'\n'}
          <Text style={{ color: '#FFADD9', fontWeight: '700' }}>{phone}</Text>
        </Text>
      </View>

      <View style={{ paddingHorizontal: 28, paddingTop: 40 }}>

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
                borderColor: error ? C.red : d ? '#EC4899' : C.border,
                backgroundColor: d ? '#EC489910' : '#fff',
                fontSize: 26, fontWeight: '900', color: '#7B4FA6', textAlign: 'center',
              }}
            />
          ))}
        </Animated.View>

        {error ? (
          <Animated.View entering={FadeInDown.duration(300)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, backgroundColor: C.redLo, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.red + '30' }}>
            <MCI name="alert-circle-outline" size={16} color={C.red} />
            <Text style={{ fontSize: 13, color: C.red, flex: 1, fontWeight: '600' }}>{error}</Text>
          </Animated.View>
        ) : <View style={{ height: 20 }} />}

        {/* Verify */}
        <TouchableOpacity onPress={() => verify(code.join(''))} disabled={loading || !allFilled}
          style={{ backgroundColor: allFilled && !loading ? '#7B4FA6' : C.bg3, borderRadius: 16, height: 58,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
            elevation: allFilled ? 8 : 0, shadowColor: '#7B4FA6', shadowOpacity: allFilled ? 0.4 : 0,
            shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, marginBottom: 24 }}>
          {loading
            ? <MCI name="loading" size={22} color="#fff" />
            : <Text style={{ color: allFilled ? '#fff' : C.text2, fontWeight: '800', fontSize: 16 }}>
                Verify Code
              </Text>
          }
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity onPress={resend} disabled={timer > 0} style={{ alignItems: 'center', padding: 12 }}>
          {timer > 0
            ? <Text style={{ fontSize: 14, color: C.text2 }}>
                Resend code in <Text style={{ fontWeight: '700', color: '#7B4FA6' }}>{timer}s</Text>
              </Text>
            : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MCI name="refresh" size={16} color="#EC4899" />
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#EC4899' }}>Resend OTP</Text>
              </View>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}