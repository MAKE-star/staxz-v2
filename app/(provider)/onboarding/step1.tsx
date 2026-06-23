import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../src/store/onboarding';
import { Progress } from '../../../src/components/Progress';
import { api } from '../../../src/api';
import { useAuth } from '../../../src/store/auth';
import { C } from '../../../src/constants';

type CACStatus = 'idle' | 'checking' | 'verified' | 'failed';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', // salon interior
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', // makeup artist
];

export default function Step1() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const { token } = useAuth();
  const [cacStatus, setCacStatus] = useState<CACStatus>('idle');
  const [cacError, setCacError]   = useState('');
  const [cacName, setCacName]     = useState('');

  const toggleMode = (id: string) => {
    const modes = data.service_modes.includes(id)
      ? data.service_modes.filter(m => m !== id)
      : [...data.service_modes, id];
    update({ service_modes: modes });
  };

  const cacFormatValid = /^(RC|BN|IT|LP|LLP)-?\d{5,9}$/i.test(data.cac_number.trim());

  const verifyCac = async () => {
    if (!cacFormatValid || !data.business_name.trim()) {
      Alert.alert('Required', 'Enter your business name and CAC number first.');
      return;
    }
    setCacStatus('checking'); setCacError(''); setCacName('');
    try {
      const res = await api('/cac/verify', {
        method: 'POST', token,
        body: { cac_number: data.cac_number.trim(), business_name: data.business_name.trim() },
      });
      setCacStatus('verified');
      setCacName(res.data?.registeredName ?? '');
      update({ cac_verified: true } as any);
    } catch (e: any) {
      setCacStatus('failed');
      setCacError(e.message ?? 'CAC verification failed');
      update({ cac_verified: false } as any);
    }
  };

  const canContinue = data.business_name.trim().length >= 2
    && data.business_type !== ''
    && cacStatus === 'verified'
    && data.service_modes.length > 0
    && data.base_fee !== '';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1, backgroundColor: C.bg0 }} contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Progress current={0} onBack={() => router.back()} />

        {/* Hero image strip */}
        <View style={{ marginHorizontal: 24, marginBottom: 24, borderRadius: 20, overflow: 'hidden', height: 140 }}>
          <ImageBackground
            source={{ uri: HERO_IMAGES[0] }}
            style={{ flex: 1, justifyContent: 'flex-end' }}
            imageStyle={{ borderRadius: 20 }}>
            <View style={{ padding: 16, backgroundColor: 'rgba(0,0,0,0.35)', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 2 }}>Launch your beauty business</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Connect with thousands of clients in your area</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{ paddingHorizontal: 24 }}>

          {/* Business Type */}
          <Label text="Business Type" />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            {[
              { id: 'salon', label: 'Salon / Shop', emoji: '🏢', sub: 'Fixed location' },
              { id: 'independent', label: 'Independent', emoji: '💼', sub: 'Solo provider' },
            ].map(r => (
              <TouchableOpacity key={r.id} onPress={() => update({ business_type: r.id })}
                style={{ flex: 1, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: data.business_type === r.id ? C.primary : C.border, backgroundColor: data.business_type === r.id ? C.primaryLo : C.bg1 }}>
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{r.emoji}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: data.business_type === r.id ? C.primary : C.text0 }}>{r.label}</Text>
                <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{r.sub}</Text>
                {data.business_type === r.id && (
                  <View style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Business Name */}
          <Label text="Business Name" />
          <StyledInput
            value={data.business_name}
            onChangeText={v => { update({ business_name: v }); setCacStatus('idle'); setCacName(''); }}
            placeholder="e.g. Supreme Cuts"
            maxLength={120}
          />
          <Gap />

          {/* CAC */}
          <Label text="CAC Registration Number *" />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
            <TextInput value={data.cac_number}
              onChangeText={v => { update({ cac_number: v }); setCacStatus('idle'); setCacName(''); }}
              placeholder="RC-0000000 or BN-0000000"
              autoCapitalize="characters" maxLength={15}
              style={{ flex: 1, backgroundColor: C.bg1, borderRadius: 14, borderWidth: 1.5,
                borderColor: cacStatus === 'verified' ? C.green : cacStatus === 'failed' ? C.red : cacFormatValid ? C.primary : C.border,
                paddingHorizontal: 16, height: 52, fontSize: 15, color: C.text0 }} />
            <TouchableOpacity onPress={verifyCac}
              disabled={!cacFormatValid || !data.business_name.trim() || cacStatus === 'checking'}
              style={{ backgroundColor: cacStatus === 'verified' ? C.green : (!cacFormatValid || !data.business_name.trim()) ? C.bg3 : C.primary,
                borderRadius: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', minWidth: 86 }}>
              {cacStatus === 'checking'
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={{ color: cacStatus === 'verified' ? '#fff' : (!cacFormatValid || !data.business_name.trim()) ? C.text2 : '#fff', fontWeight: '800', fontSize: 13 }}>
                    {cacStatus === 'verified' ? '✓ Done' : 'Verify'}
                  </Text>
              }
            </TouchableOpacity>
          </View>

          {cacStatus === 'verified' && (
            <StatusBadge color={C.green} icon="✅" title="CAC Verified" sub={cacName ? `Registered as: ${cacName}` : undefined} />
          )}
          {cacStatus === 'failed' && (
            <StatusBadge color={C.red} icon="❌" title={cacError} sub="Contact support if your business is registered but verification fails." />
          )}
          {cacStatus === 'idle' && (
            <Text style={{ fontSize: 12, color: C.text2, marginBottom: 20 }}>Verifies your legal accountability on the platform.</Text>
          )}

          {/* Service Mode */}
          <Label text="How do you work?" />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            {[
              { id: 'home',   emoji: '🏠', label: 'Home Service',  sub: 'You travel to client' },
              { id: 'walkin', emoji: '🪑', label: 'Walk-In Only',  sub: 'Client comes to you' },
            ].map(m => (
              <TouchableOpacity key={m.id} onPress={() => toggleMode(m.id)}
                style={{ flex: 1, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: data.service_modes.includes(m.id) ? C.primary : C.border, backgroundColor: data.service_modes.includes(m.id) ? C.primaryLo : C.bg1 }}>
                <Text style={{ fontSize: 26, marginBottom: 6 }}>{m.emoji}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: data.service_modes.includes(m.id) ? C.primary : C.text0 }}>{m.label}</Text>
                <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{m.sub}</Text>
                {data.service_modes.includes(m.id) && (
                  <View style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Base Fee */}
          <Label text="Starting Price (₦)" />
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg1, borderRadius: 14, borderWidth: 1.5, borderColor: data.base_fee ? C.primary : C.border, paddingHorizontal: 16, height: 54, marginBottom: 4 }}>
            <View style={{ backgroundColor: C.primaryLo, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 }}>
              <Text style={{ fontSize: 15, color: C.primary, fontWeight: '800' }}>₦</Text>
            </View>
            <TextInput value={data.base_fee} onChangeText={v => update({ base_fee: v.replace(/[^0-9]/g, '') })}
              placeholder="e.g. 5000" keyboardType="number-pad"
              style={{ flex: 1, fontSize: 16, color: C.text0, fontWeight: '700' }} placeholderTextColor={C.text2} />
            {data.base_fee ? <Text style={{ fontSize: 13, color: C.text2 }}>naira</Text> : null}
          </View>
          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 24 }}>Minimum starting price. You can quote higher per job.</Text>

          {/* Bio */}
          <Label text="Bio" optional />
          <TextInput value={data.bio} onChangeText={v => update({ bio: v })}
            placeholder="Tell clients what makes you special — your signature style, years of experience, specialties..." 
            multiline numberOfLines={4} maxLength={300}
            style={{ backgroundColor: C.bg1, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, fontSize: 14, color: C.text0, marginBottom: 4, minHeight: 96, textAlignVertical: 'top', lineHeight: 20 }} />
          <Text style={{ fontSize: 11, color: C.text2, marginBottom: 32, textAlign: 'right' }}>{data.bio.length}/300</Text>

          {!canContinue && cacStatus !== 'verified' && (
            <View style={{ backgroundColor: C.amberLo, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: C.amber + '40', flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.amber }}>CAC verification required</Text>
                <Text style={{ fontSize: 12, color: C.text1, marginTop: 3 }}>Enter your CAC number above and tap "Verify" to continue.</Text>
              </View>
            </View>
          )}

          <ContinueButton active={canContinue} onPress={() => router.push('/(provider)/onboarding/step2')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>
      {text}{optional ? <Text style={{ fontWeight: '400', textTransform: 'none' }}> (optional)</Text> : ''}
    </Text>
  );
}

function StyledInput({ value, onChangeText, placeholder, maxLength }: any) {
  return (
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} maxLength={maxLength}
      placeholderTextColor={C.text2}
      style={{ backgroundColor: C.bg1, borderRadius: 14, borderWidth: 1.5, borderColor: value?.length >= 2 ? C.primary : C.border, paddingHorizontal: 16, height: 52, fontSize: 15, color: C.text0 }} />
  );
}

function Gap() { return <View style={{ height: 20 }} />; }

function StatusBadge({ color, icon, title, sub }: { color: string; icon: string; title: string; sub?: string }) {
  return (
    <View style={{ backgroundColor: color + '15', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: color + '40', flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 12, color: C.text1, marginTop: 3 }}>{sub}</Text> : null}
      </View>
    </View>
  );
}

function ContinueButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!active}
      style={{ backgroundColor: active ? C.primary : C.bg3, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', elevation: active ? 10 : 0, shadowColor: C.primary, shadowOpacity: active ? 0.4 : 0, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}>
      <Text style={{ color: active ? '#fff' : C.text2, fontWeight: '800', fontSize: 16, letterSpacing: 0.3 }}>Continue →</Text>
    </TouchableOpacity>
  );
}