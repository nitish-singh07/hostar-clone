import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import {
  BrightnessVolumeOverlay,
  type AdjustKind,
} from '@/components/video/overlays/BrightnessVolumeOverlay';
import {
  SeekRippleOverlay,
  type RippleSide,
} from '@/components/video/overlays/SeekRippleOverlay';
import { useScreenBrightness } from '@/hooks/use-screen-brightness';
import { usePlayer } from '@/player/usePlayer';
import { palette } from '@/theme/tokens';
import { formatTime } from '@/utils/time';

const DOUBLE_TAP_SECONDS = 10;
/** Seconds traversed by a full-width horizontal scrub. */
const SCRUB_RANGE_SECONDS = 90;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface PlayerGestureLayerProps {
  onToggleControls: () => void;
  setControlsLocked: (locked: boolean) => void;
}

/**
 * Full-screen gesture surface beneath the controls overlay: single-tap toggles
 * controls, double-tap seeks ±10s, horizontal pan scrubs, vertical pan controls
 * brightness (left half) / volume (right half). Cross-thread state uses
 * reanimated shared values (not React refs) so per-frame updates stay on the UI
 * thread and the component stays render-pure.
 */
export function PlayerGestureLayer({
  onToggleControls,
  setControlsLocked,
}: PlayerGestureLayerProps) {
  const { player, seekBy, seekTo, setVolume } = usePlayer();
  const { setBrightness, getBrightness } = useScreenBrightness();

  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const scrubStart = useSharedValue(0);
  const verticalStart = useSharedValue(0);
  const verticalKind = useSharedValue<AdjustKind>('volume');

  const [ripple, setRipple] = useState({ trigger: 0, side: 'right' as RippleSide });
  const [adjust, setAdjust] = useState({ token: 0, kind: 'volume' as AdjustKind, value: 0 });
  const [scrub, setScrub] = useState({ visible: false, time: 0 });

  // --- JS-thread handlers (invoked via runOnJS) ----------------------------
  const handleToggle = () => onToggleControls();

  const handleDoubleTap = (side: RippleSide) => {
    seekBy(side === 'left' ? -DOUBLE_TAP_SECONDS : DOUBLE_TAP_SECONDS);
    setRipple((r) => ({ trigger: r.trigger + 1, side }));
  };

  const beginScrub = () => {
    scrubStart.value = player.currentTime;
    setControlsLocked(true);
    setScrub({ visible: true, time: player.currentTime });
  };

  const previewScrub = (deltaSeconds: number) => {
    const duration = player.duration || 0;
    const t = Math.max(0, Math.min(scrubStart.value + deltaSeconds, duration || Infinity));
    setScrub({ visible: true, time: t });
  };

  const commitScrub = (deltaSeconds: number) => {
    const duration = player.duration || 0;
    const t = Math.max(0, Math.min(scrubStart.value + deltaSeconds, duration || Infinity));
    seekTo(t);
  };

  const finishScrub = () => {
    setScrub((s) => (s.visible ? { ...s, visible: false } : s));
    setControlsLocked(false);
  };

  const beginVertical = (kind: AdjustKind) => {
    verticalKind.value = kind;
    verticalStart.value = kind === 'brightness' ? getBrightness() : player.volume;
    setAdjust((a) => ({ token: a.token + 1, kind, value: verticalStart.value }));
  };

  const updateVertical = (deltaFraction: number) => {
    const next = clamp01(verticalStart.value + deltaFraction);
    const kind = verticalKind.value;
    if (kind === 'brightness') setBrightness(next);
    else setVolume(next);
    setAdjust((a) => ({ token: a.token + 1, kind, value: next }));
  };

  // --- gesture composition -------------------------------------------------
  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => runOnJS(handleToggle)());

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(280)
    .onEnd((e) => {
      const side: RippleSide = e.x < width.value / 2 ? 'left' : 'right';
      runOnJS(handleDoubleTap)(side);
    });

  const horizontalPan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-24, 24])
    .onStart(() => runOnJS(beginScrub)())
    .onUpdate((e) => {
      const frac = width.value > 0 ? e.translationX / width.value : 0;
      runOnJS(previewScrub)(frac * SCRUB_RANGE_SECONDS);
    })
    .onEnd((e) => {
      const frac = width.value > 0 ? e.translationX / width.value : 0;
      runOnJS(commitScrub)(frac * SCRUB_RANGE_SECONDS);
    })
    .onFinalize(() => runOnJS(finishScrub)());

  const verticalPan = Gesture.Pan()
    .activeOffsetY([-16, 16])
    .failOffsetX([-24, 24])
    .onStart((e) => {
      const kind: AdjustKind = e.x < width.value / 2 ? 'brightness' : 'volume';
      runOnJS(beginVertical)(kind);
    })
    .onUpdate((e) => {
      const frac = height.value > 0 ? -e.translationY / height.value : 0;
      runOnJS(updateVertical)(frac);
    });

  const gesture = Gesture.Race(
    horizontalPan,
    verticalPan,
    Gesture.Exclusive(doubleTap, singleTap),
  );

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
    height.value = e.nativeEvent.layout.height;
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.fill} onLayout={onLayout}>
        <SeekRippleOverlay trigger={ripple.trigger} side={ripple.side} seconds={DOUBLE_TAP_SECONDS} />
        <BrightnessVolumeOverlay token={adjust.token} kind={adjust.kind} value={adjust.value} />
        {scrub.visible ? (
          <View style={styles.scrubBubble} pointerEvents="none">
            <Text style={styles.scrubText}>{formatTime(scrub.time)}</Text>
          </View>
        ) : null}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrubBubble: {
    position: 'absolute',
    alignSelf: 'center',
    top: '44%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  scrubText: { color: palette.textPrimary, fontSize: 18, fontWeight: '800' },
});
