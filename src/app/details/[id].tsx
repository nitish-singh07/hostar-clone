import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentRow } from '@/components/carousel/ContentRow';
import { GradientButton } from '@/components/common/GradientButton';
import { IconButton } from '@/components/common/IconButton';
import { EpisodeList } from '@/components/series/EpisodeList';
import { SeasonPicker } from '@/components/series/SeasonPicker';
import { ScreenSkeleton } from '@/components/skeleton/ScreenSkeleton';
import { StateMessage } from '@/components/states/StateMessage';
import { usePlayer } from '@/player/usePlayer';
import { getMovieDetails, getRelatedContent, getSeriesDetail } from '@/services/api/content';
import { progressStore } from '@/services/progress/continueWatching';
import { palette, spacing, typography } from '@/theme/tokens';
import type { ContentItem, Episode } from '@/types/content';
import { getMetaLine, openCollection } from '@/utils/content';
import { useAsyncResource } from '@/hooks/use-async-resource';

const width = Dimensions.get('window').width;

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contentId = Array.isArray(id) ? id[0] : id;
  const { openTitle } = usePlayer();

  const loadDetails = useCallback(() => getMovieDetails(contentId), [contentId]);
  const loadRelated = useCallback(() => getRelatedContent(contentId), [contentId]);
  const loadSeasons = useCallback(() => getSeriesDetail(contentId), [contentId]);
  const { data, error, isLoading } = useAsyncResource(loadDetails);
  const related = useAsyncResource(loadRelated);
  const seasonsResource = useAsyncResource(loadSeasons);

  const [activeSeason, setActiveSeason] = useState(0);
  // Bumped on focus so episode progress bars refresh after returning from play.
  const [, setFocusTick] = useState(0);
  useFocusEffect(useCallback(() => setFocusTick((n) => n + 1), []));

  const seasons = useMemo(() => seasonsResource.data ?? [], [seasonsResource.data]);
  const currentSeason = seasons[activeSeason];

  const openDetails = useCallback((item: ContentItem) => {
    router.push(`/details/${item.id}`);
  }, []);

  const playEpisode = useCallback(
    (episode: Episode, queue: Episode[]) => {
      if (!data) return;
      void openTitle({ item: data, episode, queue, isLive: false });
    },
    [data, openTitle],
  );

  const handleWatchNow = useCallback(() => {
    if (!data) return;
    // Series: resume the most recent in-progress episode, else start S1E1.
    if (data.kind === 'series' && seasons.length) {
      const all = seasons.flatMap((s) => s.episodes);
      const inProgress = all.find((ep) => {
        const rec = progressStore.get(data.id, ep.id);
        return rec && !rec.completed;
      });
      const target = inProgress ?? seasons[0].episodes[0];
      const queue = (seasons.find((s) => s.seasonNumber === target.seasonNumber) ?? seasons[0]).episodes;
      playEpisode(target, queue);
      return;
    }
    void openTitle({
      item: data,
      episode: null,
      queue: [],
      isLive: data.kind === 'sport',
    });
  }, [data, seasons, openTitle, playEpisode]);

  const episodeProgress = useCallback(
    (episode: Episode) => {
      if (!data) return undefined;
      const rec = progressStore.get(data.id, episode.id);
      if (!rec || rec.durationSeconds <= 0) return undefined;
      return rec.positionSeconds / rec.durationSeconds;
    },
    [data],
  );

  const currentEpisodeQueue = useMemo(() => currentSeason?.episodes ?? [], [currentSeason]);

  if (isLoading && !data) {
    return <ScreenSkeleton />;
  }

  if (error || !data) {
    return (
      <StateMessage
        title="Title not found"
        message="This title is missing from the mock catalog."
        action="Go Back"
        onAction={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={{ uri: data.backdropUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
          <LinearGradient
            colors={['rgba(11,11,15,0.1)', 'rgba(11,11,15,0.7)', palette.backgroundPrimary]}
            locations={[0.18, 0.62, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={styles.header}>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
          </SafeAreaView>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.heroContent}>
            <Text style={styles.brand}>hotstar specials</Text>
            <Text adjustsFontSizeToFit numberOfLines={2} style={styles.title}>
              {data.logoText}
            </Text>
            <Text numberOfLines={2} style={styles.meta}>
              {getMetaLine(data)} • {data.runtime}
            </Text>
            <View style={styles.actions}>
              <GradientButton style={styles.watchButton} onPress={handleWatchNow}>Watch Now</GradientButton>
              <IconButton icon="+" label="Add to watchlist" />
            </View>
          </Animated.View>
        </View>

        <View style={styles.body}>
          <View style={styles.ratingRow}>
            <InfoPill label="Rating" value={data.rating} />
            <InfoPill label="Type" value={data.kind.toUpperCase()} />
            <InfoPill label="Audio" value={data.languages} />
          </View>

          <Text style={styles.description}>{data.description}</Text>

          <View style={styles.tags}>
            {data.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Cast</Text>
          <Text style={styles.cast}>{data.cast.join('  •  ')}</Text>
        </View>

        {data.kind === 'series' && seasons.length ? (
          <View style={styles.episodesBlock}>
            <Text style={styles.episodesHeading}>Episodes</Text>
            <SeasonPicker seasons={seasons} activeIndex={activeSeason} onSelect={setActiveSeason} />
            <EpisodeList
              episodes={currentEpisodeQueue}
              progressFor={episodeProgress}
              onPlay={(index) => playEpisode(currentEpisodeQueue[index], currentEpisodeQueue)}
            />
          </View>
        ) : null}

        {related.data?.length ? (
          <ContentRow
            section={{ id: 'related', title: 'More Like This', items: related.data }}
            onPressItem={openDetails}
            onSeeAll={() => openCollection('More Like This', related.data ?? [])}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.backgroundPrimary,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    height: Math.min(width * 1.24, 540),
    justifyContent: 'flex-end',
    backgroundColor: palette.backgroundPrimary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  backText: {
    color: palette.textPrimary,
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '500',
  },
  heroContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  brand: {
    color: '#35D8E5',
    fontSize: typography.caption,
    fontWeight: '900',
  },
  title: {
    color: palette.textPrimary,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
  },
  meta: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  watchButton: {
    flex: 1,
  },
  body: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoPill: {
    flex: 1,
    minHeight: 64,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  infoLabel: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
  },
  description: {
    color: palette.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '800',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
  },
  cast: {
    color: palette.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '600',
  },
  episodesBlock: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  episodesHeading: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
    paddingHorizontal: spacing.md,
  },
});
