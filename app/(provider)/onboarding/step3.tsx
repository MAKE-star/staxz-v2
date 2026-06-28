import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '../../../src/store/onboarding';
import { useAuth } from '../../../src/store/auth';
import { Progress, DotBackground } from '../../../src/components/Progress';
import { C, CATS } from '../../../src/constants';
import { API_URL } from '../../../src/constants';
import { SERVICE_ICONS } from '../../../src/components/ServiceIcon';

const MIN_PHOTOS = 3;

export default function Step3() {
  const router = useRouter();
  const { data, setPhotos } = useOnboarding();
  const { token } = useAuth();
  const [photos, setLocalPhotos] = useState<Record<string, string[]>>(data.photos ?? {});
  const [uploading, setUploading] = useState<string | null>(null);

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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const newCatPhotos = [...(photos[catId] ?? []), uri];
    const newPhotos = { ...photos, [catId]: newCatPhotos };
    setLocalPhotos(newPhotos);
    setPhotos(catId, newCatPhotos);
  };

  const removePhoto = (catId: string, idx: number) => {
    Alert.alert('Remove photo?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => {
          const newCatPhotos = (photos[catId] ?? []).filter((_, i) => i !== idx);
          const newPhotos = { ...photos, [catId]: newCatPhotos };
          setLocalPhotos(newPhotos);
          setPhotos(catId, newCatPhotos);
        },
      },
    ]);
  };

  const allReady = selectedCats.length > 0
    && selectedCats.every(cat => (photos[cat.id] ?? []).length >= MIN_PHOTOS);

  const totalPhotos = Object.values(photos).reduce((sum, arr) => sum + arr.length, 0);
  const totalNeeded = selectedCats.length * MIN_PHOTOS;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg0 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <DotBackground />
      <Progress current={2} onBack={() => router.back()} />

      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text0, marginBottom: 4 }}>Portfolio Photos</Text>
        <Text style={{ fontSize: 14, color: C.text2, marginBottom: 16 }}>
          Upload at least {MIN_PHOTOS} photos per service. Photos are saved when you go live.
        </Text>

        {/* Progress banner */}
        <View style={{ backgroundColor: allReady ? C.green + '15' : C.amberLo, borderRadius: 12, padding: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: allReady ? C.green + '40' : C.amber + '40' }}>
          <Text style={{ fontSize: 20 }}>{allReady ? '✅' : '📸'}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: allReady ? C.green : C.amber, flex: 1 }}>
            {allReady
              ? 'All photos ready! Continue to next step.'
              : `${totalPhotos} of ${totalNeeded} photos — need ${MIN_PHOTOS} per category`
            }
          </Text>
        </View>

        {/* Per category */}
        {selectedCats.map(cat => {
          const catPhotos = photos[cat.id] ?? [];
          const ready = catPhotos.length >= MIN_PHOTOS;
          const iconDef = SERVICE_ICONS[cat.id];
          const Icon = iconDef?.Icon;
          const color = iconDef?.color ?? cat.color;

          return (
            <View key={cat.id} style={{ backgroundColor: C.bg1, borderRadius: 20, marginBottom: 16,
              borderWidth: 1.5, borderColor: ready ? C.green + '50' : C.border,
              overflow: 'hidden',
              shadowColor: ready ? C.green : '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>

              {/* Category header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: color + '20',
                    alignItems: 'center', justifyContent: 'center' }}>
                    {Icon && <Icon size={20} color={color} strokeWidth={1.75} />}
                  </View>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.text0 }}>{cat.label}</Text>
                    <Text style={{ fontSize: 11, color: C.text2 }}>Minimum {MIN_PHOTOS} photos</Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
                  backgroundColor: ready ? C.green + '20' : C.amberLo }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: ready ? C.green : C.amber }}>
                    {catPhotos.length}/{MIN_PHOTOS}
                  </Text>
                </View>
              </View>

              {/* Photos — horizontal scroll */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 14, gap: 10, flexDirection: 'row' }}>
                {catPhotos.map((uri, i) => (
                  <TouchableOpacity key={i} onLongPress={() => removePhoto(cat.id, i)}
                    style={{ width: 100, height: 125, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <View style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11,
                      backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✕</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.4)',
                      borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>#{i + 1}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {catPhotos.length < 10 && (
                  <TouchableOpacity onPress={() => addPhoto(cat.id)} disabled={uploading === cat.id}
                    style={{ width: 100, height: 125, borderRadius: 14, borderWidth: 2,
                      borderColor: color + '60', borderStyle: 'dashed',
                      backgroundColor: color + '08', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color + '20',
                      alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20 }}>📷</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: color, fontWeight: '800' }}>Add photo</Text>
                    <Text style={{ fontSize: 9, color: color + '80' }}>{catPhotos.length}/10</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {!ready && catPhotos.length > 0 && (
                <Text style={{ fontSize: 11, color: C.amber, marginHorizontal: 16, marginBottom: 12 }}>
                  Add {MIN_PHOTOS - catPhotos.length} more photo{MIN_PHOTOS - catPhotos.length !== 1 ? 's' : ''} to continue
                </Text>
              )}
            </View>
          );
        })}

        <Text style={{ fontSize: 11, color: C.text2, textAlign: 'center', marginBottom: 20 }}>
          Long press a photo to remove it
        </Text>

        <TouchableOpacity onPress={() => router.push('/(provider)/onboarding/step4')} disabled={!allReady}
          style={{ backgroundColor: allReady ? C.primary : C.border, borderRadius: 14, height: 54,
            alignItems: 'center', justifyContent: 'center', elevation: allReady ? 8 : 0,
            shadowColor: C.primary, shadowOpacity: allReady ? 0.4 : 0, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 16 }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}