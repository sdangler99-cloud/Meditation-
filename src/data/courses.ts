import type { Course } from './types'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Build a course's daily session list by cycling through meditation themes at a given duration. */
const dailyPlan = (themes: string[], min: number) =>
  themes.map((t) => `meditation-${slugify(t)}-${min}`)

export const courses: Course[] = [
  {
    id: 'course-7-day-anxiety-relief',
    title: '7-Day Anxiety Relief',
    description: 'A one-week path to noticeably calmer days, blending grounding and breath-based practices.',
    category: 'Anxiety',
    gradient: 'ocean',
    sessionIds: dailyPlan(
      [
        'Mindfulness Basics',
        'Anxiety Ease',
        'Body Scan',
        'Anxiety Ease',
        'Letting Go',
        'Inner Peace',
        'Anxiety Ease',
      ],
      10,
    ),
  },
  {
    id: 'course-21-day-habit-of-calm',
    title: '21-Day Habit of Calm',
    description: 'Three weeks of daily practice to build a lasting meditation habit from the ground up.',
    category: 'Habit Building',
    gradient: 'lavender',
    sessionIds: [
      ...dailyPlan(
        [
          'Mindfulness Basics',
          'Stress Relief',
          'Present Moment',
          'Body Scan',
          'Gratitude',
          'Letting Go',
          'Inner Peace',
        ],
        5,
      ),
      ...dailyPlan(
        [
          'Mindfulness Basics',
          'Stress Relief',
          'Present Moment',
          'Body Scan',
          'Gratitude',
          'Letting Go',
          'Inner Peace',
        ],
        10,
      ),
      ...dailyPlan(
        [
          'Emotional Balance',
          'Self-Compassion',
          'Loving-Kindness',
          'Confidence',
          'Patience',
          'Forgiveness',
          'Inner Peace',
        ],
        10,
      ),
    ],
  },
  {
    id: 'course-5-day-better-sleep',
    title: '5-Day Better Sleep',
    description: 'A short reset for your bedtime routine, pairing wind-down meditations with sleep breathing.',
    category: 'Sleep',
    gradient: 'midnight',
    sessionIds: [
      'sleep-med-deep-sleep-relaxation-10',
      'sleep-med-body-scan-for-sleep-10',
      'sleep-med-sleepy-breathing-10',
      'sleep-med-unwind-let-go-10',
      'sleep-med-starlit-stillness-25',
    ],
  },
  {
    id: 'course-10-day-focus-reset',
    title: '10-Day Focus Reset',
    description: 'Train sustained attention with short daily sessions designed to sharpen concentration.',
    category: 'Focus',
    gradient: 'slate',
    sessionIds: [
      ...dailyPlan(['Mindfulness Basics', 'Deep Focus', 'Work Break Reset', 'Deep Focus', 'Present Moment'], 5),
      ...dailyPlan(['Deep Focus', 'Work Break Reset', 'Deep Focus', 'Overthinking Relief', 'Deep Focus'], 10),
    ],
  },
  {
    id: 'course-7-day-self-compassion',
    title: '7-Day Self-Compassion',
    description: 'A gentle week of practices to soften self-criticism and build a kinder inner voice.',
    category: 'Self-Compassion',
    gradient: 'rose',
    sessionIds: dailyPlan(
      [
        'Self-Compassion',
        'Loving-Kindness',
        'Forgiveness',
        'Self-Compassion',
        'Grief & Healing',
        'Gratitude',
        'Self-Compassion',
      ],
      10,
    ),
  },
  {
    id: 'course-14-day-stress-less',
    title: '14-Day Stress Less',
    description: 'Two weeks of progressively deeper practices to lower baseline stress and reactivity.',
    category: 'Stress',
    gradient: 'ember',
    sessionIds: [
      ...dailyPlan(
        ['Stress Relief', 'Body Scan', 'Overthinking Relief', 'Letting Go', 'Stress Relief', 'Patience', 'Inner Peace'],
        5,
      ),
      ...dailyPlan(
        ['Stress Relief', 'Emotional Balance', 'Overthinking Relief', 'Letting Go', 'Stress Relief', 'Patience', 'Inner Peace'],
        20,
      ),
    ],
  },
]
