import { Dimensions, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock';
import { radius, spacing } from '@/theme/tokens';

const screenWidth = Dimensions.get('window').width;
const bannerWidth = screenWidth - spacing.md * 2;

const CHIP_WIDTHS = [70, 84, 62, 90, 74, 66];
const PILL_WIDTHS = [54, 72, 64, 58, 80];

export function ExploreSkeleton() {
  return (
    <Screen withTopInset>
      {/* Header: title + search bar + filter */}
      <View style={styles.header}>
        <SkeletonBlock width={120} height={28} />
        <View style={styles.searchRow}>
          <SkeletonBlock width={bannerWidth - 44 - spacing.sm} height={44} borderRadius={radius.lg} />
          <SkeletonBlock width={44} height={44} borderRadius={radius.lg} />
        </View>
      </View>

      <View style={styles.body}>
        <PillRow widths={CHIP_WIDTHS} height={28} />
        <PillRow widths={PILL_WIDTHS} height={30} />

        {/* Featured banner */}
        <View style={styles.section}>
          <SkeletonBlock width={bannerWidth} height={168} borderRadius={radius.lg} />
        </View>

        <PosterSection />
        <PosterSection />

        {/* Genre grid hint */}
        <View style={styles.section}>
          <SkeletonBlock width="44%" height={20} />
          <View style={styles.row}>
            <SkeletonBlock width={(bannerWidth - spacing.sm) / 2} height={84} borderRadius={radius.lg} />
            <SkeletonBlock width={(bannerWidth - spacing.sm) / 2} height={84} borderRadius={radius.lg} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

function PillRow({ height, widths }: { widths: number[]; height: number }) {
  return (
    <View style={styles.pillRow}>
      {widths.map((width, index) => (
        <SkeletonBlock key={index} width={width} height={height} borderRadius={radius.pill} />
      ))}
    </View>
  );
}

function PosterSection() {
  return (
    <View style={styles.section}>
      <SkeletonBlock width="40%" height={20} />
      <View style={styles.row}>
        <SkeletonBlock width={132} height={184} />
        <SkeletonBlock width={132} height={184} />
        <SkeletonBlock width={132} height={184} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  body: {
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
