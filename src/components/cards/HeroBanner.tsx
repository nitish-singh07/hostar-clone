import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GradientButton } from '@/components/common/GradientButton';
import { IconButton } from '@/components/common/IconButton';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentItem } from '@/types/content';
import { getMetaLine } from '@/utils/content';

const width = Dimensions.get('window').width;

type HeroBannerProps = {
  item: ContentItem;
  active?: boolean;
  onPress: (item: ContentItem) => void;
};

function HeroBannerBase({ active = false, item, onPress }: HeroBannerProps) {
  return (
    <Pressable onPress={() => onPress(item)} style={styles.container}>
      <Image source={{ uri: item.backdropUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      <LinearGradient
        colors={['rgba(11,11,15,0.05)', 'rgba(11,11,15,0.62)', palette.backgroundPrimary]}
        locations={[0.15, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View entering={active ? FadeInDown.duration(450) : undefined} style={styles.content}>
        <Text style={styles.brand}>hotstar specials</Text>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.title}>
          {item.logoText}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {getMetaLine(item)}
        </Text>
        <View style={styles.actions}>
          <GradientButton onPress={() => onPress(item)} style={styles.primaryAction}>
            Watch Now
          </GradientButton>
          <IconButton icon="+" label={`Add ${item.title} to watchlist`} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const HeroBanner = memo(HeroBannerBase);

const styles = StyleSheet.create({
  container: {
    width,
    height: Math.min(width * 1.18, 510),
    justifyContent: 'flex-end',
    backgroundColor: palette.backgroundPrimary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  brand: {
    color: '#35D8E5',
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'lowercase',
  },
  title: {
    color: palette.textPrimary,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    maxWidth: width - spacing.xxl,
  },
  meta: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  primaryAction: {
    flex: 1,
    borderRadius: radius.md,
  },
});
