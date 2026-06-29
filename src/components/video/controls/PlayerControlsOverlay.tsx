import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SeekBar } from '@/components/video/controls/SeekBar';
import { usePlayer } from '@/player/usePlayer';
import { palette, spacing } from '@/theme/tokens';
import { formatRemaining, formatTime } from '@/utils/time';

interface PlayerControlsOverlayProps {
  /** Reset the auto-hide timer on any control interaction. */
  onInteract: () => void;
  /** Pause/resume auto-hide while scrubbing. */
  onScrubLock: (locked: boolean) => void;
  onOpenSettings: () => void;
}

export function PlayerControlsOverlay({
  onInteract,
  onScrubLock,
  onOpenSettings,
}: PlayerControlsOverlayProps) {
  const {
    player,
    session,
    playbackRate,
    togglePlay,
    seekBy,
    seekTo,
    minimize,
    hasNext,
    hasPrev,
    playNext,
    playPrev,
    cycleAspect,
  } = usePlayer();

  const insets = useSafeAreaInsets();
  const timeEvent = useEvent(player, 'timeUpdate');
  const playingEvent = useEvent(player, 'playingChange');
  const currentTime = timeEvent?.currentTime ?? player.currentTime;
  const bufferedPosition = timeEvent?.bufferedPosition ?? player.bufferedPosition;
  const isPlaying = playingEvent?.isPlaying ?? player.playing;
  const duration = player.duration;
  const isLive = session?.isLive ?? false;

  const [preview, setPreview] = useState<number | null>(null);
  const displayTime = preview ?? currentTime;

  const withInteract = (fn: () => void) => () => {
    onInteract();
    fn();
  };

  const title = session
    ? session.episode
      ? session.item.title
      : session.item.title
    : '';
  const subtitle = session?.episode
    ? `S${session.episode.seasonNumber} E${session.episode.episodeNumber} · ${session.episode.title}`
    : session?.item.episodeLabel;

  return (
    <View style={styles.fill} pointerEvents="box-none">
      <View style={styles.scrim} pointerEvents="none" />

      {/* Top bar */}
      <View
        style={[styles.topBar, { paddingTop: Math.max(insets.top, spacing.sm) }]}
        pointerEvents="box-none"
      >
        <Pressable onPress={withInteract(minimize)} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={26} color={palette.textPrimary} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        ) : null}
        <Pressable onPress={withInteract(onOpenSettings)} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color={palette.textPrimary} />
        </Pressable>
      </View>

      {/* Center controls */}
      <View style={styles.center} pointerEvents="box-none">
        <Pressable onPress={withInteract(() => seekBy(-10))} hitSlop={12} style={styles.centerBtn}>
          <Ionicons name="play-back" size={30} color={palette.textPrimary} />
          <Text style={styles.seekLabel}>10</Text>
        </Pressable>
        <Pressable onPress={withInteract(togglePlay)} hitSlop={12} style={styles.playBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color={palette.textPrimary} />
        </Pressable>
        <Pressable onPress={withInteract(() => seekBy(10))} hitSlop={12} style={styles.centerBtn}>
          <Ionicons name="play-forward" size={30} color={palette.textPrimary} />
          <Text style={styles.seekLabel}>10</Text>
        </Pressable>
      </View>

      {/* Bottom bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}
        pointerEvents="box-none"
      >
        {!isLive ? (
          <View style={styles.seekRow}>
            <Text style={styles.time}>{formatTime(displayTime)}</Text>
            <View style={styles.seekBarWrap}>
              <SeekBar
                currentTime={currentTime}
                duration={duration}
                bufferedPosition={bufferedPosition}
                onSeek={(s) => {
                  onInteract();
                  seekTo(s);
                }}
                onScrub={setPreview}
                onScrubStateChange={onScrubLock}
              />
            </View>
            <Text style={styles.time}>{formatRemaining(displayTime, duration)}</Text>
          </View>
        ) : (
          <View style={styles.seekRow}>
            <View style={styles.liveEdge} />
            <Text style={styles.liveEdgeText}>Streaming live</Text>
            <View style={{ flex: 1 }} />
            <Pressable
              style={styles.goLive}
              onPress={withInteract(() => seekTo(player.duration || 0))}
            >
              <Ionicons name="radio" size={14} color={palette.textPrimary} />
              <Text style={styles.goLiveText}>Go Live</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.actionRow}>
          <View style={styles.actionGroup}>
            <ActionButton
              icon="play-skip-back"
              label="Prev"
              disabled={!hasPrev}
              onPress={withInteract(() => void playPrev())}
            />
            <ActionButton
              icon="play-skip-forward"
              label="Next"
              disabled={!hasNext}
              onPress={withInteract(() => void playNext())}
            />
          </View>
          <View style={styles.actionGroup}>
            <ActionButton
              icon="speedometer-outline"
              label={`${playbackRate}x`}
              onPress={withInteract(onOpenSettings)}
            />
            <ActionButton icon="scan-outline" label="Aspect" onPress={withInteract(cycleAspect)} />
            <ActionButton icon="settings-outline" label="Settings" onPress={withInteract(onOpenSettings)} />
            <ActionButton icon="contract-outline" label="Exit" onPress={withInteract(minimize)} />
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={[styles.action, disabled && styles.actionDisabled]}
    >
      <Ionicons name={icon} size={20} color={palette.textPrimary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: { flex: 1 },
  title: { color: palette.textPrimary, fontSize: 16, fontWeight: '800' },
  subtitle: { color: palette.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 2 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.ctaEnd,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.textPrimary },
  liveText: { color: palette.textPrimary, fontSize: 10, fontWeight: '900' },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  centerBtn: { alignItems: 'center', justifyContent: 'center' },
  seekLabel: { color: palette.textPrimary, fontSize: 10, fontWeight: '800', marginTop: 2 },
  playBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  seekRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  seekBarWrap: { flex: 1 },
  time: { color: palette.textPrimary, fontSize: 12, fontWeight: '700', width: 52, textAlign: 'center' },
  liveEdge: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.ctaEnd },
  liveEdgeText: { color: palette.textSecondary, fontSize: 12, fontWeight: '700' },
  goLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: palette.ctaEnd,
  },
  goLiveText: { color: palette.textPrimary, fontSize: 12, fontWeight: '800' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionGroup: { flexDirection: 'row', gap: spacing.lg },
  action: { alignItems: 'center', gap: 2, minWidth: 44 },
  actionDisabled: { opacity: 0.35 },
  actionLabel: { color: palette.textSecondary, fontSize: 10, fontWeight: '700' },
});
