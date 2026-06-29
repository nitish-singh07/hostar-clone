import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, spacing } from '@/theme/tokens';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

function ChipBase({ active = false, label, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

export const Chip = memo(ChipBase);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  chipActive: {
    backgroundColor: palette.hotstarBlue,
    borderColor: palette.hotstarBlue,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  labelActive: {
    color: palette.textPrimary,
  },
});
