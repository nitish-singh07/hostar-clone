import type {
  AudioTrack,
  ContentItem,
  Episode,
  HomeData,
  PlaybackConfig,
  Profile,
  QualityOption,
  Season,
} from "@/types/content";

const backdrop = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const poster = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

const videos = {
  bigBuckBunny: "https://vjs.zencdn.net/v/oceans.mp4",
  elephantsDream: "https://vjs.zencdn.net/v/oceans.mp4",
  forBiggerBlazes: "https://vjs.zencdn.net/v/oceans.mp4",
  forBiggerEscapes: "https://vjs.zencdn.net/v/oceans.mp4",
  forBiggerJoy: "https://vjs.zencdn.net/v/oceans.mp4",
  forBiggerMarzipan: "https://vjs.zencdn.net/v/oceans.mp4",
};

export const contentItems: ContentItem[] = [
  {
    id: "mahabharat-ai",
    title: "Mahabharat",
    logoText: "MAHABHARAT",
    kind: "series",
    year: "2026",
    ageRating: "U/A 13+",
    languages: "7 Languages",
    genre: "Mythology",
    runtime: "52m",
    rating: "9.2",
    videoUrl: videos.bigBuckBunny,
    description:
      "A sweeping premium retelling of an ancient epic, staged with cinematic battles, family conflict, and a modern streaming scale.",
    posterUrl: poster("photo-1500530855697-b586d89ba3ee"),
    backdropUrl: backdrop("photo-1518709268805-4e9042af2176"),
    cast: ["Arjun Dev", "Mira Kapoor", "Raghav Rao", "Isha Menon"],
    tags: ["Epic", "Drama", "Premium"],
  },
  {
    id: "space-gen",
    title: "Space Gen: Chandrayaan",
    logoText: "SPACE GEN",
    kind: "series",
    year: "2026",
    ageRating: "U/A 13+",
    languages: "7 Languages",
    genre: "Drama",
    runtime: "48m",
    rating: "8.8",
    videoUrl: videos.elephantsDream,
    description:
      "A team of young engineers risks everything to build a lunar mission under pressure, scrutiny, and impossible deadlines.",
    posterUrl: poster("photo-1446776811953-b23d57bd21aa"),
    backdropUrl: backdrop("photo-1446776811953-b23d57bd21aa"),
    cast: ["Kabir Sethi", "Ananya Roy", "Meghna Das", "Vikram Nair"],
    tags: ["Hotstar Specials", "Science", "Drama"],
  },
  {
    id: "blue-derby",
    title: "Blue Derby Live",
    logoText: "BLUE DERBY",
    kind: "sport",
    year: "Live",
    ageRating: "Sports",
    languages: "Hindi + English",
    genre: "Cricket",
    runtime: "3h 10m",
    rating: "Live",
    videoUrl: videos.bigBuckBunny,
    description:
      "A high-pressure night fixture with playoff stakes, live commentary, tactical breakdowns, and post-match coverage.",
    posterUrl: poster("photo-1540747913346-19e32dc3e97e"),
    backdropUrl: backdrop("photo-1540747913346-19e32dc3e97e"),
    cast: ["Live Sports Desk", "Harsha Mehta", "Nikhil Anand"],
    tags: ["Live", "Cricket", "Sports"],
  },
  {
    id: "city-of-shadows",
    title: "City of Shadows",
    logoText: "CITY OF SHADOWS",
    kind: "series",
    year: "2025",
    ageRating: "A",
    languages: "5 Languages",
    genre: "Thriller",
    runtime: "42m",
    rating: "8.7",
    videoUrl: videos.forBiggerBlazes,
    description:
      "A suspended investigator returns to Mumbai after a string of connected disappearances exposes a deeper conspiracy.",
    posterUrl: poster("photo-1519608487953-e999c86e7455"),
    backdropUrl: backdrop("photo-1519608487953-e999c86e7455"),
    cast: ["Neeraj Sen", "Tara Bhatt", "Sahil Khanna"],
    tags: ["Thriller", "Crime", "Binge-worthy"],
    progress: 0.62,
    episodeLabel: "S2 E4",
  },
  {
    id: "kingdom-rush",
    title: "Kingdom Rush",
    logoText: "KINGDOM RUSH",
    kind: "movie",
    year: "2025",
    ageRating: "U/A 16+",
    languages: "4 Languages",
    genre: "Action",
    runtime: "2h 18m",
    rating: "8.4",
    videoUrl: videos.forBiggerEscapes,
    description:
      "An exiled royal guard must cross a burning frontier to stop a coup before it reaches the capital.",
    posterUrl: poster("photo-1500534314209-a25ddb2bd429"),
    backdropUrl: backdrop("photo-1500534314209-a25ddb2bd429"),
    cast: ["Rana Verma", "Devika Shah", "Adeel Khan"],
    tags: ["Action", "Adventure", "Blockbuster"],
  },
  {
    id: "night-manager",
    title: "The Night Manager",
    logoText: "NIGHT MANAGER",
    kind: "series",
    year: "2024",
    ageRating: "U/A 16+",
    languages: "7 Languages",
    genre: "Spy Thriller",
    runtime: "45m",
    rating: "8.9",
    videoUrl: videos.forBiggerJoy,
    description:
      "A hotel night manager is pulled into a dangerous intelligence operation against an arms network.",
    posterUrl: poster("photo-1507679799987-c73779587ccf"),
    backdropUrl: backdrop("photo-1507679799987-c73779587ccf"),
    cast: ["Aditya Rao", "Leena Thomas", "Rajat Bedi"],
    tags: ["Spy", "Thriller", "Hotstar Specials"],
    progress: 0.35,
    episodeLabel: "S1 E3",
  },
  {
    id: "river-hearts",
    title: "River Hearts",
    logoText: "RIVER HEARTS",
    kind: "series",
    year: "2025",
    ageRating: "U/A 13+",
    languages: "6 Languages",
    genre: "Romance",
    runtime: "40m",
    rating: "7.9",
    videoUrl: videos.forBiggerMarzipan,
    description:
      "Two families divided by business and old secrets are forced back together by an unexpected wedding.",
    posterUrl: poster("photo-1516589178581-6cd7833ae3b2"),
    backdropUrl: backdrop("photo-1516589178581-6cd7833ae3b2"),
    cast: ["Aarohi Iyer", "Kunal Mehra", "Farah Ali"],
    tags: ["Drama", "Romance", "Daily Show"],
    progress: 0.78,
    episodeLabel: "S1 E42",
  },
  {
    id: "wild-blue",
    title: "Wild Blue",
    logoText: "WILD BLUE",
    kind: "movie",
    year: "2024",
    ageRating: "U",
    languages: "English + Hindi",
    genre: "Nature",
    runtime: "1h 44m",
    rating: "8.2",
    videoUrl: videos.bigBuckBunny,
    description:
      "A cinematic nature documentary following coastlines, monsoons, reefs, and the communities that protect them.",
    posterUrl: poster("photo-1507525428034-b723cf961d3e"),
    backdropUrl: backdrop("photo-1507525428034-b723cf961d3e"),
    cast: ["Narrated by Riya Sen"],
    tags: ["Nature", "Family", "Documentary"],
  },
  {
    id: "stadium-stories",
    title: "Stadium Stories",
    logoText: "STADIUM STORIES",
    kind: "sport",
    year: "2025",
    ageRating: "U",
    languages: "3 Languages",
    genre: "Sports Doc",
    runtime: "6 Episodes",
    rating: "8.1",
    description:
      "Players, coaches, and fans revisit defining moments from modern Indian sports culture.",
    posterUrl: poster("photo-1461896836934-ffe607ba8211"),
    backdropUrl: backdrop("photo-1461896836934-ffe607ba8211"),
    cast: ["Sports Originals Team"],
    tags: ["Sports", "Documentary", "Original"],
  },
  {
    id: "family-table",
    title: "Family Table",
    logoText: "FAMILY TABLE",
    kind: "series",
    year: "2025",
    ageRating: "U/A 7+",
    languages: "8 Languages",
    genre: "Comedy",
    runtime: "2 Seasons",
    rating: "7.8",
    videoUrl: videos.bigBuckBunny,
    description:
      "A warm comedy about three generations trying to run a neighborhood restaurant without losing their minds.",
    posterUrl: poster("photo-1555396273-367ea4eb4db5"),
    backdropUrl: backdrop("photo-1555396273-367ea4eb4db5"),
    cast: ["Mohan Lal", "Rekha Pillai", "Simran Kaur"],
    tags: ["Comedy", "Family", "Feel-good"],
  },
  {
    id: "phantom-protocol",
    title: "Phantom Protocol",
    logoText: "PHANTOM PROTOCOL",
    kind: "movie",
    year: "2026",
    ageRating: "U/A 16+",
    languages: "5 Languages",
    genre: "Sci-Fi",
    runtime: "2h 06m",
    rating: "8.5",
    videoUrl: videos.forBiggerBlazes,
    description:
      "A rogue AI slips its containment and a fractured strike team has seventy-two hours to pull the plug before it rewrites the grid.",
    posterUrl: poster("photo-1451187580459-43490279c0fa"),
    backdropUrl: backdrop("photo-1451187580459-43490279c0fa"),
    cast: ["Veer Malhotra", "Sana Qureshi", "Dev Acharya"],
    tags: ["Sci-Fi", "Action", "Thriller"],
  },
  {
    id: "the-haunting-hour",
    title: "The Haunting Hour",
    logoText: "HAUNTING HOUR",
    kind: "movie",
    year: "2025",
    ageRating: "A",
    languages: "4 Languages",
    genre: "Horror",
    runtime: "1h 52m",
    rating: "7.6",
    videoUrl: videos.forBiggerEscapes,
    description:
      "A grieving family moves into a colonial bungalow where every clock stops at 3:33, and the house keeps its own residents.",
    posterUrl: poster("photo-1509248961158-e54f6934749c"),
    backdropUrl: backdrop("photo-1509248961158-e54f6934749c"),
    cast: ["Pooja Nair", "Imran Sheikh", "Tara Bose"],
    tags: ["Horror", "Supernatural", "Mystery"],
  },
  {
    id: "ninja-academy",
    title: "Ninja Academy",
    logoText: "NINJA ACADEMY",
    kind: "series",
    year: "2025",
    ageRating: "U/A 13+",
    languages: "Japanese + Hindi",
    genre: "Anime",
    runtime: "24 Episodes",
    rating: "8.6",
    videoUrl: videos.forBiggerJoy,
    description:
      "A clumsy outsider enrolls in an elite school of shadow warriors and discovers the rarest technique was hiding inside him all along.",
    posterUrl: poster("photo-1578632767115-351597cf2477"),
    backdropUrl: backdrop("photo-1578632767115-351597cf2477"),
    cast: ["Studio Kagebushin"],
    tags: ["Anime", "Action", "Adventure"],
  },
  {
    id: "tiny-explorers",
    title: "Tiny Explorers",
    logoText: "TINY EXPLORERS",
    kind: "series",
    year: "2026",
    ageRating: "U",
    languages: "9 Languages",
    genre: "Kids",
    runtime: "40 Episodes",
    rating: "8.0",
    videoUrl: videos.bigBuckBunny,
    description:
      "Three curious friends shrink down to explore backyards, tide pools, and beehives, learning a little science on every adventure.",
    posterUrl: poster("photo-1503454537195-1dcabb73ffb9"),
    backdropUrl: backdrop("photo-1503454537195-1dcabb73ffb9"),
    cast: ["Kids Originals Studio"],
    tags: ["Kids", "Educational", "Family"],
  },
  {
    id: "goal-machine",
    title: "Goal Machine Live",
    logoText: "GOAL MACHINE",
    kind: "sport",
    year: "Live",
    ageRating: "Sports",
    languages: "Hindi + English",
    genre: "Football",
    runtime: "2h 00m",
    rating: "Live",
    description:
      "Matchweek heats up with a top-of-the-table clash, live tactical cams, and full post-match analysis from the studio desk.",
    posterUrl: poster("photo-1431324155629-1a6deb1dec8d"),
    backdropUrl: backdrop("photo-1431324155629-1a6deb1dec8d"),
    cast: ["Live Sports Desk", "Arnav Roy", "Diego Fernandes"],
    tags: ["Live", "Football", "Sports"],
  },
  {
    id: "laugh-riot",
    title: "Laugh Riot",
    logoText: "LAUGH RIOT",
    kind: "movie",
    year: "2024",
    ageRating: "U/A 13+",
    languages: "6 Languages",
    genre: "Comedy",
    runtime: "2h 02m",
    rating: "7.5",
    videoUrl: videos.forBiggerMarzipan,
    description:
      "Two rival wedding planners are forced to share one impossible client, and every plan detonates into glorious chaos.",
    posterUrl: poster("photo-1543584756-8f40a802e14f"),
    backdropUrl: backdrop("photo-1543584756-8f40a802e14f"),
    cast: ["Rohan Kapoor", "Naina Sethi", "Bobby Grewal"],
    tags: ["Comedy", "Romance", "Feel-good"],
  },
  {
    id: "crown-of-ash",
    title: "Crown of Ash",
    logoText: "CROWN OF ASH",
    kind: "series",
    year: "2025",
    ageRating: "U/A 16+",
    languages: "7 Languages",
    genre: "Fantasy",
    runtime: "3 Seasons",
    rating: "9.0",
    videoUrl: videos.elephantsDream,
    description:
      "Five kingdoms fracture when the last dragon throne is left empty, and an exiled heir must choose between vengeance and the realm.",
    posterUrl: poster("photo-1518709268805-4e9042af2176"),
    backdropUrl: backdrop("photo-1518709268805-4e9042af2176"),
    cast: ["Ishaan Bhatt", "Maya Sinclair", "Roy Castellan"],
    tags: ["Fantasy", "Epic", "Drama"],
  },
  {
    id: "code-breakers",
    title: "Code Breakers",
    logoText: "CODE BREAKERS",
    kind: "movie",
    year: "2026",
    ageRating: "U/A 16+",
    languages: "Tamil + Telugu",
    genre: "Crime",
    runtime: "2h 24m",
    rating: "8.3",
    videoUrl: videos.forBiggerEscapes,
    description:
      "A disgraced cyber-cop and a teenage hacker form an uneasy alliance to bring down a syndicate that owns half the city.",
    posterUrl: poster("photo-1526374965328-7f61d4dc18c5"),
    backdropUrl: backdrop("photo-1526374965328-7f61d4dc18c5"),
    cast: ["Karthik Raja", "Divya Menon", "Suriya Pillai"],
    tags: ["Crime", "Thriller", "Action"],
  },
];

export const byId = (ids: string[]) =>
  ids.map((id) => contentItems.find((item) => item.id === id)!);

export const homeData: HomeData = {
  hero: byId(["mahabharat-ai", "space-gen", "blue-derby"]),
  sections: [
    {
      id: "continue-watching",
      title: "Continue Watching for Nitish",
      items: byId(["city-of-shadows", "night-manager", "river-hearts"]),
    },
    {
      id: "latest-trending",
      title: "Latest & Trending",
      items: byId([
        "kingdom-rush",
        "space-gen",
        "phantom-protocol",
        "family-table",
        "crown-of-ash",
        "wild-blue",
      ]),
    },
    {
      id: "sports",
      title: "Live & Upcoming Sports",
      items: byId(["blue-derby", "stadium-stories"]),
    },
    {
      id: "recommended",
      title: "Recommended For You",
      items: byId([
        "night-manager",
        "mahabharat-ai",
        "city-of-shadows",
        "river-hearts",
      ]),
    },
  ],
};

export const sportsData: HomeData = {
  hero: byId(["blue-derby", "stadium-stories"]),
  sections: [
    {
      id: "live-sports",
      title: "Live Now",
      items: byId(["blue-derby"]),
    },
    {
      id: "sports-originals",
      title: "Sports Originals",
      items: byId(["stadium-stories", "wild-blue"]),
    },
  ],
};

// ---------------------------------------------------------------------------
// Cosmetic track / quality options (mock-driven; see types/content.ts)
// ---------------------------------------------------------------------------

const QUALITY_OPTIONS: QualityOption[] = [
  { id: "auto", label: "Auto", height: 0, isCosmetic: true },
  { id: "1080p", label: "1080p", height: 1080, isCosmetic: true },
  { id: "720p", label: "720p", height: 720, isCosmetic: true },
  { id: "480p", label: "480p", height: 480, isCosmetic: true },
  { id: "240p", label: "240p", height: 240, isCosmetic: true },
];

const AUDIO_TRACKS: AudioTrack[] = [
  { id: "hi", label: "Hindi", language: "hi", isCosmetic: true },
  { id: "en", label: "English", language: "en", isCosmetic: true },
  { id: "ta", label: "Tamil", language: "ta", isCosmetic: true },
];

const SUBTITLE_TRACKS = [
  { id: "off", label: "Off", language: "", isCosmetic: true as const },
  { id: "en", label: "English", language: "en", isCosmetic: true as const },
  { id: "hi", label: "Hindi", language: "hi", isCosmetic: true as const },
];

function defaultConfig(contentId: string, isLive = false): PlaybackConfig {
  return {
    contentId,
    introStart: isLive ? undefined : 3,
    introEnd: isLive ? undefined : 9,
    isLive,
    qualityOptions: QUALITY_OPTIONS,
    audioTracks: AUDIO_TRACKS,
    subtitleTracks: SUBTITLE_TRACKS,
  };
}

export const playbackConfigs: Record<string, PlaybackConfig> =
  Object.fromEntries(
    contentItems.map((item) => [
      item.id,
      defaultConfig(item.id, item.kind === "sport"),
    ]),
  );

// ---------------------------------------------------------------------------
// Series → seasons → episodes (episodes reuse the sample MP4s round-robin)
// ---------------------------------------------------------------------------

const episodeVideos = [
  videos.bigBuckBunny,
  videos.elephantsDream,
  videos.forBiggerBlazes,
  videos.forBiggerEscapes,
  videos.forBiggerJoy,
  videos.forBiggerMarzipan,
];

const episodeThumbs = [
  "photo-1518709268805-4e9042af2176",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1485846234645-a62644f84728",
  "photo-1536440136628-849c177e76a1",
  "photo-1574375927938-d5a98e8ffe85",
  "photo-1497032205916-ac775f0649ae",
];

function buildSeason(
  seriesId: string,
  seasonNumber: number,
  episodeCount: number,
  synopsisPrefix: string,
): Season {
  const episodes: Episode[] = Array.from({ length: episodeCount }, (_, i) => {
    const episodeNumber = i + 1;
    const vIndex = (seasonNumber + i) % episodeVideos.length;
    return {
      id: `${seriesId}-s${seasonNumber}e${episodeNumber}`,
      seriesId,
      seasonNumber,
      episodeNumber,
      title: `Episode ${episodeNumber}`,
      description: `${synopsisPrefix} Episode ${episodeNumber} raises the stakes as alliances shift and the truth edges closer.`,
      thumbnailUrl: poster(episodeThumbs[vIndex]),
      runtimeLabel: `${38 + ((i * 4) % 18)}m`,
      videoUrl: episodeVideos[vIndex],
      introStart: 3,
      introEnd: 9,
    };
  });

  return {
    id: `${seriesId}-s${seasonNumber}`,
    seriesId,
    seasonNumber,
    title: `Season ${seasonNumber}`,
    episodes,
  };
}

export const seasonsBySeries: Record<string, Season[]> = {
  "mahabharat-ai": [
    buildSeason("mahabharat-ai", 1, 6, "The dynasty fractures."),
    buildSeason("mahabharat-ai", 2, 5, "War becomes inevitable."),
  ],
  "night-manager": [
    buildSeason("night-manager", 1, 5, "The operation deepens."),
    buildSeason("night-manager", 2, 4, "Cover identities fray."),
  ],
  "city-of-shadows": [
    buildSeason("city-of-shadows", 1, 6, "The case reopens."),
    buildSeason("city-of-shadows", 2, 6, "The conspiracy widens."),
  ],
};

export const profileData: Profile = {
  name: "Nitish Singh",
  plan: "Premium Annual Plan",
  phone: "+91 ••••• ••482",
  email: "nitish@example.com",
  memberSince: "Member since 2021",
  planStatus: "Active",
  planValidTill: "12 Mar 2027",
  storageUsedGb: 4.2,
  storageTotalGb: 32,
  dob: "1996-08-14",
  gender: "Male",
  avatarUrl: poster("photo-1507003211169-0a1dd7228f2d"),
  profiles: [
    {
      id: "nitish",
      name: "Nitish",
      avatarUrl: poster("photo-1507003211169-0a1dd7228f2d"),
    },
    {
      id: "anu",
      name: "Anu",
      avatarUrl: poster("photo-1494790108377-be9c29b29330"),
    },
    {
      id: "madhav",
      name: "Madhav",
      avatarUrl: poster("photo-1500648767791-00dcc994a43e"),
    },
    {
      id: "kids",
      name: "Kids",
      avatarUrl: poster("photo-1503454537195-1dcabb73ffb9"),
      isKids: true,
    },
    {
      id: "guest",
      name: "Guest",
      avatarUrl: poster("photo-1633332755192-727a05c4013d"),
    },
  ],
  watchlist: byId([
    "mahabharat-ai",
    "kingdom-rush",
    "night-manager",
    "crown-of-ash",
  ]),
  downloads: byId(["wild-blue", "family-table", "phantom-protocol"]),
  recentlyWatched: byId([
    "city-of-shadows",
    "night-manager",
    "river-hearts",
    "kingdom-rush",
    "space-gen",
  ]),
};
