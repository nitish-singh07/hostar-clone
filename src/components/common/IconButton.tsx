import { Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius } from '@/theme/tokens';

type IconButtonProps = {
  label: string;
  icon: string;
  onPress?: () => void;
};

export function IconButton({ icon, label, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pressed: {
    opacity: 0.72,
  },
  icon: {
    color: palette.textPrimary,
    fontSize: 24,
    lineHeight: 28,
  },
});
