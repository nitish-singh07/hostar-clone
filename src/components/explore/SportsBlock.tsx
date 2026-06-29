import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentItem } from '@/types/content';

type SportsBlockProps = {
  items: ContentItem[];
  onPress: (item: ContentItem) => void;
};

const isLive = (item: ContentItem) => item.year === 'Live' || item.rating === 'Live';

function SportsBlockBase({ items, onPress }: SportsBlockProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Live & Upcoming Sports" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Watch ${item.title}`}
            onPress={() => onPress(item)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <Image
              source={{ uri: item.backdropUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={180}
            />
            <LinearGradient
              colors={['rgba(11,11,15,0.2)', 'rgba(11,11,15,0.9)']}
              style={StyleSheet.absoluteFill}
            />
            {isLive(item) ? (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            ) : null}
            <View style={styles.meta}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.subtitle}>
                {item.genre} • {item.languages}
              </Text>
              <View style={styles.watch}>
                <Text style={styles.watchText}>{isLive(item) ? 'Watch Now' : 'Set Reminder'}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export const SportsBlock = memo(SportsBlockBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 280,
    height: 158,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.surfaceCard,
  },
  pressed: {
    opacity: 0.9,
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: palette.danger,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.textPrimary,
  },
  liveText: {
    color: palette.textPrimary,
    fontSize: typography.micro,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  meta: {
    marginTop: 'auto',
    padding: spacing.md,
    gap: spacing.xxs,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  watch: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: palette.hotstarBlue,
  },
  watchText: {
    color: palette.textPrimary,
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
