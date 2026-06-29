import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ContentCard } from '@/components/cards/ContentCard';
import { ContentRow } from '@/components/carousel/ContentRow';
import { Chip } from '@/components/common/Chip';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FeaturedCollectionCarousel } from '@/components/explore/FeaturedCollectionCarousel';
import { EMPTY_FILTERS, FilterSheet } from '@/components/explore/FilterSheet';
import { GenreGrid } from '@/components/explore/GenreGrid';
import { RecentSearches } from '@/components/explore/RecentSearches';
import { SearchBar } from '@/components/explore/SearchBar';
import { SearchSuggestionRow } from '@/components/explore/SearchSuggestionRow';
import { SportsBlock } from '@/components/explore/SportsBlock';
import { StudioRow } from '@/components/explore/StudioRow';
import { TrendingSearches } from '@/components/explore/TrendingSearches';
import { ExploreSkeleton } from '@/components/skeleton/ExploreSkeleton';
import { StateMessage } from '@/components/states/StateMessage';
import { useAsyncResource } from '@/hooks/use-async-resource';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { getExploreData, getSearchSuggestions, searchContent } from '@/services/api/explore';
import { palette, spacing, typography } from '@/theme/tokens';
import type { ContentItem, ContentKind } from '@/types/content';
import type { ExploreFilters, SortOption } from '@/types/explore';
import { openCollection } from '@/utils/content';

// ---------------------------------------------------------------------------
// Filtering / sorting helpers (mock-driven, client-side)
// ---------------------------------------------------------------------------

function hasActiveFilters(f: ExploreFilters): boolean {
  return (
    f.kinds.length > 0 ||
    f.genres.length > 0 ||
    f.languages.length > 0 ||
    f.years.length > 0 ||
    f.ageRatings.length > 0
  );
}

function matchesLanguage(item: ContentItem, languages: string[]): boolean {
  const value = item.languages.toLowerCase();
  // "N Languages" packs are treated as matching any selected language.
  if (value.includes('language')) return true;
  return languages.some((lang) => value.includes(lang.toLowerCase()));
}

function matchesYear(item: ContentItem, years: string[]): boolean {
  const numeric = Number(item.year);
  return years.some((year) => {
    if (year === 'Older') return Number.isFinite(numeric) && numeric < 2024;
    return item.year === year;
  });
}

function matchesGenre(item: ContentItem, genres: string[]): boolean {
  const genre = item.genre.toLowerCase();
  const tags = item.tags.map((tag) => tag.toLowerCase());
  return genres.some((g) => {
    const lower = g.toLowerCase();
    return genre.includes(lower) || tags.includes(lower);
  });
}

function applyFilters(items: ContentItem[], f: ExploreFilters): ContentItem[] {
  return items.filter((item) => {
    if (f.kinds.length > 0 && !f.kinds.includes(item.kind)) return false;
    if (f.genres.length > 0 && !matchesGenre(item, f.genres)) return false;
    if (f.languages.length > 0 && !matchesLanguage(item, f.languages)) return false;
    if (f.years.length > 0 && !matchesYear(item, f.years)) return false;
    if (f.ageRatings.length > 0 && !f.ageRatings.includes(item.ageRating)) return false;
    return true;
  });
}

function ratingValue(item: ContentItem): number {
  const n = Number(item.rating);
  return Number.isFinite(n) ? n : 0;
}

function sortItems(items: ContentItem[], sort: SortOption): ContentItem[] {
  const copy = [...items];
  switch (sort) {
    case 'popular':
    case 'rating':
      return copy.sort((a, b) => ratingValue(b) - ratingValue(a));
    case 'newest':
      return copy.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    case 'az':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'trending':
    default:
      return copy;
  }
}

const RESULT_GROUPS: { kind: ContentKind; title: string }[] = [
  { kind: 'movie', title: 'Movies' },
  { kind: 'series', title: 'Series' },
  { kind: 'sport', title: 'Sports' },
];

export default function SearchScreen() {
  const { data, error, isLoading, refresh } = useAsyncResource(getExploreData);
  const { addRecent, clearRecents, recents, removeRecent } = useRecentSearches();

  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState<ExploreFilters>(EMPTY_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [searching, setSearching] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  const trimmed = query.trim();
  const filtersActive = hasActiveFilters(filters);
  const inResultsView = committedQuery.length > 0;
  const inFilterOnlyView = trimmed.length === 0 && filtersActive;
  const searchMode = focused || trimmed.length > 0 || filtersActive;

  const openDetails = useCallback((item: ContentItem) => {
    Keyboard.dismiss();
    router.push(`/details/${item.id}`);
  }, []);

  const commit = useCallback(
    (term: string) => {
      const value = term.trim();
      if (value.length === 0) return;
      setQuery(value);
      setCommittedQuery(value);
      setSearching(true);
      addRecent(value);
      Keyboard.dismiss();
    },
    [addRecent],
  );

  const onChangeText = useCallback((text: string) => {
    setQuery(text);
    setCommittedQuery('');
  }, []);

  const onClear = useCallback(() => {
    setQuery('');
    setCommittedQuery('');
    inputRef.current?.focus();
  }, []);

  const exitSearch = useCallback(() => {
    setQuery('');
    setCommittedQuery('');
    setFilters(EMPTY_FILTERS);
    setSelectedCategory('all');
    setFocused(false);
    Keyboard.dismiss();
    inputRef.current?.blur();
  }, []);

  // Live suggestions while typing (before the query is committed). Stale
  // suggestions for an emptied/committed query are simply not rendered, so we
  // never need to clear them synchronously inside the effect.
  useEffect(() => {
    const term = debouncedQuery.trim();
    if (term.length === 0 || committedQuery.length > 0) return;
    let active = true;
    void getSearchSuggestions(term).then((items) => {
      if (active) setSuggestions(items);
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery, committedQuery]);

  // Grouped results once a query is committed (loading flag is raised in commit()).
  useEffect(() => {
    if (committedQuery.length === 0) return;
    let active = true;
    void searchContent(committedQuery).then((res) => {
      if (active) {
        setResults([...res.movies, ...res.series, ...res.sports]);
        setSearching(false);
      }
    });
    return () => {
      active = false;
    };
  }, [committedQuery]);

  // Result set for the grouped layout (search results or filter-only browse).
  const resultGroups = useMemo(() => {
    const base = inResultsView ? results : data ? data.sections.flatMap((s) => s.items) : [];
    const unique = Array.from(new Map(base.map((item) => [item.id, item])).values());
    const filtered = sortItems(applyFilters(unique, filters), filters.sort);
    return RESULT_GROUPS.map((group) => ({
      ...group,
      items: filtered.filter((item) => item.kind === group.kind),
    })).filter((group) => group.items.length > 0);
  }, [inResultsView, results, data, filters]);

  const resultsTotal = resultGroups.reduce((sum, group) => sum + group.items.length, 0);

  // Browse feed sections filtered by the selected quick-category.
  const browseSections = useMemo(() => {
    if (!data) return [];
    const category = data.quickCategories.find((c) => c.id === selectedCategory);
    if (!category?.kind) return data.sections;
    return data.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.kind === category.kind),
      }))
      .filter((section) => section.items.length > 0);
  }, [data, selectedCategory]);

  const onApplyFilters = useCallback((next: ExploreFilters) => {
    setFilters(next);
    setFilterSheetOpen(false);
  }, []);

  if (isLoading && !data) {
    return <ExploreSkeleton />;
  }

  if (error || !data) {
    return (
      <StateMessage
        title="Could not load Explore"
        message="There was an error loading the Explore experience."
        action="Retry"
        onAction={refresh}
      />
    );
  }

  return (
    <Screen withTopInset>
      {/* Sticky header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.heading}>Explore</Text>
          {searchMode ? (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={exitSearch}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          ) : null}
        </View>
        <SearchBar
          ref={inputRef}
          value={query}
          onChangeText={onChangeText}
          onSubmit={() => commit(query)}
          onFocus={() => setFocused(true)}
          onClear={onClear}
          onFilterPress={() => setFilterSheetOpen(true)}
          filterActive={filtersActive}
        />
      </View>

      {searchMode ? (
        <SearchModeView
          trimmed={trimmed}
          inResultsView={inResultsView}
          inFilterOnlyView={inFilterOnlyView}
          searching={searching}
          suggestions={suggestions}
          resultGroups={resultGroups}
          resultsTotal={resultsTotal}
          committedQuery={committedQuery}
          recents={recents}
          trendingSearches={data.trendingSearches}
          onSelectItem={openDetails}
          onCommit={commit}
          onRemoveRecent={removeRecent}
          onClearRecents={clearRecents}
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              tintColor={palette.hotstarBlue}
              refreshing={isLoading}
              onRefresh={refresh}
            />
          }>
          <TrendingSearches items={data.trendingSearches} onSelect={commit} />

          <View style={styles.categories}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}>
              {data.quickCategories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  active={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                />
              ))}
            </ScrollView>
          </View>

          <FeaturedCollectionCarousel
            collections={data.featuredCollections}
            onPress={(collection) => {
              const first = collection.items[0];
              if (first) openDetails(first);
            }}
          />

          {browseSections.map((section) => (
            <ContentRow
              key={section.id}
              section={section}
              onPressItem={openDetails}
              onSeeAll={() => openCollection(section.title, section.items)}
            />
          ))}

          <SportsBlock items={data.sports} onPress={openDetails} />
          <GenreGrid genres={data.genres} onPress={(genre) => commit(genre.name)} />

          <View style={styles.languages}>
            <SectionHeader title="Browse by Language" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}>
              {data.languages.map((language) => (
                <Chip key={language} label={language} onPress={() => commit(language)} />
              ))}
            </ScrollView>
          </View>

          <StudioRow studios={data.studios} onPress={(studio) => commit(studio.name)} />
        </ScrollView>
      )}

      <FilterSheet
        visible={filterSheetOpen}
        initialFilters={filters}
        genreOptions={data.genres.map((g) => g.name)}
        languageOptions={data.languages}
        onClose={() => setFilterSheetOpen(false)}
        onApply={onApplyFilters}
      />
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Search-mode body: recents/trending, live suggestions, or grouped results.
// ---------------------------------------------------------------------------

type ResultGroup = { kind: ContentKind; title: string; items: ContentItem[] };

type SearchModeViewProps = {
  trimmed: string;
  inResultsView: boolean;
  inFilterOnlyView: boolean;
  searching: boolean;
  suggestions: ContentItem[];
  resultGroups: ResultGroup[];
  resultsTotal: number;
  committedQuery: string;
  recents: string[];
  trendingSearches: string[];
  onSelectItem: (item: ContentItem) => void;
  onCommit: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearRecents: () => void;
};

function SearchModeView({
  committedQuery,
  inFilterOnlyView,
  inResultsView,
  onClearRecents,
  onCommit,
  onRemoveRecent,
  onSelectItem,
  recents,
  resultGroups,
  resultsTotal,
  searching,
  suggestions,
  trendingSearches,
  trimmed,
}: SearchModeViewProps) {
  const showResults = inResultsView || inFilterOnlyView;

  // Committed query (or filter-only browse): grouped results.
  if (showResults) {
    if (searching) {
      return (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      );
    }

    if (resultsTotal === 0) {
      return (
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.emptyWrap}>
          <StateMessage
            title="No results found"
            message="Try a different keyword or browse one of the trending searches below."
          />
          <TrendingSearches items={trendingSearches} onSelect={onCommit} />
        </ScrollView>
      );
    }

    return (
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        {inResultsView ? (
          <Text style={styles.resultsHeading}>
            Results for “{committedQuery}” ({resultsTotal})
          </Text>
        ) : (
          <Text style={styles.resultsHeading}>Filtered ({resultsTotal})</Text>
        )}
        {resultGroups.map((group) => (
          <View key={group.kind} style={styles.group}>
            <SectionHeader title={group.title} />
            <View style={styles.grid}>
              {group.items.map((item) => (
                <View key={item.id} style={styles.cardWrapper}>
                  <ContentCard item={item} onPress={onSelectItem} variant="poster" />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  // Actively typing: live suggestions.
  if (trimmed.length > 0) {
    return (
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.suggestionsContent}>
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <SearchSuggestionRow
              key={item.id}
              item={item}
              query={trimmed}
              onPress={onSelectItem}
            />
          ))
        ) : (
          <Text style={styles.hint}>No matches yet. Keep typing…</Text>
        )}
      </ScrollView>
    );
  }

  // Focused with an empty query: recent + trending searches.
  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}>
      <RecentSearches
        items={recents}
        onSelect={onCommit}
        onRemove={onRemoveRecent}
        onClearAll={onClearRecents}
      />
      <TrendingSearches items={trendingSearches} onSelect={onCommit} />
    </ScrollView>
  );
}

const screenPaddingBottom = 120;

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: palette.backgroundPrimary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: typography.title,
    fontWeight: '900',
  },
  cancel: {
    color: palette.hotstarBlue,
    fontSize: typography.body,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: screenPaddingBottom,
    gap: spacing.lg,
  },
  categories: {
    marginTop: -spacing.xs,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  languages: {
    gap: spacing.xs,
  },
  suggestionsContent: {
    paddingTop: spacing.sm,
    paddingBottom: screenPaddingBottom,
  },
  resultsHeading: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
    paddingHorizontal: spacing.md,
  },
  group: {
    gap: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  cardWrapper: {
    width: 132,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: screenPaddingBottom,
  },
  loadingText: {
    color: palette.textMuted,
    fontSize: typography.body,
    fontWeight: '600',
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    paddingBottom: screenPaddingBottom,
  },
  hint: {
    color: palette.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
