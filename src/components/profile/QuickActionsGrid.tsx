import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { QuickAction } from '@/types/profile';

type QuickActionsGridProps = {
  actions: QuickAction[];
  onPress: (id: string) => void;
};

const screenWidth = Dimensions.get('window').width;
const TILE_WIDTH = (screenWidth - spacing.md * 2 - spacing.sm * 2) / 3;

export function QuickActionsGrid({ actions, onPress }: QuickActionsGridProps) {
  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => onPress(action.id)}
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={action.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={palette.hotstarBlue}
            />
          </View>
          <Text numberOfLines={1} style={styles.label}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tile: {
    width: TILE_WIDTH,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  pressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31,128,224,0.14)',
  },
  label: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
