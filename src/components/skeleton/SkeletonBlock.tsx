import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { palette, radius } from '@/theme/tokens';

type SkeletonBlockProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
};

export function SkeletonBlock({ borderRadius = radius.md, height, width }: SkeletonBlockProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 850 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        animatedStyle,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: palette.skeletonHighlight,
  },
});
