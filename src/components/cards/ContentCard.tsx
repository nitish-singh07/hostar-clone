import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing } from '@/theme/tokens';
import type { ContentItem } from '@/types/content';

type ContentCardProps = {
  item: ContentItem;
  variant?: 'poster' | 'wide';
  onPress: (item: ContentItem) => void;
  onLongPress?: (item: ContentItem) => void;
};

function ContentCardBase({ item, onLongPress, onPress, variant = 'poster' }: ContentCardProps) {
  const isWide = variant === 'wide';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      onPress={() => onPress(item)}
      onLongPress={onLongPress ? () => onLongPress(item) : undefined}
      style={({ pressed }) => [styles.card, isWide ? styles.wideCard : styles.posterCard, pressed && styles.pressed]}>
      <Image
        source={{ uri: isWide ? item.backdropUrl : item.posterUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
      />
      <LinearGradient
        colors={['transparent', 'rgba(11,11,15,0.88)']}
        style={StyleSheet.absoluteFill}
      />
      {item.progress ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(item.progress * 100)}%` }]} />
        </View>
      ) : null}
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {item.logoText}
        </Text>
        <Text numberOfLines={1} style={styles.caption}>
          {item.episodeLabel ?? item.genre}
        </Text>
      </View>
    </Pressable>
  );
}

export const ContentCard = memo(ContentCardBase);

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  posterCard: {
    width: 132,
    height: 184,
  },
  wideCard: {
    width: 220,
    height: 124,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  meta: {
    marginTop: 'auto',
    padding: spacing.sm,
    gap: 2,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  caption: {
    color: palette.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    zIndex: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: palette.hotstarBlue,
  },
});
