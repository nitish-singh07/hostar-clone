import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Chip } from '@/components/common/Chip';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentKind } from '@/types/content';
import type { ExploreFilters, SortOption } from '@/types/explore';

type FilterSheetProps = {
  visible: boolean;
  initialFilters: ExploreFilters;
  genreOptions: string[];
  languageOptions: string[];
  onClose: () => void;
  onApply: (filters: ExploreFilters) => void;
};

const KIND_OPTIONS: { value: ContentKind; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' },
  { value: 'sport', label: 'Sports' },
];

const YEAR_OPTIONS = ['2026', '2025', '2024', 'Older'];
const AGE_OPTIONS = ['U', 'U/A 7+', 'U/A 13+', 'U/A 16+', 'A'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A-Z' },
];

export const EMPTY_FILTERS: ExploreFilters = {
  kinds: [],
  genres: [],
  languages: [],
  years: [],
  ageRatings: [],
  sort: 'trending',
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterSheet({
  genreOptions,
  initialFilters,
  languageOptions,
  onApply,
  onClose,
  visible,
}: FilterSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Mounted fresh each open, so its draft seeds from the latest filters. */}
          {visible ? (
            <FilterForm
              initialFilters={initialFilters}
              genreOptions={genreOptions}
              languageOptions={languageOptions}
              onApply={onApply}
            />
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type FilterFormProps = {
  initialFilters: ExploreFilters;
  genreOptions: string[];
  languageOptions: string[];
  onApply: (filters: ExploreFilters) => void;
};

function FilterForm({ genreOptions, initialFilters, languageOptions, onApply }: FilterFormProps) {
  const [draft, setDraft] = useState<ExploreFilters>(initialFilters);

  return (
    <>
      <View style={styles.handle} />
      <Text style={styles.heading}>Filters</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Group title="Content Type">
              {KIND_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  active={draft.kinds.includes(option.value)}
                  onPress={() => setDraft((d) => ({ ...d, kinds: toggle(d.kinds, option.value) }))}
                />
              ))}
            </Group>

            <Group title="Genres">
              {genreOptions.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  active={draft.genres.includes(genre)}
                  onPress={() => setDraft((d) => ({ ...d, genres: toggle(d.genres, genre) }))}
                />
              ))}
            </Group>

            <Group title="Languages">
              {languageOptions.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  active={draft.languages.includes(language)}
                  onPress={() =>
                    setDraft((d) => ({ ...d, languages: toggle(d.languages, language) }))
                  }
                />
              ))}
            </Group>

            <Group title="Release Year">
              {YEAR_OPTIONS.map((year) => (
                <Chip
                  key={year}
                  label={year}
                  active={draft.years.includes(year)}
                  onPress={() => setDraft((d) => ({ ...d, years: toggle(d.years, year) }))}
                />
              ))}
            </Group>

            <Group title="Age Rating">
              {AGE_OPTIONS.map((age) => (
                <Chip
                  key={age}
                  label={age}
                  active={draft.ageRatings.includes(age)}
                  onPress={() =>
                    setDraft((d) => ({ ...d, ageRatings: toggle(d.ageRatings, age) }))
                  }
                />
              ))}
            </Group>

            <Group title="Sort By">
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  active={draft.sort === option.value}
                  onPress={() => setDraft((d) => ({ ...d, sort: option.value }))}
                />
              ))}
            </Group>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDraft({ ...EMPTY_FILTERS })}
              style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onApply(draft)}
              style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
    </>
  );
}

function Group({ children, title }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupChips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '85%',
    backgroundColor: palette.backgroundSecondary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.borderDefault,
    marginBottom: spacing.sm,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  groupChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  resetButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderDefault,
    backgroundColor: palette.backgroundPrimary,
  },
  resetText: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  applyButton: {
    flex: 2,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: palette.hotstarBlue,
  },
  applyText: {
    color: palette.textPrimary,
    fontSize: typography.body,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.85,
  },
});
