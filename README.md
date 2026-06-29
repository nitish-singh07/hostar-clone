# JioHotstar Clone

A production-style React Native UI clone of the JioHotstar mobile app, built with Expo SDK 56, Expo Router, TypeScript, FlashList, Expo Image, Reanimated, NativeWind, and Tamagui.

The project is frontend-only. All content, profile data, loading states, and error states are powered by asynchronous mock services with simulated latency.

## Features

- Home feed with hero carousel, horizontal content rows, continue watching, trending, sports, and recommendations
- Details screen with cinematic hero artwork, metadata, CTA actions, cast, tags, and related content
- My Space profile screen with subscription summary, profile switcher, settings cards, watchlist, and downloads
- Sports tab with live-score treatment and sports content rows
- Bottom tab navigation plus native stack details navigation through Expo Router
- Dark JioHotstar-like theme tokens and CTA gradient
- Skeleton loading, empty states, error states, retry actions, and pull to refresh
- Typed mock API service layer and reusable UI components
- FlashList-powered horizontal carousels and Expo Image remote image loading

## Setup

```bash
npm install
npm start
```

Open the app from the Expo CLI output on Android or iOS. Android is the primary target; web support is not required for this assignment.

## Quality Checks

```bash
npx tsc --noEmit
npm run lint
npx expo export --platform android --output-dir /tmp/hotstart-export
```

## Architecture

The app uses `src/app` for Expo Router routes. The root layout provides the native stack, and `src/app/(tabs)` owns the bottom-tab experience. Details pages are pushed through `src/app/details/[id].tsx`.

Important folders:

- `src/services/api`: async service methods consumed by screens
- `src/services/mock`: realistic mock content and profile data
- `src/types`: shared TypeScript interfaces
- `src/theme`: palette, spacing, radius, typography, and Tamagui config
- `src/components`: reusable cards, carousels, skeletons, profile, state, and common UI components
- `src/hooks`: shared data-loading hooks

Screens do not import raw mock data directly. They call service methods and render loading, error, empty, and success states around those service results.

## Notes

The UI uses online-derived JioHotstar and Hotstar visual references, not official brand tokens. Poster and banner imagery is loaded from remote Unsplash URLs for assignment-safe mock content.
