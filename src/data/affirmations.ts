import type { AffirmationCard } from './types'

const AFFIRMATIONS_BY_CATEGORY: Record<string, string[]> = {
  Confidence: [
    'I trust myself to handle whatever comes my way.',
    'I am capable of learning anything I set my mind to.',
    'My voice and opinions have value.',
    'I move through challenges with steady courage.',
    'I am proud of how far I have come.',
    'I don’t need to be perfect to be worthy.',
    'I speak up for myself with clarity and calm.',
    'I trust the decisions I make.',
  ],
  'Self-Love': [
    'I am allowed to take up space.',
    'I treat myself with the same kindness I offer others.',
    'I am worthy of rest without earning it.',
    'My worth is not measured by my productivity.',
    'I accept myself exactly as I am today.',
    'I am doing the best I can with what I have.',
    'I forgive myself for past mistakes.',
    'I choose to be gentle with myself.',
  ],
  Abundance: [
    'There is enough time for what truly matters.',
    'Opportunities flow to me easily.',
    'I am grateful for what I already have.',
    'I welcome abundance in all its forms.',
    'My efforts are creating steady progress.',
    'Good things are unfolding for me right now.',
    'I am open to receiving support.',
    'I trust that things will work out.',
  ],
  Calm: [
    'I am safe in this moment.',
    'I can only control what is in front of me.',
    'My breath is an anchor I always carry with me.',
    'This feeling is temporary, and I will move through it.',
    'I release what I cannot control.',
    'I choose peace over worry.',
    'I am grounded, steady, and present.',
    'Right now, I have everything I need.',
  ],
  Motivation: [
    'Small steps still move me forward.',
    'I don’t have to feel ready to begin.',
    'Progress, not perfection.',
    'I am building momentum with every effort.',
    'Today, I choose to show up for myself.',
    'Discomfort now is growth for later.',
    'I am capable of finishing what I start.',
    'My consistency matters more than my speed.',
  ],
  Healing: [
    'Healing is not linear, and that is okay.',
    'I give myself permission to grieve at my own pace.',
    'I am gentle with the parts of me that are still healing.',
    'This pain does not define my whole story.',
    'I am learning to let go a little more each day.',
    'I honor how far I’ve come, even on hard days.',
    'It’s safe for me to feel what I feel.',
    'I am worthy of the same compassion I give others.',
  ],
}

export const affirmationCards: AffirmationCard[] = Object.entries(AFFIRMATIONS_BY_CATEGORY).flatMap(
  ([category, texts]) =>
    texts.map((text, i) => ({
      id: `affirmation-${category.toLowerCase().replace(/[^a-z]+/g, '-')}-${i}`,
      category,
      text,
    })),
)

export const affirmationCategories = Object.keys(AFFIRMATIONS_BY_CATEGORY)
