import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../src/store/onboarding';
import { Progress, DotBackground } from '../../../src/components/Progress';
import { C, CATS } from '../../../src/constants';
import { ChevronRight } from 'lucide-react-native';
import { SERVICE_ICONS } from '../../../src/components/ServiceIcon';

const POPULAR = ['haircut', 'braids', 'makeup', 'nails', 'lashes'];

export default function Step2() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const toggle = (id: string) => {
    const cats = data.service_categories.includes(id)
      ? data.service_categories.filter(c => c !== id)
      : [...data.service_categories, id];
    update({ service_categories: cats });
  };

  const selected = data.service_categories;
  const popularCats = CATS.filter(c => POPULAR.includes(c.id));
  const otherCats   = CATS.filter(c => !POPULAR.includes(c.id));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg0 }} contentContainerStyle={{ paddingBottom: 48 }}>
      <DotBackground />
        <Progress current={1} onBack={() => router.back()} />

      {/* Floating selection pill */}
      {selected.length > 0 && (
        <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
          <View style={{ backgroundColor: C.primary, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
              {selected.length} selected
            </Text>
          </View>
        </View>
      )}

      <View style={{ paddingHorizontal: 24, paddingTop: selected.length > 0 ? 12 : 0 }}>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 24, lineHeight: 20 }}>
          Select all services you offer. Clients filter by these — pick every category that fits.
        </Text>

        <SectionTitle text="Most popular" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          {popularCats.map(cat => (
            <CatCard key={cat.id} cat={cat} selected={selected.includes(cat.id)} onPress={() => toggle(cat.id)} />
          ))}
        </View>

        <SectionTitle text="All services" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
          {otherCats.map(cat => (
            <CatCard key={cat.id} cat={cat} selected={selected.includes(cat.id)} onPress={() => toggle(cat.id)} />
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/(provider)/onboarding/step3')}
          disabled={selected.length === 0}
          style={{ backgroundColor: selected.length > 0 ? C.primary : C.bg3, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', elevation: selected.length > 0 ? 10 : 0, shadowColor: C.primary, shadowOpacity: selected.length > 0 ? 0.4 : 0, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text style={{ color: selected.length > 0 ? '#fff' : C.text2, fontWeight: '800', fontSize: 16 }}>{selected.length === 0 ? 'Select at least one service' : `Continue with ${selected.length} service${selected.length > 1 ? 's' : ''}`}</Text>{selected.length > 0 && <ChevronRight size={18} color='#fff' strokeWidth={2.5} />}</View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: C.text2, textTransform: 'uppercase', letterSpacing: 0.8 }}>{text}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
    </View>
  );
}

function CatCard({ cat, selected, onPress }: { cat: any; selected: boolean; onPress: () => void }) {
  const iconDef = SERVICE_ICONS[cat.id];
  const color = iconDef?.color ?? cat.color;
  const Icon = iconDef?.Icon;
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.88, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    onPress();
  };

  return (
    <Animated.View style={[{ width: '47%' }, animStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}
        style={{ padding: 16, borderRadius: 16, borderWidth: 2, borderColor: selected ? color : C.border, backgroundColor: selected ? color + '12' : C.bg1, position: 'relative' }}>

        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: selected ? color + '25' : color + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          {Icon && <Icon size={22} color={color} strokeWidth={1.75} />}
        </View>

        <Text style={{ fontSize: 13, fontWeight: '800', color: selected ? color : C.text0, lineHeight: 17 }}>
          {cat.label}
        </Text>

        {selected && (
          <View style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}