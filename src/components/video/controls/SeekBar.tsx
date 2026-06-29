import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { palette } from '@/theme/tokens';

const THUMB = 14;
const TRACK_HEIGHT = 4;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface SeekBarProps {
  currentTime: number;
  duration: number;
  bufferedPosition: number;
  onSeek: (seconds: number) => void;
  /** Called continuously while scrubbing (preview), and with null on release. */
  onScrub?: (seconds: number | null) => void;
  onScrubStateChange?: (scrubbing: boolean) => void;
}

/**
 * Custom seek bar driven by gesture-handler. Measures its real width via
 * onLayout (so tap/scrub map accurately to time) and renders played + buffered
 * fills with a draggable thumb. The gesture worklet captures the measured width
 * (rebuilt each render by GestureDetector), so no shared values are needed.
 */
export function SeekBar({
  currentTime,
  duration,
  bufferedPosition,
  onSeek,
  onScrub,
  onScrubStateChange,
}: SeekBarProps) {
  const [width, setWidth] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubFrac, setScrubFrac] = useState(0);

  const playedFrac = scrubbing
    ? scrubFrac
    : duration > 0
      ? clamp01(currentTime / duration)
      : 0;
  const bufferedFrac = duration > 0 ? clamp01(bufferedPosition / duration) : 0;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const startScrub = (frac: number) => {
    setScrubbing(true);
    setScrubFrac(frac);
    onScrubStateChange?.(true);
    onScrub?.(frac * duration);
  };
  const moveScrub = (frac: number) => {
    setScrubFrac(frac);
    onScrub?.(frac * duration);
  };
  const endScrub = (frac: number) => {
    onSeek(frac * duration);
    setScrubbing(false);
    onScrubStateChange?.(false);
    onScrub?.(null);
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      const f = width > 0 ? clamp01(e.x / width) : 0;
      runOnJS(startScrub)(f);
    })
    .onUpdate((e) => {
      const f = width > 0 ? clamp01(e.x / width) : 0;
      runOnJS(moveScrub)(f);
    })
    .onEnd((e) => {
      const f = width > 0 ? clamp01(e.x / width) : 0;
      runOnJS(endScrub)(f);
    });

  const tap = Gesture.Tap().onEnd((e) => {
    const f = width > 0 ? clamp01(e.x / width) : 0;
    runOnJS(onSeek)(f * duration);
  });

  const gesture = Gesture.Race(pan, tap);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.hitArea} onLayout={onLayout}>
        <View style={styles.track} />
        <View style={[styles.buffered, { width: bufferedFrac * width }]} />
        <View style={[styles.played, { width: playedFrac * width }]} />
        <View
          style={[
            styles.thumb,
            { transform: [{ translateX: playedFrac * width - THUMB / 2 }, { scale: scrubbing ? 1.3 : 1 }] },
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hitArea: { height: 28, justifyContent: 'center' },
  track: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  buffered: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  played: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: palette.hotstarBlue,
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: palette.textPrimary,
    left: 0,
  },
});
