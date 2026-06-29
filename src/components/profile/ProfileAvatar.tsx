import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing } from '@/theme/tokens';

type ProfileAvatarProps = {
  name: string;
  imageUrl: string;
  isKids?: boolean;
  active?: boolean;
  onPress?: () => void;
};

export function ProfileAvatar({ active, imageUrl, isKids, name, onPress }: ProfileAvatarProps) {
  const content = (
    <>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.avatar, isKids && styles.kidsAvatar, active && styles.activeAvatar]}
        contentFit="cover"
      />
      <Text numberOfLines={1} style={[styles.name, active && styles.activeName]}>
        {name}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${name}`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceCard,
    borderWidth: 2,
    borderColor: palette.borderDefault,
  },
  kidsAvatar: {
    borderColor: palette.ctaEnd,
  },
  activeAvatar: {
    borderColor: palette.hotstarBlue,
  },
  pressed: {
    opacity: 0.8,
  },
  name: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 70,
  },
  activeName: {
    color: palette.textPrimary,
  },
});
