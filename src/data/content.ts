import type { Session, GradientKey, SoundscapeId } from './types'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const NARRATORS = [
  'Maya Chen',
  'Daniel Osei',
  'Priya Anand',
  'Liam Sorensen',
  'Elena Vasquez',
  'Noah Whitfield',
]

const narratorFor = (seed: string) =>
  NARRATORS[Math.abs(hash(seed)) % NARRATORS.length]

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return h
}

interface ThemeDef {
  name: string
  description: string
  tags: string[]
  gradient: GradientKey
  soundscape: SoundscapeId
  level: Session['level']
}

const MEDITATION_THEMES: ThemeDef[] = [
  {
    name: 'Stress Relief',
    description: 'Release tension held in the body and mind, and return to a settled baseline.',
    tags: ['stress', 'calm'],
    gradient: 'lavender',
    soundscape: 'bowl',
    level: 'All Levels',
  },
  {
    name: 'Anxiety Ease',
    description: 'A gentle, grounding practice to soften anxious thoughts and steady the breath.',
    tags: ['anxiety', 'grounding'],
    gradient: 'ocean',
    soundscape: 'ocean',
    level: 'All Levels',
  },
  {
    name: 'Deep Focus',
    description: 'Sharpen attention and clear mental clutter before a demanding task.',
    tags: ['focus', 'productivity'],
    gradient: 'slate',
    soundscape: 'binaural-alpha',
    level: 'Intermediate',
  },
  {
    name: 'Gratitude',
    description: 'Bring to mind the people and moments you appreciate, and let that warmth settle in.',
    tags: ['gratitude', 'positivity'],
    gradient: 'gold',
    soundscape: 'chimes',
    level: 'Beginner',
  },
  {
    name: 'Self-Compassion',
    description: 'Speak to yourself with the same kindness you would offer a close friend.',
    tags: ['self-love', 'healing'],
    gradient: 'rose',
    soundscape: 'strings',
    level: 'All Levels',
  },
  {
    name: 'Body Scan',
    description: 'Move attention slowly through the body, releasing tightness one area at a time.',
    tags: ['relaxation', 'body'],
    gradient: 'midnight',
    soundscape: 'bowl',
    level: 'Beginner',
  },
  {
    name: 'Loving-Kindness',
    description: 'Extend warmth and goodwill outward — to loved ones, strangers, and yourself.',
    tags: ['compassion', 'connection'],
    gradient: 'rose',
    soundscape: 'chimes',
    level: 'All Levels',
  },
  {
    name: 'Morning Energy',
    description: 'Wake the body and set a clear, calm intention for the day ahead.',
    tags: ['morning', 'energy'],
    gradient: 'dawn',
    soundscape: 'morning',
    level: 'Beginner',
  },
  {
    name: 'Work Break Reset',
    description: 'A short pause to unhook from screens and return to work with a clearer head.',
    tags: ['work', 'reset'],
    gradient: 'slate',
    soundscape: 'whitenoise',
    level: 'All Levels',
  },
  {
    name: 'Walking Meditation',
    description: 'Bring mindful awareness to each step, breath, and sensation of movement.',
    tags: ['movement', 'mindfulness'],
    gradient: 'forest',
    soundscape: 'forest',
    level: 'Beginner',
  },
  {
    name: 'Mindfulness Basics',
    description: 'Foundational instruction in present-moment awareness — a great place to start.',
    tags: ['beginner', 'foundations'],
    gradient: 'ocean',
    soundscape: 'bowl',
    level: 'Beginner',
  },
  {
    name: 'Letting Go',
    description: 'Practice loosening your grip on what you cannot control.',
    tags: ['acceptance', 'release'],
    gradient: 'lavender',
    soundscape: 'rain',
    level: 'Intermediate',
  },
  {
    name: 'Inner Peace',
    description: 'Settle into a quiet, spacious stillness beneath the noise of the day.',
    tags: ['peace', 'stillness'],
    gradient: 'midnight',
    soundscape: 'space',
    level: 'All Levels',
  },
  {
    name: 'Confidence',
    description: 'Reconnect with your own steadiness before a big moment.',
    tags: ['confidence', 'courage'],
    gradient: 'ember',
    soundscape: 'binaural-alpha',
    level: 'Intermediate',
  },
  {
    name: 'Grief & Healing',
    description: 'A tender space to sit with loss and allow healing at its own pace.',
    tags: ['grief', 'healing'],
    gradient: 'midnight',
    soundscape: 'strings',
    level: 'All Levels',
  },
  {
    name: 'Emotional Balance',
    description: 'Meet strong emotions with curiosity instead of resistance.',
    tags: ['emotions', 'balance'],
    gradient: 'ocean',
    soundscape: 'river',
    level: 'Intermediate',
  },
  {
    name: 'Overthinking Relief',
    description: 'Quiet a racing mind and step out of looping thoughts.',
    tags: ['clarity', 'calm'],
    gradient: 'slate',
    soundscape: 'rain',
    level: 'All Levels',
  },
  {
    name: 'Patience',
    description: 'Cultivate the ability to wait, unclench, and trust the process.',
    tags: ['patience', 'acceptance'],
    gradient: 'forest',
    soundscape: 'forest',
    level: 'Intermediate',
  },
  {
    name: 'Forgiveness',
    description: 'Explore what it means to lay down a grudge, for your own sake.',
    tags: ['forgiveness', 'healing'],
    gradient: 'rose',
    soundscape: 'strings',
    level: 'Intermediate',
  },
  {
    name: 'Present Moment',
    description: 'Anchor fully into the sights, sounds, and sensations of right now.',
    tags: ['presence', 'awareness'],
    gradient: 'lavender',
    soundscape: 'chimes',
    level: 'Beginner',
  },
]

const DURATIONS = [5, 10, 20]

const meditations: Session[] = MEDITATION_THEMES.flatMap((theme) =>
  DURATIONS.map((min) => {
    const id = `meditation-${slugify(theme.name)}-${min}`
    return {
      id,
      type: 'meditation',
      title: theme.name,
      subtitle: `${min}-Minute Practice`,
      category: theme.name,
      narrator: narratorFor(id),
      description: theme.description,
      durationMin: min,
      level: theme.level,
      tags: theme.tags,
      soundscape: theme.soundscape,
      gradient: theme.gradient,
    } satisfies Session
  }),
)

interface SleepMeditationDef {
  name: string
  description: string
  soundscape: SoundscapeId
  gradient: GradientKey
}

const SLEEP_MEDITATIONS: SleepMeditationDef[] = [
  {
    name: 'Deep Sleep Relaxation',
    description: 'A slow-paced body-and-breath practice designed to ease you into sleep.',
    soundscape: 'bowl',
    gradient: 'midnight',
  },
  {
    name: 'Body Scan for Sleep',
    description: 'Release the day’s tension from head to toe before drifting off.',
    soundscape: 'rain',
    gradient: 'midnight',
  },
  {
    name: 'Sleepy Breathing',
    description: 'Extend your exhale and let your nervous system power down for the night.',
    soundscape: 'wind',
    gradient: 'midnight',
  },
  {
    name: 'Unwind & Let Go',
    description: 'Set down the to-do list and allow your mind to settle into rest.',
    soundscape: 'ocean',
    gradient: 'midnight',
  },
  {
    name: 'Starlit Stillness',
    description: 'A quiet, spacious meditation for a restful night’s sleep.',
    soundscape: 'space',
    gradient: 'midnight',
  },
]

const sleepMeditations: Session[] = SLEEP_MEDITATIONS.flatMap((def) =>
  [10, 25].map((min) => {
    const id = `sleep-med-${slugify(def.name)}-${min}`
    return {
      id,
      type: 'sleep',
      title: def.name,
      subtitle: `${min}-Minute Sleep Meditation`,
      category: 'Sleep Meditation',
      narrator: narratorFor(id),
      description: def.description,
      durationMin: min,
      level: 'All Levels',
      tags: ['sleep', 'relaxation'],
      soundscape: def.soundscape,
      gradient: def.gradient,
    } satisfies Session
  }),
)

interface SleepStoryDef {
  title: string
  description: string
  soundscape: SoundscapeId
  durationMin: number
}

const SLEEP_STORIES: SleepStoryDef[] = [
  {
    title: 'Moonlit Orchard',
    description: 'Wander through a quiet orchard under a silver moon as the night settles in.',
    soundscape: 'wind',
    durationMin: 32,
  },
  {
    title: 'The Slow Train to Nowhere',
    description: 'Rock gently along an overnight rail line, watching the dark countryside pass.',
    soundscape: 'train',
    durationMin: 40,
  },
  {
    title: 'Lighthouse at Dusk',
    description: 'Keep watch from a coastal lighthouse as waves roll in below.',
    soundscape: 'ocean',
    durationMin: 35,
  },
  {
    title: 'Rainy Cabin Retreat',
    description: 'Settle by the fire in a remote cabin while rain taps the windows.',
    soundscape: 'fire',
    durationMin: 38,
  },
  {
    title: 'Starlit Desert',
    description: 'Lie back on cooling sand and follow constellations across a desert sky.',
    soundscape: 'wind',
    durationMin: 30,
  },
  {
    title: 'The Sleepy Village',
    description: 'Drift through the winding, lantern-lit streets of a village readying for bed.',
    soundscape: 'crickets',
    durationMin: 33,
  },
  {
    title: 'Drifting Through Clouds',
    description: 'Float weightlessly above a soft blanket of clouds lit by a setting sun.',
    soundscape: 'space',
    durationMin: 28,
  },
  {
    title: 'Midnight Garden',
    description: 'Stroll a walled garden at midnight, fragrant with night-blooming jasmine.',
    soundscape: 'crickets',
    durationMin: 34,
  },
  {
    title: 'The Gentle Tide',
    description: 'Sit at the shoreline as the tide pulls slowly in and out, in and out.',
    soundscape: 'ocean',
    durationMin: 36,
  },
  {
    title: 'Snowfall in the Pines',
    description: 'Watch snow settle silently over a quiet pine forest as the world goes soft.',
    soundscape: 'wind',
    durationMin: 37,
  },
]

const sleepStories: Session[] = SLEEP_STORIES.map((s) => {
  const id = `sleep-story-${slugify(s.title)}`
  return {
    id,
    type: 'sleep',
    title: s.title,
    subtitle: 'Sleep Story',
    category: 'Sleep Story',
    narrator: narratorFor(id),
    description: s.description,
    durationMin: s.durationMin,
    level: 'All Levels',
    tags: ['sleep', 'story'],
    soundscape: s.soundscape,
    gradient: 'midnight',
  } satisfies Session
})

interface SoundDef {
  title: string
  description: string
  soundscape: SoundscapeId
  gradient: GradientKey
}

const SOUND_DEFS: SoundDef[] = [
  { title: 'Rain on Leaves', description: 'Steady rainfall through a leafy canopy.', soundscape: 'rain', gradient: 'ocean' },
  { title: 'Ocean Waves', description: 'Waves rolling onto an open shoreline.', soundscape: 'ocean', gradient: 'ocean' },
  { title: 'Forest Morning', description: 'Wind through trees with distant birdsong.', soundscape: 'forest', gradient: 'forest' },
  { title: 'Crackling Fireplace', description: 'A warm, popping wood fire.', soundscape: 'fire', gradient: 'ember' },
  { title: 'White Noise', description: 'Full-spectrum static for masking distraction.', soundscape: 'whitenoise', gradient: 'slate' },
  { title: 'Brown Noise', description: 'Deep, low-rumbling noise for heavy focus or sleep.', soundscape: 'brownnoise', gradient: 'slate' },
  { title: 'Pink Noise', description: 'Balanced, softer static — gentler than white noise.', soundscape: 'pinknoise', gradient: 'slate' },
  { title: 'Distant Thunderstorm', description: 'Rolling thunder far off beyond steady rain.', soundscape: 'thunder', gradient: 'midnight' },
  { title: 'Night Crickets', description: 'A chorus of crickets on a warm summer night.', soundscape: 'crickets', gradient: 'midnight' },
  { title: 'Wind Chimes', description: 'Soft chimes stirred by a gentle breeze.', soundscape: 'chimes', gradient: 'lavender' },
  { title: 'Flowing River', description: 'Water moving steadily over smooth stones.', soundscape: 'river', gradient: 'ocean' },
  { title: 'Cafe Ambience', description: 'Low murmurs and clinking cups for cozy focus.', soundscape: 'cafe', gradient: 'gold' },
  { title: 'Night Train Journey', description: 'The steady rhythm of a train rolling through the dark.', soundscape: 'train', gradient: 'slate' },
  { title: 'Deep Space Hum', description: 'A vast, resonant drone for deep stillness.', soundscape: 'space', gradient: 'midnight' },
  { title: 'Mountain Wind', description: 'A steady, open wind across high ridgelines.', soundscape: 'wind', gradient: 'slate' },
]

const sounds: Session[] = SOUND_DEFS.map((s) => {
  const id = `sound-${slugify(s.title)}`
  return {
    id,
    type: 'sound',
    title: s.title,
    subtitle: 'Soundscape',
    category: 'Soundscape',
    narrator: 'Ambient',
    description: s.description,
    durationMin: 30,
    level: 'All Levels',
    tags: ['soundscape', 'ambient'],
    soundscape: s.soundscape,
    gradient: s.gradient,
  } satisfies Session
})

interface MusicDef {
  title: string
  description: string
  soundscape: SoundscapeId
  gradient: GradientKey
  tags: string[]
}

const MUSIC_DEFS: MusicDef[] = [
  { title: 'Ambient Focus', description: 'Slow, evolving pads to support sustained concentration.', soundscape: 'lofi', gradient: 'slate', tags: ['focus'] },
  { title: 'Piano for Sleep', description: 'Sparse, unhurried piano phrases for winding down.', soundscape: 'piano', gradient: 'midnight', tags: ['sleep'] },
  { title: 'Zen Garden', description: 'Minimal tones inspired by a raked stone garden.', soundscape: 'bowl', gradient: 'forest', tags: ['calm'] },
  { title: 'Lo-fi Calm', description: 'Warm, textured lo-fi loops for a relaxed headspace.', soundscape: 'lofi', gradient: 'lavender', tags: ['relax'] },
  { title: 'Alpha Focus Waves', description: 'Binaural tones in the alpha range to support light, alert focus.', soundscape: 'binaural-alpha', gradient: 'sky', tags: ['binaural', 'focus'] },
  { title: 'Delta Deep Sleep Waves', description: 'Binaural tones in the delta range to support deep sleep.', soundscape: 'binaural-delta', gradient: 'midnight', tags: ['binaural', 'sleep'] },
  { title: 'Theta Meditation Waves', description: 'Binaural tones in the theta range for deep meditative states.', soundscape: 'binaural-theta', gradient: 'lavender', tags: ['binaural', 'meditation'] },
  { title: 'Uplifting Morning Melody', description: 'A bright, gentle melody to start the day with ease.', soundscape: 'morning', gradient: 'dawn', tags: ['morning'] },
  { title: 'Soft Strings for Relaxation', description: 'Warm string textures for unwinding after a long day.', soundscape: 'strings', gradient: 'rose', tags: ['relax'] },
  { title: 'Deep Space Ambient', description: 'Expansive drones for stillness and spacious thinking.', soundscape: 'space', gradient: 'midnight', tags: ['calm'] },
]

const music: Session[] = MUSIC_DEFS.map((m) => {
  const id = `music-${slugify(m.title)}`
  return {
    id,
    type: 'music',
    title: m.title,
    subtitle: 'Music',
    category: 'Music',
    narrator: 'Instrumental',
    description: m.description,
    durationMin: 20,
    level: 'All Levels',
    tags: ['music', ...m.tags],
    soundscape: m.soundscape,
    gradient: m.gradient,
  } satisfies Session
})

export const allSessions: Session[] = [
  ...meditations,
  ...sleepMeditations,
  ...sleepStories,
  ...sounds,
  ...music,
]

export const sessionsById = new Map(allSessions.map((s) => [s.id, s]))

export const meditationThemeNames = MEDITATION_THEMES.map((t) => t.name)

export const contentTypeLabels: Record<Session['type'], string> = {
  meditation: 'Meditation',
  sleep: 'Sleep',
  breathing: 'Breathing',
  sound: 'Soundscape',
  music: 'Music',
  course: 'Course',
}
