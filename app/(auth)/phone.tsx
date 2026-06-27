import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { api } from '../../src/api';
import { C } from '../../src/constants';

export default function SignInScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  // Store only the digits after +234
  const [digits, setDigits]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const scale = useSharedValue(1);

  const phone = '+234' + digits;
  const valid = /^\+234[0-9]{10}$/.test(phone);

  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const submit = async () => {
    setError('');
    if (!valid) { setError('Enter a valid 10-digit Nigerian number'); return; }
    scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1); });
    setLoading(true);
    try {
      await api('/auth/request-otp', { method: 'POST', body: { phone, mode: 'signin' } });
      router.push({ pathname: '/(auth)/otp', params: { phone, mode: 'signin' } });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg0 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Purple header */}
      <View style={{ backgroundColor: C.primary, paddingTop: insets.top + 12, paddingBottom: 40, paddingHorizontal: 28, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <ChevronRight size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} strokeWidth={2.5} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22 }}>✦</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 24, letterSpacing: 1 }}>STAXZ</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 6, lineHeight: 34 }}>Welcome back</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
            Enter your number and we'll send you a one-time code.
          </Text>
        </Animated.View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 36 }}>
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Phone Number</Text>

          {/* Input — flag prefix + digits only */}
          <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
              borderRadius: 16, borderWidth: 2, borderColor: error ? C.red : valid ? C.primary : C.border,
              paddingHorizontal: 16, height: 60, marginBottom: 8,
              shadowColor: C.primary, shadowOpacity: valid ? 0.15 : 0.04, shadowRadius: 10, elevation: valid ? 4 : 1 }}>
            {/* Flag + prefix — non-editable */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 14, marginRight: 8, borderRightWidth: 1.5, borderRightColor: C.border }}>
              <Text style={{ fontSize: 20 }}>🇳🇬</Text>
              <Text style={{ fontSize: 15, color: C.text1, fontWeight: '700' }}>+234</Text>
            </View>
            {/* Only digits typed here */}
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
            {valid && <Text style={{ fontSize: 20 }}>✓</Text>}
          </TouchableOpacity>

          {error ? (
            <Animated.Text entering={FadeInDown.duration(250)} style={{ fontSize: 12, color: C.red, marginBottom: 16, marginTop: 4 }}>
              {error}
            </Animated.Text>
          ) : <View style={{ height: 16 }} />}

          {/* Signup shortcut on "not found" error */}
          {error?.toLowerCase().includes('sign up') && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}
                style={{ backgroundColor: '#EC489912', borderRadius: 14, padding: 14, marginBottom: 16,
                  borderWidth: 1.5, borderColor: '#EC489930', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 20 }}>👋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#EC4899' }}>New here? Create an account</Text>
                  <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Tap to sign up instead</Text>
                </View>
                <ChevronRight size={16} color="#EC4899" strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View style={btnStyle}>
            <TouchableOpacity onPress={submit} disabled={loading || !valid}
              style={{ backgroundColor: valid && !loading ? C.primary : C.bg3, borderRadius: 16, height: 58,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                elevation: valid ? 10 : 0, shadowColor: C.primary, shadowOpacity: valid ? 0.45 : 0,
                shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, marginBottom: 28 }}>
              <Text style={{ color: valid && !loading ? '#fff' : C.text2, fontWeight: '900', fontSize: 16 }}>
                {loading ? 'Sending...' : 'Send Code'}
              </Text>
              {!loading && <ChevronRight size={18} color={valid ? '#fff' : C.text2} strokeWidth={2.5} />}
            </TouchableOpacity>
          </Animated.View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: C.text1 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#EC4899' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}