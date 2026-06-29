import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/theme/tokens';

type RecentSearchesProps = {
  items: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
};

function RecentSearchesBase({ items, onClearAll, onRemove, onSelect }: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onClearAll}>
          <Text style={styles.clearAll}>Clear All</Text>
        </Pressable>
      </View>

      {items.map((term) => (
        <Pressable
          key={term}
          accessibilityRole="button"
          accessibilityLabel={`Search ${term}`}
          onPress={() => onSelect(term)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <Ionicons name="time-outline" size={18} color={palette.textMuted} />
          <Text numberOfLines={1} style={styles.term}>
            {term}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${term}`}
            hitSlop={10}
            onPress={() => onRemove(term)}>
            <Ionicons name="close" size={18} color={palette.textMuted} />
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}

export const RecentSearches = memo(RecentSearchesBase);

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '800',
  },
  clearAll: {
    color: palette.hotstarBlue,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    backgroundColor: palette.backgroundSecondary,
  },
  term: {
    flex: 1,
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
