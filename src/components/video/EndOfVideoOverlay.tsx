import { useEffect, useState } from 'react';

import { NextEpisodeCountdown } from '@/components/video/controls/NextEpisodeCountdown';
import { VideoEndScreen } from '@/components/video/controls/VideoEndScreen';
import { usePlayer } from '@/player/usePlayer';
import { getRelatedContent } from '@/services/api/content';
import type { ContentItem } from '@/types/content';

/**
 * Orchestrates end-of-video UX: an autoplay-next countdown when a next episode
 * exists, otherwise an end screen with replay + recommended titles. Listens to
 * `playToEnd` and resets when the source changes.
 */
export function EndOfVideoOverlay() {
  const { player, session, hasNext, playNext, replay, openTitle } = usePlayer();
  const [ended, setEnded] = useState(false);
  const [recommended, setRecommended] = useState<ContentItem[]>([]);

  useEffect(() => {
    const endSub = player.addListener('playToEnd', () => setEnded(true));
    const srcSub = player.addListener('sourceChange', () => setEnded(false));
    return () => {
      endSub.remove();
      srcSub.remove();
    };
  }, [player]);

  // Load recommendations lazily once the video ends with no next episode.
  useEffect(() => {
    if (ended && !hasNext && session && recommended.length === 0) {
      void getRelatedContent(session.item.id).then(setRecommended).catch(() => {});
    }
  }, [ended, hasNext, session, recommended.length]);

  if (!ended || !session) return null;

  if (hasNext) {
    const nextIndex = session.queue.findIndex((e) => e.id === session.episode?.id) + 1;
    const next = session.queue[nextIndex];
    return (
      <NextEpisodeCountdown
        episodeTitle={next ? `E${next.episodeNumber} · ${next.title}` : 'Next episode'}
        onPlay={() => {
          setEnded(false);
          void playNext();
        }}
        onCancel={() => setEnded(false)}
      />
    );
  }

  return (
    <VideoEndScreen
      title={session.item.title}
      recommended={recommended}
      onReplay={() => {
        setEnded(false);
        replay();
        player.play();
      }}
      onExit={() => setEnded(false)}
      onSelect={(item) => {
        setEnded(false);
        setRecommended([]);
        void openTitle({ item, episode: null, queue: [], isLive: item.kind === 'sport' });
      }}
    />
  );
}
