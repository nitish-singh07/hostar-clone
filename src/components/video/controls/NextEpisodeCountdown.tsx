import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, spacing } from '@/theme/tokens';

interface NextEpisodeCountdownProps {
  episodeTitle: string;
  seconds?: number;
  onPlay: () => void;
  onCancel: () => void;
}

/** Autoplay-next prompt with a counting-down progress bar + Cancel / Play now. */
export function NextEpisodeCountdown({
  episodeTitle,
  seconds = 5,
  onPlay,
  onCancel,
}: NextEpisodeCountdownProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onPlayRef = useRef(onPlay);

  useEffect(() => {
    onPlayRef.current = onPlay;
  }, [onPlay]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          onPlayRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pct = (1 - remaining / seconds) * 100;

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.label}>Next episode in {remaining}s</Text>
        <Text style={styles.title} numberOfLines={1}>
          {episodeTitle}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.cancel} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.play} onPress={onPlay}>
            <Ionicons name="play" size={16} color={palette.textPrimary} />
            <Text style={styles.playText}>Play now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
  },
  card: {
    width: 300,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: 'rgba(13,14,19,0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
    gap: spacing.sm,
  },
  label: { color: palette.textMuted, fontSize: 12, fontWeight: '700' },
  title: { color: palette.textPrimary, fontSize: 16, fontWeight: '800' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: palette.hotstarBlue },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.xs },
  cancel: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 8 },
  cancelText: { color: palette.textSecondary, fontSize: 13, fontWeight: '700' },
  play: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: palette.hotstarBlue,
  },
  playText: { color: palette.textPrimary, fontSize: 13, fontWeight: '800' },
});
