import {
  Scissors, Sparkles, Heart, Star, Flower2,
  Droplets, Wind, Sun, Eye, Brush,
  HandMetal, Feather, Zap, Leaf, Waves,
  Crown, Shell, Gem, Palette,
} from 'lucide-react-native';

export const SERVICE_ICONS: Record<string, { Icon: any; color: string }> = {
  haircut:       { Icon: Scissors,  color: '#7B4FA6' },
  barbing:       { Icon: Zap,       color: '#06B6D4' },
  braids:        { Icon: Wind,      color: '#EC4899' },
  makeup:        { Icon: Brush,     color: '#F43F5E' },
  bridal_makeup: { Icon: Crown,     color: '#E11D48' },
  nails:         { Icon: Gem,       color: '#A855F7' },
  facials:       { Icon: Droplets,  color: '#14B8A6' },
  spa:           { Icon: Waves,     color: '#3B82F6' },
  lashes:        { Icon: Eye,       color: '#F97316' },
  eyebrows:      { Icon: Feather,   color: '#D97706' },
  weaves:        { Icon: Shell,     color: '#EAB308' },
  coloring:      { Icon: Palette,   color: '#22C55E' },
  relaxer:       { Icon: Sparkles,  color: '#8B5CF6' },
  natural_hair:  { Icon: Flower2,   color: '#10B981' },
  hair_treatment:{ Icon: Heart,     color: '#0EA5E9' },
  locs:          { Icon: Leaf,      color: '#16A34A' },
  pedicure:      { Icon: Sun,       color: '#F59E0B' },
  manicure:      { Icon: HandMetal, color: '#EF4444' },
  waxing:        { Icon: Star,      color: '#6366F1' },
};