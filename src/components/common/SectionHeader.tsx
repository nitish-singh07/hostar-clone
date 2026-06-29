import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/theme/tokens';

type SectionHeaderProps = {
  title: string;
  /** Renders a chevron-forward icon that navigates to the section's collection. */
  onSeeAll?: () => void;
  /** Optional plain-text action label (e.g. 'Manage'). */
  action?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ action, onActionPress, onSeeAll, title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
          hitSlop={10}
          onPress={onSeeAll}
          style={({ pressed }) => pressed && styles.pressed}>
          <Ionicons name="chevron-forward" size={20} color={palette.textSecondary} />
        </Pressable>
      ) : action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          hitSlop={10}
          disabled={!onActionPress}
          onPress={onActionPress}
          style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '800',
  },
  action: {
    color: palette.hotstarBlue,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
