import { create } from 'zustand';

interface OnboardingData {
  // Step 1
  business_name: string;
  business_type: string;
  service_modes: string[];
  base_fee: string;
  cac_number: string;
  bio: string;
  years_experience: string;
  // Step 2
  service_categories: string[];
  // Step 3 - photos stored as map { catId: [uri, uri, ...] }
  photos: Record<string, string[]>;
  // Step 4
  whatsapp_number: string;
  state: string;
  location_text: string;
  full_address: string;
  location_lat: number | undefined;
  location_lng: number | undefined;
  // Step 5
  bank_account_name: string;
  bank_account_number: string;
  bank_code: string;
}

interface OnboardingStore {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
  setPhotos: (catId: string, photos: string[]) => void;
  reset: () => void;
}

const INIT: OnboardingData = {
  business_name: '', business_type: '', service_modes: [],
  base_fee: '', cac_number: '', bio: '', years_experience: '',
  service_categories: [],
  photos: {},
  whatsapp_number: '+234', state: '', location_text: '', full_address: '',
  location_lat: undefined, location_lng: undefined,
  bank_account_name: '', bank_account_number: '', bank_code: '',
};

export const useOnboarding = create<OnboardingStore>((set) => ({
  data: INIT,
  update: (partial) => set(s => ({ data: { ...s.data, ...partial } })),
  setPhotos: (catId, photos) => set(s => ({
    data: { ...s.data, photos: { ...s.data.photos, [catId]: photos } }
  })),
  reset: () => set({ data: INIT }),
}));