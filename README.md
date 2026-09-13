# Serenity — Meditation & Mindfulness

A meditation app with a large, browsable library of guided practices and calming
tools: meditations, sleep content, breathing exercises, soundscapes, music,
multi-day courses, and daily affirmations — all playable in the browser with
generated ambient audio (no external audio files required).

## What's inside

- **60 guided meditations** across 20 themes (Stress Relief, Anxiety Ease, Deep
  Focus, Gratitude, Self-Compassion, Body Scan, Loving-Kindness, and more), each
  in 5/10/20-minute lengths.
- **Sleep** — 10 sleep meditations and 10 narrated sleep stories.
- **10 breathing exercises** (Box Breathing, 4-7-8, Coherent Breathing, Alternate
  Nostril, and more) with an animated, timed breathing guide.
- **15 soundscapes** (rain, ocean, forest, fire, white/brown/pink noise,
  thunderstorm, crickets, chimes, river, cafe, train, wind, deep space).
- **10 music tracks**, including binaural alpha/theta/delta tones, ambient
  focus, lo-fi, piano, and strings.
- **6 multi-day courses** (7-Day Anxiety Relief, 21-Day Habit of Calm, 5-Day
  Better Sleep, and more) built from the meditation library.
- **48 daily affirmations** across 6 categories, in a shuffleable card view.
- Favorites, session history, and a daily streak — all persisted locally.

All ambient audio is synthesized live in the browser with the Web Audio API
(`src/audio/engine.ts`) — noise beds, filtered textures, scheduled chimes/plucks,
and binaural tones — so every session has real sound with no media assets to
license or ship.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build;
`npm run lint` runs oxlint.

## Structure

```
src/
  data/        content catalog, breathing patterns, courses, affirmations
  audio/       Web Audio ambient sound engine + React hook
  state/       favorites/history/streak context (localStorage-backed)
  components/  shared UI (nav shell, session cards, rows)
  pages/       Home, Library, Session player, Breathing player, Courses,
               Affirmations, Favorites, Profile
```
