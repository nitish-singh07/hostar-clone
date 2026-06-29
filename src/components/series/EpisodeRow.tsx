import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Episode } from '@/types/content';
import { palette, spacing } from '@/theme/tokens';

interface EpisodeRowProps {
  episode: Episode;
  /** 0..1 watch progress for this episode, if any. */
  progress?: number;
  isCurrent?: boolean;
  onPlay: () => void;
}

function EpisodeRowBase({ episode, progress, isCurrent, onPlay }: EpisodeRowProps) {
  return (
    <Pressable style={[styles.row, isCurrent && styles.rowCurrent]} onPress={onPlay}>
      <View style={styles.thumbWrap}>
        <Image source={{ uri: episode.thumbnailUrl }} style={styles.thumb} contentFit="cover" transition={200} />
        <View style={styles.playBadge}>
          <Ionicons name="play" size={16} color={palette.textPrimary} />
        </View>
        {progress != null && progress > 0 ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {episode.episodeNumber}. {episode.title}
          </Text>
          <Text style={styles.runtime}>{episode.runtimeLabel}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {episode.description}
        </Text>
      </View>
    </Pressable>
  );
}

export const EpisodeRow = memo(EpisodeRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowCurrent: { backgroundColor: palette.backgroundSecondary },
  thumbWrap: { width: 132, height: 76, borderRadius: 8, overflow: 'hidden', backgroundColor: palette.surfaceCard },
  thumb: { width: '100%', height: '100%' },
  playBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: { height: '100%', backgroundColor: palette.hotstarBlue },
  body: { flex: 1, justifyContent: 'center', gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1, color: palette.textPrimary, fontSize: 14, fontWeight: '800' },
  runtime: { color: palette.textMuted, fontSize: 11, fontWeight: '700' },
  desc: { color: palette.textMuted, fontSize: 12, fontWeight: '500', lineHeight: 17 },
});
