import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import type { Season } from '@/types/content';
import { palette, spacing } from '@/theme/tokens';

interface SeasonPickerProps {
  seasons: Season[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** Horizontal pill selector for series seasons. */
export function SeasonPicker({ seasons, activeIndex, onSelect }: SeasonPickerProps) {
  if (seasons.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {seasons.map((season, index) => {
        const active = index === activeIndex;
        return (
          <Pressable
            key={season.id}
            onPress={() => onSelect(index)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{season.title}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  pillActive: { backgroundColor: palette.hotstarBlue, borderColor: palette.hotstarBlue },
  label: { color: palette.textSecondary, fontSize: 13, fontWeight: '700' },
  labelActive: { color: palette.textPrimary, fontWeight: '800' },
});
