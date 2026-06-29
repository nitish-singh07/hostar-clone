import { StyleSheet, View } from 'react-native';

import { EpisodeRow } from '@/components/series/EpisodeRow';
import type { Episode } from '@/types/content';
import { spacing } from '@/theme/tokens';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: string;
  progressFor: (episode: Episode) => number | undefined;
  onPlay: (index: number) => void;
}

/**
 * Renders the episodes of the active season. Implemented as a mapped list
 * rather than a nested FlashList because it lives inside the details
 * ScrollView (nesting a vertical virtualized list inside a scroll view breaks
 * virtualization). Season episode counts are small, so this is the correct
 * trade-off; the home/details carousels still use FlashList.
 */
export function EpisodeList({ episodes, currentEpisodeId, progressFor, onPlay }: EpisodeListProps) {
  return (
    <View style={styles.list}>
      {episodes.map((episode, index) => (
        <EpisodeRow
          key={episode.id}
          episode={episode}
          progress={progressFor(episode)}
          isCurrent={episode.id === currentEpisodeId}
          onPlay={() => onPlay(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.xs },
});
