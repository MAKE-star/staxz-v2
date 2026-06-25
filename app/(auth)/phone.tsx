import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { ChevronRight } from 'lucide-react-native';
import { api } from '../../src/api';
import { C } from '../../src/constants';

export default function SignInScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [phone, setPhone]     = useState('+234');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const submit = async () => {
    setError('');
    if (!/^\+234[0-9]{10}$/.test(phone)) {
      setError('Enter a valid Nigerian number: +234XXXXXXXXXX');
      return;
    }
    setLoading(true);
    try {
      await api('/auth/request-otp', { method: 'POST', body: { phone, mode: 'signin' } });
      router.push({ pathname: '/(auth)/otp', params: { phone, mode: 'signin' } });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally { setLoading(false); }
  };

  const valid = /^\+234[0-9]{10}$/.test(phone);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: C.bg0, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled">

        {/* Header strip */}
        <View style={{ backgroundColor: '#7B4FA6', paddingTop: insets.top + 16, paddingBottom: 32, paddingHorizontal: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <TouchableOpacity onPress={() => router.back()}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <MCI name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Logo mark */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center' }}>
              <MCI name="star-four-points" size={20} color="#fff" />
            </View>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, letterSpacing: 0.5 }}>STAXZ</Text>
          </View>

          <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 6 }}>Welcome back 👋</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 21 }}>
            Enter your number and we'll send you a one-time code.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 28, paddingTop: 36 }}>

          {/* Phone input */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Phone Number</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
            borderRadius: 16, borderWidth: 2, borderColor: error ? C.red : valid ? '#EC4899' : C.border,
            paddingHorizontal: 16, height: 58, marginBottom: 8,
            shadowColor: valid ? '#EC4899' : '#000', shadowOpacity: valid ? 0.12 : 0.04,
            shadowRadius: 8, elevation: valid ? 4 : 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 12, marginRight: 4, borderRightWidth: 1.5, borderRightColor: C.border }}>
              <MCI name="flag" size={18} color="#4CAF82" />
              <Text style={{ fontSize: 14, color: C.text1, fontWeight: '700' }}>+234</Text>
            </View>
            <TextInput value={phone} onChangeText={t => { setPhone(t); setError(''); }}
              keyboardType="phone-pad" placeholder="08012345678" maxLength={14} autoFocus
              style={{ flex: 1, fontSize: 16, color: C.text0, fontWeight: '600' }}
              placeholderTextColor={C.text2} />
            {valid && <MCI name="check-circle" size={20} color="#EC4899" />}
          </View>

          {error ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <MCI name="alert-circle-outline" size={14} color={C.red} />
              <Text style={{ fontSize: 12, color: C.red, flex: 1 }}>{error}</Text>
            </View>
          ) : <View style={{ height: 20 }} />}

          {/* Not registered hint */}
          {error?.includes('sign up') && (
            <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}
              style={{ backgroundColor: '#EC489915', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#EC489930', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MCI name="account-plus-outline" size={20} color="#EC4899" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#EC4899' }}>Create an account instead</Text>
                <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Tap here to sign up</Text>
              </View>
              <ChevronRight size={16} color="#EC4899" />
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity onPress={submit} disabled={loading || !valid}
            style={{ backgroundColor: valid && !loading ? '#7B4FA6' : C.bg3, borderRadius: 16, height: 58,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
              elevation: valid ? 8 : 0, shadowColor: '#7B4FA6', shadowOpacity: valid ? 0.4 : 0,
              shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, marginBottom: 28 }}>
            {loading
              ? <MCI name="loading" size={22} color="#fff" />
              : <>
                  <Text style={{ color: valid ? '#fff' : C.text2, fontWeight: '800', fontSize: 16 }}>Send Code</Text>
                  <ChevronRight size={18} color={valid ? '#fff' : C.text2} strokeWidth={2.5} />
                </>
            }
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: C.text1 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#EC4899' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}