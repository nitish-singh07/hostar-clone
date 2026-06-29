import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ContentItem } from '@/types/content';
import { palette, spacing } from '@/theme/tokens';

interface VideoEndScreenProps {
  title: string;
  recommended: ContentItem[];
  onReplay: () => void;
  onExit: () => void;
  onSelect: (item: ContentItem) => void;
}

/** Shown when a movie / last episode ends: replay + recommended titles. */
export function VideoEndScreen({
  title,
  recommended,
  onReplay,
  onExit,
  onSelect,
}: VideoEndScreenProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.finished}>You finished</Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.actions}>
          <Pressable style={styles.replay} onPress={onReplay}>
            <Ionicons name="refresh" size={18} color={palette.textPrimary} />
            <Text style={styles.replayText}>Replay</Text>
          </Pressable>
          <Pressable style={styles.exit} onPress={onExit}>
            <Ionicons name="home" size={18} color={palette.textPrimary} />
            <Text style={styles.exitText}>Browse</Text>
          </Pressable>
        </View>
      </View>

      {recommended.length ? (
        <View style={styles.recBlock}>
          <Text style={styles.recHeading}>Recommended for you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recRow}>
            {recommended.map((item) => (
              <Pressable key={item.id} style={styles.card} onPress={() => onSelect(item)}>
                <Image source={{ uri: item.posterUrl }} style={styles.poster} contentFit="cover" transition={200} />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8,8,12,0.92)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.xl,
  },
  header: { gap: spacing.sm },
  finished: { color: palette.textMuted, fontSize: 13, fontWeight: '700' },
  title: { color: palette.textPrimary, fontSize: 24, fontWeight: '900' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  replay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: palette.hotstarBlue,
  },
  replayText: { color: palette.textPrimary, fontSize: 14, fontWeight: '800' },
  exit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  exitText: { color: palette.textPrimary, fontSize: 14, fontWeight: '800' },
  recBlock: { gap: spacing.sm },
  recHeading: { color: palette.textPrimary, fontSize: 15, fontWeight: '800' },
  recRow: { gap: spacing.sm },
  card: { width: 116 },
  poster: { width: 116, height: 164, borderRadius: 10, backgroundColor: palette.surfaceCard },
  cardTitle: { color: palette.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 6 },
});
