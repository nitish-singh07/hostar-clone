import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Toggle } from '@/components/common/Toggle';
import { palette, spacing, typography } from '@/theme/tokens';

type ToggleConfig = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type SettingsRowProps = {
  icon: string;
  label: string;
  subtitle?: string;
  /** Trailing value text (paired with a chevron) for navigation/option rows. */
  value?: string;
  /** Renders a trailing animated toggle instead of a value/chevron. */
  toggle?: ToggleConfig;
  onPress?: () => void;
  destructive?: boolean;
  /** Hide the bottom divider on the last row of a section. */
  last?: boolean;
};

export function SettingsRow({
  destructive = false,
  icon,
  label,
  last = false,
  onPress,
  subtitle,
  toggle,
  value,
}: SettingsRowProps) {
  const labelColor = destructive ? palette.danger : palette.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={toggle ? undefined : onPress}
      disabled={!toggle && !onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}>
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={20}
        color={destructive ? palette.danger : palette.textSecondary}
      />
      <View style={styles.body}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {toggle ? (
        <Toggle
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          accessibilityLabel={label}
        />
      ) : (
        <View style={styles.trailing}>
          {value ? (
            <Text numberOfLines={1} style={styles.value}>
              {value}
            </Text>
          ) : null}
          {onPress ? (
            <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  pressed: {
    backgroundColor: palette.backgroundPrimary,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '500',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: 160,
  },
  value: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
