import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { StudioTile } from '@/types/explore';

type StudioRowProps = {
  studios: StudioTile[];
  onPress: (studio: StudioTile) => void;
};

function StudioRowBase({ onPress, studios }: StudioRowProps) {
  if (studios.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Studios & Networks" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {studios.map((studio) => (
          <Pressable
            key={studio.id}
            accessibilityRole="button"
            accessibilityLabel={studio.name}
            onPress={() => onPress(studio)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <Image
              source={{ uri: studio.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={150}
            />
            <LinearGradient
              colors={['rgba(11,11,15,0.35)', 'rgba(11,11,15,0.85)']}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.logo}>{studio.logoText}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export const StudioRow = memo(StudioRowBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 132,
    height: 76,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pressed: {
    opacity: 0.85,
  },
  logo: {
    color: palette.textPrimary,
    fontSize: typography.body,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
