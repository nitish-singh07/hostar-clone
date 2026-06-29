import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { GenreTile } from '@/types/explore';

type GenreGridProps = {
  genres: GenreTile[];
  onPress: (genre: GenreTile) => void;
};

const screenWidth = Dimensions.get('window').width;
const TILE_WIDTH = (screenWidth - spacing.md * 2 - spacing.sm) / 2;
const TILE_HEIGHT = 84;

function GenreGridBase({ genres, onPress }: GenreGridProps) {
  if (genres.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Browse by Genre" />
      <View style={styles.grid}>
        {genres.map((genre) => (
          <Pressable
            key={genre.id}
            accessibilityRole="button"
            accessibilityLabel={`${genre.name} genre`}
            onPress={() => onPress(genre)}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
            <Image
              source={{ uri: genre.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={150}
            />
            <LinearGradient
              colors={[`${genre.gradient[0]}E6`, `${genre.gradient[1]}E6`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.name}>{genre.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const GenreGrid = memo(GenreGridBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surfaceCard,
  },
  pressed: {
    opacity: 0.85,
  },
  name: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
  },
});
