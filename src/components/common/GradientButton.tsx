import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { palette, radius, spacing } from '@/theme/tokens';

type GradientButtonProps = PropsWithChildren<{
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
}>;

export function GradientButton({ children, icon = '▶', onPress, style }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, style]}>
      <LinearGradient
        colors={[palette.ctaStart, palette.ctaEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  gradient: {
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  icon: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  label: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});
