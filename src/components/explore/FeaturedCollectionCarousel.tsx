import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { FeaturedCollection } from '@/types/explore';

type FeaturedCollectionCarouselProps = {
  collections: FeaturedCollection[];
  onPress: (collection: FeaturedCollection) => void;
};

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth - spacing.md * 2;
const CARD_HEIGHT = 168;
const GAP = spacing.sm;
const SNAP = CARD_WIDTH + GAP;
const AUTO_SCROLL_MS = 4000;

function FeaturedCollectionCarouselBase({ collections, onPress }: FeaturedCollectionCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SNAP);
    activeRef.current = index;
    setActive(index);
  }, []);

  useEffect(() => {
    if (collections.length <= 1) return;
    const timer = setInterval(() => {
      const next = (activeRef.current + 1) % collections.length;
      activeRef.current = next;
      setActive(next);
      scrollRef.current?.scrollTo({ x: next * SNAP, animated: true });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [collections.length]);

  if (collections.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}>
        {collections.map((collection) => (
          <Pressable
            key={collection.id}
            accessibilityRole="button"
            accessibilityLabel={collection.title}
            onPress={() => onPress(collection)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <Image
              source={{ uri: collection.backdropUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['rgba(11,11,15,0.1)', 'rgba(11,11,15,0.92)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.meta}>
              <Text numberOfLines={1} style={styles.title}>
                {collection.title}
              </Text>
              <Text numberOfLines={1} style={styles.subtitle}>
                {collection.subtitle}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {collections.map((collection, index) => (
          <View
            key={collection.id}
            style={[styles.dot, index === active && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

export const FeaturedCollectionCarousel = memo(FeaturedCollectionCarouselBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.surfaceCard,
  },
  pressed: {
    opacity: 0.9,
  },
  meta: {
    marginTop: 'auto',
    padding: spacing.md,
    gap: 2,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.borderDefault,
  },
  dotActive: {
    width: 18,
    backgroundColor: palette.hotstarBlue,
  },
});
