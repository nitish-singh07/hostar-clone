import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/theme/tokens';

export type AdjustKind = 'brightness' | 'volume';

interface BrightnessVolumeOverlayProps {
  /** Incremented on each adjustment; the overlay shows then self-hides. */
  token: number;
  kind: AdjustKind;
  /** 0..1 */
  value: number;
}

/** Transient vertical-swipe feedback for brightness (left) / volume (right). */
export function BrightnessVolumeOverlay({ token, kind, value }: BrightnessVolumeOverlayProps) {
  // `visible` is derived from the token; the hide is committed in a timeout
  // callback (not synchronously in the effect body).
  const [hiddenToken, setHiddenToken] = useState(0);

  useEffect(() => {
    if (token === 0) return;
    const timer = setTimeout(() => setHiddenToken(token), 700);
    return () => clearTimeout(timer);
  }, [token]);

  const visible = token !== 0 && token !== hiddenToken;
  if (!visible) return null;

  const pct = Math.round(value * 100);
  const icon =
    kind === 'brightness'
      ? 'sunny'
      : value <= 0.001
        ? 'volume-mute'
        : value < 0.5
          ? 'volume-low'
          : 'volume-high';

  return (
    <View style={styles.fill} pointerEvents="none">
      <View style={styles.card}>
        <Ionicons name={icon} size={22} color={palette.textPrimary} />
        <View style={styles.bar}>
          <View style={[styles.barFill, { height: `${pct}%` }]} />
        </View>
        <Text style={styles.label}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 64,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    gap: 10,
  },
  bar: {
    width: 6,
    height: 120,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: palette.hotstarBlue, borderRadius: 3 },
  label: { color: palette.textPrimary, fontSize: 12, fontWeight: '800' },
});
