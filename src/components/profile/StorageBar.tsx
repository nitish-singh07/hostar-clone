import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';

type StorageBarProps = {
  usedGb: number;
  totalGb: number;
};

export function StorageBar({ totalGb, usedGb }: StorageBarProps) {
  const ratio = totalGb > 0 ? Math.min(usedGb / totalGb, 1) : 0;
  const freeGb = Math.max(totalGb - usedGb, 0);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.used}>{usedGb.toFixed(1)} GB used</Text>
        <Text style={styles.free}>{freeGb.toFixed(1)} GB free</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  used: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  free: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.hotstarBlue,
  },
});
