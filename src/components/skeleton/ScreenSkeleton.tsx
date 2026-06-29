import { Dimensions, StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock';
import { palette, spacing } from '@/theme/tokens';

const width = Dimensions.get('window').width;

export function ScreenSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width={width} height={420} borderRadius={0} />
      <View style={styles.content}>
        <SkeletonBlock width="58%" height={24} />
        <View style={styles.row}>
          <SkeletonBlock width={132} height={184} />
          <SkeletonBlock width={132} height={184} />
          <SkeletonBlock width={132} height={184} />
        </View>
        <SkeletonBlock width="48%" height={24} />
        <View style={styles.row}>
          <SkeletonBlock width={220} height={124} />
          <SkeletonBlock width={220} height={124} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundPrimary,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
