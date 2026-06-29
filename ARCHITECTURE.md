# Architecture

## App Structure

The app uses Expo SDK 56 with Expo Router:

- `src/app/_layout.tsx` defines the root stack.
- `src/app/(tabs)/_layout.tsx` defines bottom tabs.
- `src/app/details/[id].tsx` is the stack-pushed details route.

Expo Router is backed by React Navigation, so the app keeps the existing Expo v56 routing foundation while satisfying the bottom tab and native stack navigation requirements.

## Data Flow

Screens load data through `src/services/api/content.ts`.

The API layer simulates network latency and reads from typed mock data in `src/services/mock/content.ts`. Screens never import raw mock objects directly, which keeps UI code close to a production service boundary.

## UI System

Shared UI lives in `src/components`:

- `cards`: hero and poster/wide content cards
- `carousel`: FlashList content rows
- `common`: screen shell, buttons, icon buttons, section headers
- `profile`: profile-specific reusable UI
- `skeleton`: animated loading placeholders
- `states`: empty and error state messaging

Theme tokens live in `src/theme/tokens.ts`. Tamagui is configured in `src/theme/tamagui.config.ts`, and NativeWind is configured through `tailwind.config.js`.

## Performance

- FlashList is used for horizontal content rows.
- Content cards, rows, and hero banners are memoized.
- Callbacks are stabilized with `useCallback` on screen-level item actions.
- Expo Image handles remote images with transitions.
- Reanimated powers skeleton shimmer opacity and screen content entrance animations.

## Assignment Scope

The app is frontend-only. Authentication, real backend integration, protected media playback, and production CDN assets are out of scope.
