import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';

type SettingsSectionProps = PropsWithChildren<{
  title: string;
}>;

export function SettingsSection({ children, title }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginLeft: spacing.xxs,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
    overflow: 'hidden',
  },
});
