import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentItem } from '@/types/content';

type DownloadCardProps = {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
};

const QUALITIES = ['Full HD 1080p', 'HD 720p', 'Medium 480p'];

/** Deterministic mock metadata so cards are stable across renders. */
function fakeMeta(item: ContentItem) {
  const seed = item.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const sizeMb = 220 + (seed % 12) * 70;
  const quality = QUALITIES[seed % QUALITIES.length];
  const days = 1 + (seed % 9);
  const sizeLabel = sizeMb >= 1000 ? `${(sizeMb / 1000).toFixed(1)} GB` : `${sizeMb} MB`;
  return { quality, sizeLabel, dateLabel: days === 1 ? 'Today' : `${days} days ago` };
}

function DownloadCardBase({ item, onDelete, onPress }: DownloadCardProps) {
  const { dateLabel, quality, sizeLabel } = fakeMeta(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play ${item.title} offline`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: item.posterUrl }} style={styles.poster} contentFit="cover" transition={150} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <View style={styles.downloadedRow}>
          <Ionicons name="checkmark-circle" size={13} color={palette.success} />
          <Text style={styles.downloaded}>Downloaded</Text>
        </View>
        <Text numberOfLines={1} style={styles.meta}>
          {quality}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {sizeLabel} • {dateLabel}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete download ${item.title}`}
        hitSlop={8}
        onPress={() => onDelete(item)}
        style={styles.delete}>
        <Ionicons name="trash-outline" size={18} color={palette.textMuted} />
      </Pressable>
    </Pressable>
  );
}

export const DownloadCard = memo(DownloadCardBase);

const styles = StyleSheet.create({
  card: {
    width: 268,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  pressed: {
    opacity: 0.85,
  },
  poster: {
    width: 56,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceCard,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  downloadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  downloaded: {
    color: palette.success,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  meta: {
    color: palette.textMuted,
    fontSize: typography.micro,
    fontWeight: '600',
  },
  delete: {
    padding: spacing.xxs,
  },
});
