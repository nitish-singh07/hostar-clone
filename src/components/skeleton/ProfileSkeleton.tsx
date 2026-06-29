import { Dimensions, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock';
import { palette, radius, spacing } from '@/theme/tokens';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - spacing.md * 2;

export function ProfileSkeleton() {
  return (
    <Screen withTopInset>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBlock width={140} height={28} />
        <SkeletonBlock width={40} height={40} borderRadius={radius.pill} />
      </View>

      <View style={styles.body}>
        {/* Profile header card */}
        <View style={styles.card}>
          <SkeletonBlock width={64} height={64} borderRadius={radius.pill} />
          <View style={styles.cardLines}>
            <SkeletonBlock width="60%" height={20} />
            <SkeletonBlock width="40%" height={13} />
            <SkeletonBlock width={86} height={16} borderRadius={radius.sm} />
          </View>
          <SkeletonBlock width={52} height={28} borderRadius={radius.pill} />
        </View>

        {/* Subscription card */}
        <View style={styles.sectionPadded}>
          <SkeletonBlock width={cardWidth} height={120} borderRadius={radius.lg} />
        </View>

        {/* Content row */}
        <View style={styles.section}>
          <View style={styles.sectionPadded}>
            <SkeletonBlock width="48%" height={20} />
          </View>
          <View style={styles.row}>
            <SkeletonBlock width={132} height={184} />
            <SkeletonBlock width={132} height={184} />
            <SkeletonBlock width={132} height={184} />
          </View>
        </View>

        {/* Settings groups */}
        <SettingsGroupSkeleton />
        <SettingsGroupSkeleton />
        <SettingsGroupSkeleton />
      </View>
    </Screen>
  );
}

function SettingsGroupSkeleton() {
  return (
    <View style={styles.sectionPadded}>
      <SkeletonBlock width="32%" height={12} />
      <View style={{ height: spacing.sm }} />
      <SkeletonBlock width={cardWidth} height={168} borderRadius={radius.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  body: {
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  cardLines: {
    flex: 1,
    gap: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionPadded: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
