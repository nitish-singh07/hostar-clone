import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';

export type MyList = {
  id: string;
  label: string;
  icon: string;
  count: number;
};

type MyListsRowProps = {
  lists: MyList[];
  onPress: (id: string) => void;
};

export function MyListsRow({ lists, onPress }: MyListsRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {lists.map((list) => (
        <Pressable
          key={list.id}
          accessibilityRole="button"
          accessibilityLabel={`${list.label}, ${list.count} items`}
          onPress={() => onPress(list.id)}
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={list.icon as keyof typeof Ionicons.glyphMap}
              size={18}
              color={palette.textPrimary}
            />
          </View>
          <View>
            <Text numberOfLines={1} style={styles.label}>
              {list.label}
            </Text>
            <Text style={styles.count}>{list.count} items</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  pressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceMuted,
  },
  label: {
    color: palette.textPrimary,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  count: {
    color: palette.textMuted,
    fontSize: typography.micro,
    fontWeight: '600',
  },
});
