/*
 * expo-video's `VideoPlayer` (from `useVideoPlayer`) is an intentionally
 * mutable native handle: the documented API is to assign `player.volume`,
 * `player.currentTime`, `player.playbackRate`, etc. The React Compiler's
 * `react-hooks/immutability` rule flags these documented mutations as false
 * positives, so it is disabled for this file (all player mutation is funneled
 * through this provider's action callbacks).
 */
/* eslint-disable react-hooks/immutability */
import { router } from "expo-router";
import { useVideoPlayer, type VideoPlayer } from "expo-video";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";

import { MiniPlayer } from "@/components/video/MiniPlayer";
import type {
  AspectMode,
  CosmeticSelection,
  OpenTitleOptions,
  PlayerSession,
  SurfaceMode,
} from "@/player/playerTypes";
import { getPlaybackConfig } from "@/services/api/content";
import { progressStore } from "@/services/progress/continueWatching";
import type {
  AudioTrack,
  PlaybackConfig,
  QualityOption,
  SubtitleTrack,
} from "@/types/content";

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
const ASPECT_ORDER: AspectMode[] = ["contain", "cover", "fill"];
/** Mark a record completed once within this fraction of the end. */
const COMPLETE_THRESHOLD = 0.98;

export type PlayerContextValue = {
  player: VideoPlayer;
  session: PlayerSession | null;
  surface: SurfaceMode;
  aspect: AspectMode;
  playbackRate: number;
  cosmetic: CosmeticSelection;

  openTitle: (
    session: Omit<PlayerSession, "config">,
    options?: OpenTitleOptions,
  ) => Promise<void>;
  playEpisode: (index: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  hasNext: boolean;
  hasPrev: boolean;

  enterFullscreen: () => void;
  minimize: () => void;
  close: () => void;

  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  seekBy: (seconds: number) => void;
  replay: () => void;
  setVolume: (volume: number) => void;

  setPlaybackRate: (rate: number) => void;
  cycleAspect: () => void;
  setAspect: (mode: AspectMode) => void;
  setQuality: (quality: QualityOption | null) => void;
  setSubtitle: (subtitle: SubtitleTrack | null) => void;
  setAudio: (audio: AudioTrack | null) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);

const EMPTY_COSMETIC: CosmeticSelection = {
  quality: null,
  subtitle: null,
  audio: null,
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useVideoPlayer(null, (p) => {
    p.timeUpdateEventInterval = 0.5;
    p.keepScreenOnWhilePlaying = true;
  });

  const [session, setSession] = useState<PlayerSession | null>(null);
  const [surface, setSurface] = useState<SurfaceMode>("hidden");
  const [aspect, setAspectState] = useState<AspectMode>("contain");
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [cosmetic, setCosmetic] = useState<CosmeticSelection>(EMPTY_COSMETIC);

  // Seek that must be applied once the new source reports its duration.
  const pendingSeekRef = useRef(0);
  const lastWriteRef = useRef(0);
  const sessionRef = useRef<PlayerSession | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Apply a resume position only after the source is actually loaded.
  useEffect(() => {
    const sub = player.addListener("sourceLoad", () => {
      if (pendingSeekRef.current > 0) {
        player.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = 0;
      }
    });
    return () => sub.remove();
  }, [player]);

  // Throttled progress persistence (Continue Watching).
  useEffect(() => {
    const persist = (force: boolean) => {
      const current = sessionRef.current;
      if (!current || current.isLive) return;
      const duration = player.duration;
      const position = player.currentTime;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const now = Date.now();
      if (!force && now - lastWriteRef.current < 5000) return;
      lastWriteRef.current = now;

      void progressStore.upsert({
        contentId: current.item.id,
        episodeId: current.episode?.id,
        positionSeconds: position,
        durationSeconds: duration,
        updatedAt: now,
        completed: position / duration >= COMPLETE_THRESHOLD,
      });
    };

    const timeSub = player.addListener("timeUpdate", () => persist(false));
    const playingSub = player.addListener("playingChange", ({ isPlaying }) => {
      if (!isPlaying) persist(true);
    });
    const endSub = player.addListener("playToEnd", () => persist(true));
    const appStateSub = AppState.addEventListener("change", (next) => {
      if (next !== "active") persist(true);
    });

    return () => {
      timeSub.remove();
      playingSub.remove();
      endSub.remove();
      appStateSub.remove();
    };
  }, [player]);

  const applyConfigDefaults = useCallback((config: PlaybackConfig | null) => {
    if (!config) {
      setCosmetic(EMPTY_COSMETIC);
      return;
    }
    setCosmetic({
      quality: config.qualityOptions[0] ?? null,
      audio:
        config.audioTracks.find((a) => a.id !== "off") ??
        config.audioTracks[0] ??
        null,
      subtitle:
        config.subtitleTracks.find((s) => s.id === "off") ??
        config.subtitleTracks[0] ??
        null,
    });
  }, []);

  const loadSource = useCallback(
    async (url: string | undefined, startAt: number, autoPlay: boolean) => {
      pendingSeekRef.current = startAt > 1 ? startAt : 0;
      player.playbackRate = playbackRate;
      await player.replaceAsync(url ?? null);
      if (autoPlay) {
        player.play();
      }
    },
    [player, playbackRate],
  );

  const openTitle = useCallback<PlayerContextValue["openTitle"]>(
    async (next, options = {}) => {
      const episode = options.episode ?? next.episode ?? null;
      const queue = options.queue ?? next.queue ?? [];
      const config =
        options.config ??
        (await getPlaybackConfig(next.item.id).catch(() => null));

      const url = episode?.videoUrl ?? next.item.videoUrl;
      const resumeFrom =
        options.startAt ??
        progressStore.get(next.item.id, episode?.id)?.positionSeconds ??
        0;

      applyConfigDefaults(config);
      setSession({ ...next, episode, queue, config });
      setSurface("fullscreen");
      router.push("/player");

      await loadSource(url, resumeFrom, options.autoPlay ?? true);
    },
    [applyConfigDefaults, loadSource],
  );

  const playEpisode = useCallback<PlayerContextValue["playEpisode"]>(
    async (index) => {
      const current = sessionRef.current;
      if (!current) return;
      const episode = current.queue[index];
      if (!episode) return;
      const resumeFrom =
        progressStore.get(current.item.id, episode.id)?.positionSeconds ?? 0;
      setSession({ ...current, episode });
      await loadSource(episode.videoUrl, resumeFrom, true);
    },
    [loadSource],
  );

  const currentEpisodeIndex = useMemo(() => {
    if (!session?.episode) return -1;
    return session.queue.findIndex((e) => e.id === session.episode?.id);
  }, [session]);

  const hasNext =
    currentEpisodeIndex >= 0 &&
    currentEpisodeIndex < (session?.queue.length ?? 0) - 1;
  const hasPrev = currentEpisodeIndex > 0;

  const playNext = useCallback(async () => {
    if (hasNext) await playEpisode(currentEpisodeIndex + 1);
  }, [hasNext, currentEpisodeIndex, playEpisode]);

  const playPrev = useCallback(async () => {
    if (hasPrev) await playEpisode(currentEpisodeIndex - 1);
  }, [hasPrev, currentEpisodeIndex, playEpisode]);

  const enterFullscreen = useCallback(() => {
    setSurface("fullscreen");
    router.push("/player");
  }, []);

  const minimize = useCallback(() => {
    setSurface("mini");
    if (router.canGoBack()) router.back();
  }, []);

  const close = useCallback(() => {
    player.pause();
    setSurface("hidden");
    setSession(null);
    void player.replaceAsync(null);
    if (router.canGoBack()) router.back();
  }, [player]);

  const togglePlay = useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  const seekTo = useCallback(
    (seconds: number) => {
      const clamped = Math.max(
        0,
        Math.min(seconds, player.duration || seconds),
      );
      player.currentTime = clamped;
    },
    [player],
  );

  const seekBy = useCallback(
    (seconds: number) => player.seekBy(seconds),
    [player],
  );
  const replay = useCallback(() => player.replay(), [player]);
  const setVolume = useCallback(
    (volume: number) => {
      player.volume = Math.max(0, Math.min(1, volume));
    },
    [player],
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      player.playbackRate = rate;
      setPlaybackRateState(rate);
    },
    [player],
  );

  const setAspect = useCallback((mode: AspectMode) => setAspectState(mode), []);
  const cycleAspect = useCallback(() => {
    setAspectState(
      (prev) =>
        ASPECT_ORDER[(ASPECT_ORDER.indexOf(prev) + 1) % ASPECT_ORDER.length],
    );
  }, []);

  const setQuality = useCallback(
    (quality: QualityOption | null) => setCosmetic((c) => ({ ...c, quality })),
    [],
  );
  const setSubtitle = useCallback(
    (subtitle: SubtitleTrack | null) =>
      setCosmetic((c) => ({ ...c, subtitle })),
    [],
  );
  const setAudio = useCallback(
    (audio: AudioTrack | null) => setCosmetic((c) => ({ ...c, audio })),
    [],
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      player,
      session,
      surface,
      aspect,
      playbackRate,
      cosmetic,
      openTitle,
      playEpisode,
      playNext,
      playPrev,
      hasNext,
      hasPrev,
      enterFullscreen,
      minimize,
      close,
      togglePlay,
      seekTo,
      seekBy,
      replay,
      setVolume,
      setPlaybackRate,
      cycleAspect,
      setAspect,
      setQuality,
      setSubtitle,
      setAudio,
    }),
    [
      player,
      session,
      surface,
      aspect,
      playbackRate,
      cosmetic,
      openTitle,
      playEpisode,
      playNext,
      playPrev,
      hasNext,
      hasPrev,
      enterFullscreen,
      minimize,
      close,
      togglePlay,
      seekTo,
      seekBy,
      replay,
      setVolume,
      setPlaybackRate,
      cycleAspect,
      setAspect,
      setQuality,
      setSubtitle,
      setAudio,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <MiniPlayer />
    </PlayerContext.Provider>
  );
}

export { PLAYBACK_RATES };
