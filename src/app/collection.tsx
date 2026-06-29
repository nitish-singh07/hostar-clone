import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentCard } from '@/components/cards/ContentCard';
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock';
import { StateMessage } from '@/components/states/StateMessage';
import { useAsyncResource } from '@/hooks/use-async-resource';
import { getContentByIds } from '@/services/api/content';
import { palette, spacing, typography } from '@/theme/tokens';
import type { ContentItem } from '@/types/content';

// Responsive grid: pick a column count that keeps cards a comfortable size on
// any width, then size every card to fill its column so spacing stays even.
const screenWidth = Dimensions.get('window').width;
const H_PAD = spacing.md;
const GAP = spacing.sm;
const MIN_CARD = 104;
const COLUMNS = Math.max(3, Math.floor((screenWidth - H_PAD * 2 + GAP) / (MIN_CARD + GAP)));
const CARD_WIDTH = Math.floor((screenWidth - H_PAD * 2 - GAP * (COLUMNS - 1)) / COLUMNS);
const CARD_HEIGHT = Math.round(CARD_WIDTH * (184 / 132));

export default function CollectionScreen() {
  const params = useLocalSearchParams<{ title?: string; ids?: string }>();
  const title = (Array.isArray(params.title) ? params.title[0] : params.title) ?? 'Collection';
  const ids = Array.isArray(params.ids) ? params.ids[0] : params.ids;

  const idList = useMemo(() => (ids ? ids.split(',') : []), [ids]);
  const loader = useCallback(() => getContentByIds(idList), [idList]);
  const { data, error, isLoading } = useAsyncResource(loader);

  const openDetails = useCallback((item: ContentItem) => {
    router.push(`/details/${item.id}`);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Ionicons name="chevron-back" size={24} color={palette.textPrimary} />
          </Pressable>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        {isLoading && !data ? (
          <GridSkeleton />
        ) : error || !data ? (
          <StateMessage
            title="Could not load"
            message="There was an error loading this collection."
          />
        ) : data.length === 0 ? (
          <StateMessage title="Nothing here yet" message="This collection has no titles." />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}>
            {data.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onPress={openDetails}
                variant="poster"
                width={CARD_WIDTH}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function GridSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: COLUMNS * 4 }).map((_, index) => (
        <SkeletonBlock key={index} width={CARD_WIDTH} height={CARD_HEIGHT} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PAD,
    paddingTop: spacing.md,
    paddingBottom: 120,
    columnGap: GAP,
    rowGap: spacing.md,
  },
});
