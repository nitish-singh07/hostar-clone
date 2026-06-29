import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ContentCard } from '@/components/cards/ContentCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { spacing } from '@/theme/tokens';
import type { ContentItem, ContentSection } from '@/types/content';

type ContentRowProps = {
  section: ContentSection;
  onPressItem: (item: ContentItem) => void;
  onLongPressItem?: (item: ContentItem) => void;
  variant?: 'poster' | 'wide';
  onSeeAll?: () => void;
};

function ContentRowBase({ onLongPressItem, onPressItem, onSeeAll, section, variant }: ContentRowProps) {
  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => (
      <ContentCard
        item={item}
        onPress={onPressItem}
        onLongPress={onLongPressItem}
        variant={variant}
      />
    ),
    [onPressItem, onLongPressItem, variant],
  );

  return (
    <View style={styles.container}>
      <SectionHeader title={section.title} onSeeAll={onSeeAll} />
      <FlashList
        horizontal
        data={section.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export const ContentRow = memo(ContentRowBase);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  separator: {
    width: spacing.sm,
  },
});
