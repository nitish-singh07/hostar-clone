import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme/tokens';

export type RippleSide = 'left' | 'right';

interface SeekRippleOverlayProps {
  /** Incrementing trigger; each change fires the animation. */
  trigger: number;
  side: RippleSide;
  seconds: number;
}

/** Double-tap seek feedback (a fading "+10s" / "-10s" pill on the tapped half). */
export function SeekRippleOverlay({ trigger, side, seconds }: SeekRippleOverlayProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    opacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 420 }),
    );
  }, [trigger, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.fill} pointerEvents="none">
      <Animated.View
        style={[styles.half, side === 'left' ? styles.left : styles.right, style]}
      >
        <Ionicons
          name={side === 'left' ? 'play-back' : 'play-forward'}
          size={34}
          color={palette.textPrimary}
        />
        <Text style={styles.label}>{`${side === 'left' ? '-' : '+'}${seconds}s`}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  half: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '38%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  left: { left: 0, backgroundColor: 'rgba(255,255,255,0.06)' },
  right: { right: 0, backgroundColor: 'rgba(255,255,255,0.06)' },
  label: { color: palette.textPrimary, fontSize: 14, fontWeight: '800' },
});
