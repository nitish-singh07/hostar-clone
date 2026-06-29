import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { VideoView } from 'expo-video';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayer } from '@/player/usePlayer';
import { palette, spacing } from '@/theme/tokens';

/**
 * Floating portrait mini-player rendered at the root so it persists across tab
 * navigation. Binds a VideoView to the same shared player instance, so playback
 * continues seamlessly when minimizing from fullscreen. Tap to expand.
 */
export function MiniPlayer() {
  const { player, session, surface, enterFullscreen, close, togglePlay } = usePlayer();
  const insets = useSafeAreaInsets();
  const timeEvent = useEvent(player, 'timeUpdate');
  const playingEvent = useEvent(player, 'playingChange');

  if (surface !== 'mini' || !session) return null;

  const currentTime = timeEvent?.currentTime ?? player.currentTime;
  const duration = player.duration || 0;
  const isPlaying = playingEvent?.isPlaying ?? player.playing;
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const subtitle = session.episode
    ? `S${session.episode.seasonNumber} E${session.episode.episodeNumber}`
    : session.item.episodeLabel ?? session.item.genre;

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={[styles.root, { bottom: insets.bottom + 64 }]}
    >
      <Pressable style={styles.card} onPress={enterFullscreen}>
        <View style={styles.videoWrap}>
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {session.item.title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Pressable style={styles.iconBtn} onPress={togglePlay} hitSlop={8}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={palette.textPrimary} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={close} hitSlop={8}>
          <Ionicons name="close" size={22} color={palette.textPrimary} />
        </Pressable>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 12,
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
    overflow: 'hidden',
    paddingRight: spacing.xs,
  },
  videoWrap: { width: 104, height: 64, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  body: { flex: 1, paddingHorizontal: spacing.sm, gap: 2 },
  title: { color: palette.textPrimary, fontSize: 13, fontWeight: '800' },
  subtitle: { color: palette.textMuted, fontSize: 11, fontWeight: '600' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressFill: { height: '100%', backgroundColor: palette.hotstarBlue },
});
