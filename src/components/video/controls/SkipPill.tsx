import { useEvent } from 'expo';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { usePlayer } from '@/player/usePlayer';
import { spacing } from '@/theme/tokens';

/**
 * Shows "Skip Intro" / "Skip Credits" while playback is inside the mock marker
 * windows from the title's PlaybackConfig. Credits start is derived from the
 * duration when not explicitly provided so it demos on the short sample clips.
 */
export function SkipPill() {
  const { player, session, seekTo } = usePlayer();
  const timeEvent = useEvent(player, 'timeUpdate');
  const currentTime = timeEvent?.currentTime ?? player.currentTime;
  const duration = player.duration || 0;

  const config = session?.config;
  if (!config || session?.isLive) return null;

  const introStart = config.introStart;
  const introEnd = config.introEnd;
  const creditsStart =
    config.creditsStart ?? (duration > 40 ? duration - 20 : duration > 0 ? duration * 0.85 : undefined);

  const inIntro =
    introStart != null && introEnd != null && currentTime >= introStart && currentTime < introEnd;
  const inCredits = creditsStart != null && duration > 0 && currentTime >= creditsStart;

  if (!inIntro && !inCredits) return null;

  const label = inIntro ? 'Skip Intro' : 'Skip Credits';
  const target = inIntro ? introEnd! : duration;

  return (
    <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(160)} style={styles.wrap}>
      <Pressable style={styles.pill} onPress={() => seekTo(Math.max(0, target - 0.2))}>
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: spacing.xl,
    bottom: 96,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  text: { color: '#0B0B0F', fontSize: 14, fontWeight: '900' },
});
