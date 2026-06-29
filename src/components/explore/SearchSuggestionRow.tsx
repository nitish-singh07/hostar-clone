import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentItem, ContentKind } from '@/types/content';

type SearchSuggestionRowProps = {
  item: ContentItem;
  query: string;
  onPress: (item: ContentItem) => void;
};

const KIND_LABEL: Record<ContentKind, string> = {
  movie: 'Movie',
  series: 'Series',
  sport: 'Sport',
};

/** Splits `title` so the substring matching `query` can be visually highlighted. */
function highlight(title: string, query: string) {
  const q = query.trim();
  if (q.length === 0) return [{ text: title, match: false }];

  const lowerTitle = title.toLowerCase();
  const lowerQuery = q.toLowerCase();
  const start = lowerTitle.indexOf(lowerQuery);
  if (start === -1) return [{ text: title, match: false }];

  const end = start + q.length;
  return [
    { text: title.slice(0, start), match: false },
    { text: title.slice(start, end), match: true },
    { text: title.slice(end), match: false },
  ].filter((part) => part.text.length > 0);
}

function SearchSuggestionRowBase({ item, onPress, query }: SearchSuggestionRowProps) {
  const parts = highlight(item.title, query);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Ionicons name="search" size={16} color={palette.textMuted} />
      <Image source={{ uri: item.posterUrl }} style={styles.thumb} contentFit="cover" transition={150} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {parts.map((part, index) => (
            <Text key={index} style={part.match ? styles.match : undefined}>
              {part.text}
            </Text>
          ))}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {item.genre} • {item.year}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{KIND_LABEL[item.kind]}</Text>
      </View>
    </Pressable>
  );
}

export const SearchSuggestionRow = memo(SearchSuggestionRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pressed: {
    backgroundColor: palette.backgroundSecondary,
  },
  thumb: {
    width: 40,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: palette.surfaceCard,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  match: {
    color: palette.textPrimary,
    fontWeight: '900',
  },
  meta: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: palette.surfaceMuted,
  },
  badgeText: {
    color: palette.textMuted,
    fontSize: typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
