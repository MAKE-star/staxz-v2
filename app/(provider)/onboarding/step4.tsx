import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../src/store/onboarding';
import { Progress, DotBackground } from '../../../src/components/Progress';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { C } from '../../../src/constants';
import { STATES, getAreasForState } from '../../../src/constants/locations';

export default function Step4() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [stateOpen, setStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  // Fallback structures to handle safely if data or properties are undefined
  const currentState = data?.state || '';
  const currentWhatsApp = data?.whatsapp_number || '';
  const currentArea = data?.location_text || '';
  const currentAddress = data?.full_address || '';

  const areas = currentState ? getAreasForState(currentState) : [];

  // OPTIMIZATION: Memoize the search filter so it doesn't freeze the screen on click
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return STATES;
    return STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch]);

  const whatsappValid = /^\+234[0-9]{10}$/.test(currentWhatsApp);
  
  const canContinue = 
    whatsappValid && 
    currentState !== '' && 
    currentArea.trim().length >= 3 && 
    currentAddress.trim().length >= 5;

  // Added try/catch and diagnostic alert window logic
  const handleOpenStatePicker = () => {
    try {
      setStateOpen(true);
    } catch (error: any) {
      Alert.alert(
        "UI Render Error",
        error?.message || "An unexpected error occurred while launching the state selection window."
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: C.bg0 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }} 
        keyboardShouldPersistTaps="handled"
      >
        <DotBackground />
        <Progress current={3} onBack={() => router.back()} />

        <View style={{ paddingHorizontal: 24 }}>

          {/* WhatsApp section */}
          <View style={{ backgroundColor: '#25D366' + '12', borderRadius: 20, padding: 18, marginBottom: 28, borderWidth: 1.5, borderColor: '#25D366' + '30' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#25D366' + '20', alignItems: 'center', justifyContent: 'center' }}>
                <MCI name='whatsapp' size={24} color='#25D366' />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: C.text0 }}>WhatsApp Number</Text>
                <Text style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>How clients send you enquiries</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: whatsappValid ? '#25D366' : C.border, paddingHorizontal: 14, height: 54 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: C.border }}>
                <Text style={{ fontSize: 18 }}>🇳🇬</Text>
                <Text style={{ fontSize: 13, color: C.text2, fontWeight: '600' }}>+234</Text>
              </View>
              <TextInput 
                value={currentWhatsApp} 
                onChangeText={v => update({ whatsapp_number: v })}
                keyboardType="phone-pad" 
                placeholder="08012345678" 
                maxLength={14}
                style={{ flex: 1, fontSize: 15, color: C.text0, fontWeight: '600' }} 
                placeholderTextColor={C.text2} 
              />
              {whatsappValid && <Text style={{ color: '#25D366', fontSize: 18 }}>✓</Text>}
            </View>

            <Text style={{ fontSize: 12, color: C.text2, marginTop: 10, lineHeight: 18 }}>
              When a client sends an enquiry, our bot messages you here with their details. Reply with your quote to accept.
            </Text>
          </View>

          {/* Location section */}
          <View style={{ backgroundColor: C.bg1, borderRadius: 20, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLo, alignItems: 'center', justifyContent: 'center' }}>
                <MCI name='map-marker-outline' size={24} color={C.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '800', color: C.text0 }}>Your Location</Text>
                <Text style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>Helps clients find providers near them</Text>
              </View>
            </View>

            {/* State Selection Input Field */}
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>State *</Text>
            <TouchableOpacity 
              onPress={handleOpenStatePicker}
              style={{ backgroundColor: C.bg2, borderRadius: 12, borderWidth: 1.5, borderColor: currentState ? C.primary : C.border, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
            >
              <Text style={{ fontSize: 15, color: currentState ? C.text0 : C.text2, fontWeight: currentState ? '600' : '400' }}>
                {currentState || 'Select your state'}
              </Text>
              <ChevronDown size={16} color={C.text2} />
            </TouchableOpacity>

            {/* Conditional Sub-inputs */}
            {currentState !== '' && (
              <View style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>Area / Neighbourhood *</Text>
                <TextInput 
                  value={currentArea} 
                  onChangeText={v => update({ location_text: v })}
                  placeholder="e.g. Lekki Phase 1" 
                  placeholderTextColor={C.text2}
                  style={{ backgroundColor: C.bg2, borderRadius: 12, borderWidth: 1.5, borderColor: currentArea.length >= 3 ? C.primary : C.border, paddingHorizontal: 14, height: 50, fontSize: 15, color: C.text0, marginBottom: 12 }} 
                />

                {/* Quick Pick Area Buttons */}
                {areas && areas.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.text2, marginBottom: 8 }}>Quick pick:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {areas.map(area => (
                        <TouchableOpacity 
                          key={area} 
                          onPress={() => update({ location_text: area })}
                          style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, borderWidth: 1.5, borderColor: currentArea === area ? C.primary : C.border, backgroundColor: currentArea === area ? C.primary : C.bg2 }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '700', color: currentArea === area ? '#fff' : C.text1 }}>{area}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Full Address */}
                <Text style={{ fontSize: 11, fontWeight: '800', color: C.text2, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>Full Address *</Text>
                <TextInput 
                  value={currentAddress} 
                  onChangeText={v => update({ full_address: v })}
                  placeholder="e.g. 12 Admiralty Way, Lekki Phase 1, Lagos"
                  multiline 
                  numberOfLines={2} 
                  placeholderTextColor={C.text2}
                  style={{ backgroundColor: C.bg2, borderRadius: 12, borderWidth: 1.5, borderColor: currentAddress.length >= 5 ? C.primary : C.border, padding: 14, fontSize: 14, color: C.text0, minHeight: 70, textAlignVertical: 'top' }} 
                />
                <Text style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>
                  Only revealed to clients after a confirmed booking
                </Text>
              </View>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={() => router.push('/(provider)/onboarding/step5')} 
            disabled={!canContinue}
            style={{ backgroundColor: canContinue ? C.primary : C.bg3, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', elevation: canContinue ? 10 : 0, shadowColor: C.primary, shadowOpacity: canContinue ? 0.4 : 0, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, marginBottom: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: canContinue ? '#fff' : C.text2, fontWeight: '800', fontSize: 16 }}>Continue</Text>
              <ChevronRight size={18} color={canContinue ? '#fff' : C.text2} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* State Picker Dropdown Modal */}
      <Modal visible={stateOpen} transparent animationType="slide" onRequestClose={() => setStateOpen(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} onPress={() => setStateOpen(false)} />
        <View style={{ backgroundColor: C.bg1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '75%' }}>
          <View style={{ width: 40, height: 5, backgroundColor: C.border, borderRadius: 3, alignSelf: 'center', marginBottom: 18 }} />
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.text0, marginBottom: 14 }}>Select State</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg2, borderRadius: 14, paddingHorizontal: 14, height: 48, marginBottom: 14, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
            <TextInput 
              value={stateSearch} 
              onChangeText={setStateSearch}
              placeholder="Search state..." 
              placeholderTextColor={C.text2}
              style={{ flex: 1, fontSize: 15, color: C.text0 }} 
            />
          </View>
          
          <FlatList 
            data={filteredStates} 
            keyExtractor={s => s}
            initialNumToRender={12}      
            maxToRenderPerBatch={12}      
            windowSize={5}                
            removeClippedSubviews={true}  
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => { 
                  try {
                    update({ state: item, location_text: '', full_address: '' }); 
                    setStateSearch(''); 
                    setStateOpen(false);
                  } catch (err: any) {
                    Alert.alert("Store Update Error", err?.message || "Failed to commit selected state to store.");
                  }
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: C.border, backgroundColor: item === currentState ? C.bg2 : 'transparent', borderRadius: item === currentState ? 10 : 0 }}
              >
                <Text style={{ fontSize: 15, color: item === currentState ? C.primary : C.text0, fontWeight: item === currentState ? '800' : '400' }}>{item}</Text>
                {item === currentState && <Text style={{ color: C.primary, fontWeight: '800' }}>✓</Text>}
              </TouchableOpacity>
            )} 
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}