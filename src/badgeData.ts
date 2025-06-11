import { Badge, Challenge } from './types';

export const allBadges: Badge[] = [
  {
    id: 'calm_creator',
    name: 'Calm Creator',
    description: 'Save a drawing',
    icon: '/badges/CalmCreator.png',
    colorIcon: '/badges/CalmCreator.png',
    earned: false
  },
  {
    id: 'mood_mapper',
    name: 'Mood Mapper',
    description: 'Complete 3 mood check-ins',
    icon: '/badges/MoodMapper.png',
    colorIcon: '/badges/MoodMapper.png',
    earned: false
  },
  {
    id: 'bounce_back',
    name: 'Bounce Back',
    description: 'Use undo 3 times',
    icon: '/badges/BounceBack.png',
    colorIcon: '/badges/BounceBack.png',
    earned: false
  },
  {
    id: 'reflecto_rookie',
    name: 'Reflecto Rookie',
    description: 'Send first chat message',
    icon: '/badges/ReflectoRookie.png',
    colorIcon: '/badges/ReflectoRookie.png',
    earned: false
  },
  {
    id: 'persistence',
    name: 'Persistence',
    description: 'Return 3 separate days',
    icon: '/badges/Persistence.png',
    colorIcon: '/badges/Persistence.png',
    earned: false
  },
  {
    id: 'stay_positive',
    name: 'Stay Positive',
    description: 'Select a happy emoji',
    icon: '/badges/StayPositive.png',
    colorIcon: '/badges/StayPositive.png',
    earned: false
  },
  {
    id: 'great_job',
    name: 'Great Job',
    description: 'Export a mood or chat PDF',
    icon: '/badges/GreatJob.png',
    colorIcon: '/badges/GreatJob.png',
    earned: false
  },
  {
    id: 'brave_voice',
    name: 'Brave Voice',
    description: 'Share an emotion using "because"',
    icon: '/badges/BraveVoice.png',
    colorIcon: '/badges/BraveVoice.png',
    earned: false
  },
  {
    id: 'what_if_explorer',
    name: 'What If Explorer',
    description: 'View 3 What If prompts',
    icon: '/badges/WhatIfExplorer.png',
    colorIcon: '/badges/WhatIfExplorer.png',
    earned: false
  },
  {
    id: 'truth_spotter',
    name: 'Truth Spotter',
    description: 'Send message containing "I realized"',
    icon: '/badges/TruthSpotter.png',
    colorIcon: '/badges/TruthSpotter.png',
    earned: false
  },
  {
    id: 'kind_heart',
    name: 'Kind Heart',
    description: 'Choose a love emoji',
    icon: '/badges/KindHeart.png',
    colorIcon: '/badges/KindHeart.png',
    earned: false
  },
  {
    id: 'super_star',
    name: 'Super Star',
    description: 'Earn all 18 badges',
    icon: '/badges/SuperStar.png',
    colorIcon: '/badges/SuperStar.png',
    earned: false
  },
  {
    id: 'goal_getter',
    name: 'Goal Getter',
    description: 'Complete 5 total challenges',
    icon: '/badges/GoalGetter.png',
    colorIcon: '/badges/GoalGetter.png',
    earned: false
  },
  {
    id: 'good_listener',
    name: 'Good Listener',
    description: 'View chat or mood history 3 times',
    icon: '/badges/GoodListener.png',
    colorIcon: '/badges/GoodListener.png',
    earned: false
  },
  {
    id: 'creative_spark',
    name: 'Creative Spark',
    description: 'Use 5+ colors in one drawing',
    icon: '/badges/CreativeSpark.png',
    colorIcon: '/badges/CreativeSpark.png',
    earned: false
  },
  {
    id: 'deep_thinker',
    name: 'Deep Thinker',
    description: 'Send chat message with 15+ words',
    icon: '/badges/DeepThinker.png',
    colorIcon: '/badges/DeepThinker.png',
    earned: false
  },
  {
    id: 'boost_buddy',
    name: 'Boost Buddy',
    description: 'Use "Read it to me" button',
    icon: '/badges/BoostBuddy.png',
    colorIcon: '/badges/BoostBuddy.png',
    earned: false
  },
  {
    id: 'focus_finder',
    name: 'Focus Finder',
    description: 'Complete a challenge without switching sections',
    icon: '/badges/FocusFinder.png',
    colorIcon: '/badges/FocusFinder.png',
    earned: false
  }
];

export const challengeDetails: Challenge[] = [
  {
    id: 'mood_mapper_challenge',
    title: 'Mood Mapper Challenge',
    description: 'Track your emotions today with emojis. How many different ones did you feel? What made them change?',
    badgeId: 'mood_mapper'
  },
  {
    id: 'creative_spark_challenge',
    title: 'Creative Spark Challenge',
    description: 'Create a colorful drawing using at least 5 different colors. Let your creativity shine!',
    badgeId: 'creative_spark'
  },
  {
    id: 'deep_thinker_challenge',
    title: 'Deep Thinker Challenge',
    description: 'Share a thoughtful message with ReflectoBot using at least 15 words. What\'s really on your mind?',
    badgeId: 'deep_thinker'
  },
  {
    id: 'what_if_explorer_challenge',
    title: 'What If Explorer Challenge',
    description: 'Explore your imagination by viewing 3 different What If prompts. Let your creativity run wild!',
    badgeId: 'what_if_explorer'
  },
  {
    id: 'brave_voice_challenge',
    title: 'Brave Voice Challenge',
    description: 'Share how you\'re feeling and explain why using the word "because". Your voice matters!',
    badgeId: 'brave_voice'
  }
];