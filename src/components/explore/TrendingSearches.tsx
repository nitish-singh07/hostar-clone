import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/common/Chip';
import { SectionHeader } from '@/components/common/SectionHeader';
import { spacing } from '@/theme/tokens';

type TrendingSearchesProps = {
  items: string[];
  onSelect: (term: string) => void;
};

function TrendingSearchesBase({ items, onSelect }: TrendingSearchesProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="Trending Searches" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map((term) => (
          <Chip key={term} label={term} onPress={() => onSelect(term)} />
        ))}
      </ScrollView>
    </View>
  );
}

export const TrendingSearches = memo(TrendingSearchesBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
