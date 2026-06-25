import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '../../../src/store/onboarding';
import { Progress, DotBackground } from '../../../src/components/Progress';
import { ChevronRight } from 'lucide-react-native';
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { C, CATS } from '../../../src/constants';
import { SERVICE_ICONS } from '../../../src/components/ServiceIcon';

const MIN_PHOTOS = 3;

export default function Step3() {
  const router = useRouter();
  const { data, setPhotos } = useOnboarding();
  const [photos, setLocalPhotos] = useState<Record<string, string[]>>(data.photos ?? {});

  const selectedCats = CATS.filter(c => data.service_categories.includes(c.id));

  const addPhoto = async (catId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    const updated = [...(photos[catId] ?? []), uri];
    const newPhotos = { ...photos, [catId]: updated };
    setLocalPhotos(newPhotos);
    setPhotos(catId, updated);
  };

  const removePhoto = (catId: string, idx: number) => {
    Alert.alert('Remove photo?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        const updated = (photos[catId] ?? []).filter((_, i) => i !== idx);
        const newPhotos = { ...photos, [catId]: updated };
        setLocalPhotos(newPhotos);
        setPhotos(catId, updated);
      }},
    ]);
  };

  const allReady = selectedCats.length > 0 && selectedCats.every(cat => (photos[cat.id] ?? []).length >= MIN_PHOTOS);
  const totalPhotos = Object.values(photos).reduce((sum, arr) => sum + arr.length, 0);
  const totalNeeded = selectedCats.length * MIN_PHOTOS;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg0 }} contentContainerStyle={{ paddingBottom: 48 }}>
      <DotBackground />
        <Progress current={2} onBack={() => router.back()} />

      <View style={{ paddingHorizontal: 24 }}>

        {/* Progress bar for photos */}
        <View style={{ backgroundColor: C.bg2, borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: C.text0 }}>
              {allReady ? '✨ Looking great!' : `${totalPhotos} of ${totalNeeded} photos`}
            </Text>
            <Text style={{ fontSize: 12, color: allReady ? C.green : C.text2, fontWeight: '700' }}>
              {allReady ? 'All done' : `${totalNeeded - totalPhotos} to go`}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: C.bg3, borderRadius: 99, overflow: 'hidden' }}>
            <View style={{ height: 8, width: `${Math.min(100, (totalPhotos / Math.max(totalNeeded, 1)) * 100)}%`, backgroundColor: allReady ? C.green : C.primary, borderRadius: 99 }} />
          </View>
          <Text style={{ fontSize: 11, color: C.text2, marginTop: 8 }}>
            Great photos get 3× more bookings. Show your real work — no filters needed.
          </Text>
        </View>

        {selectedCats.map(cat => {
          const catPhotos = photos[cat.id] ?? [];
          const ready = catPhotos.length >= MIN_PHOTOS;
          return (
            <View key={cat.id} style={{ marginBottom: 20, backgroundColor: C.bg1, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: ready ? C.green + '60' : C.border }}>
              {/* Category header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {(() => { const iconDef = SERVICE_ICONS[cat.id]; const Icon = iconDef?.Icon; const color = iconDef?.color ?? cat.color; return (
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: color + '20', alignItems: 'center', justifyContent: 'center' }}>
                    {Icon && <Icon size={20} color={color} strokeWidth={1.75} />}
                  </View>); })()}
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: C.text0 }}>{cat.label}</Text>
                    <Text style={{ fontSize: 11, color: C.text2 }}>Minimum {MIN_PHOTOS} photos</Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: ready ? C.green + '20' : C.amberLo }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: ready ? C.green : C.amber }}>
                    {catPhotos.length}/{MIN_PHOTOS}
                  </Text>
                </View>
              </View>

              {/* Photo carousel */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 14, gap: 8, flexDirection: 'row' }}>
                {catPhotos.map((uri, i) => (
                  <TouchableOpacity key={i} onLongPress={() => removePhoto(cat.id, i)} style={{ width: 110, height: 138, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.08)' }} />
                    <View style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✕</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>#{i + 1}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {catPhotos.length < 10 && (
                  <TouchableOpacity onPress={() => addPhoto(cat.id)}
                    style={{ width: 110, height: 138, borderRadius: 14, borderWidth: 2, borderColor: cat.color + '60', borderStyle: 'dashed', backgroundColor: cat.color + '08', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: cat.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                      <MCI name='camera-plus-outline' size={26} color={cat.color} />
                    </View>
                    <Text style={{ fontSize: 11, color: cat.color, fontWeight: '800' }}>Add photo</Text>
                    <Text style={{ fontSize: 9, color: cat.color + '80' }}>{catPhotos.length}/10</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          );
        })}

        <Text style={{ fontSize: 11, color: C.text2, textAlign: 'center', marginBottom: 20 }}>Long press any photo to remove it</Text>

        <TouchableOpacity onPress={() => router.push('/(provider)/onboarding/step4')} disabled={!allReady}
          style={{ backgroundColor: allReady ? C.primary : C.bg3, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', elevation: allReady ? 10 : 0, shadowColor: C.primary, shadowOpacity: allReady ? 0.4 : 0, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text style={{ color: allReady ? '#fff' : C.text2, fontWeight: '800', fontSize: 16 }}>Continue</Text><ChevronRight size={18} color={allReady ? '#fff' : C.text2} strokeWidth={2.5} /></View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}