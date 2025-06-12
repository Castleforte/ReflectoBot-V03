import { ReflectoBotProgress, Badge } from '../types';
import { allBadges, badgeQueue } from '../badgeData';

const STORAGE_KEY = 'reflectobot_progress';

export const getInitialProgress = (): ReflectoBotProgress => {
  const today = new Date().toDateString();
  return {
    badges: Object.fromEntries(allBadges.map(badge => [badge.id, false])),
    badgeCount: 0,
    earnedBadges: [],
    moodCheckInCount: 0,
    chatMessageCount: 0,
    undoCount: 0,
    returnDays: [today],
    pdfExportCount: 0,
    whatIfPromptViews: 0,
    historyViews: 0,
    drawingsSaved: 0,
    colorsUsedInDrawing: 0,
    challengesCompleted: 0,
    readItToMeUsed: 0,
    focusedChallengeCompleted: false,
    lastVisitDate: today,
    challengeActive: false,
    currentChallengeIndex: 0,
    stayPositiveMessageCount: 0
  };
};

export const loadProgress = (): ReflectoBotProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required fields exist with backward compatibility
      const initial = getInitialProgress();
      return { 
        ...initial, 
        ...parsed,
        // Ensure new fields are properly initialized
        challengeActive: parsed.challengeActive ?? false,
        currentChallengeIndex: parsed.currentChallengeIndex ?? 0,
        stayPositiveMessageCount: parsed.stayPositiveMessageCount ?? 0
      };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return getInitialProgress();
};

export const saveProgress = (progress: ReflectoBotProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateProgress = (updates: Partial<ReflectoBotProgress>): ReflectoBotProgress => {
  const current = loadProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
};

// New badge checking system with gatekeeping rules
export const checkAndUpdateBadges = (triggeredBadgeId: string, progress: ReflectoBotProgress): string | null => {
  // Only award badges if challenge is active
  if (!progress.challengeActive) {
    return null;
  }

  // Get the expected badge based on current challenge index
  const expectedBadgeId = badgeQueue[progress.currentChallengeIndex];
  
  // Only award if the triggered badge matches the expected badge
  if (triggeredBadgeId !== expectedBadgeId) {
    return null;
  }

  // Check if badge condition is met
  let conditionMet = false;
  
  switch (triggeredBadgeId) {
    case 'calm_creator':
      conditionMet = progress.drawingsSaved >= 1;
      break;
    case 'mood_mapper':
      conditionMet = progress.moodCheckInCount >= 3;
      break;
    case 'bounce_back':
      conditionMet = progress.undoCount >= 3;
      break;
    case 'reflecto_rookie':
      // Special handling for Reflecto Rookie - checked in App.tsx
      conditionMet = progress.chatMessageCount >= 2;
      break;
    case 'focus_finder':
      conditionMet = progress.focusedChallengeCompleted;
      break;
    case 'stay_positive':
      conditionMet = progress.stayPositiveMessageCount >= 3;
      break;
    case 'great_job':
      conditionMet = progress.pdfExportCount >= 1;
      break;
    case 'brave_voice':
      conditionMet = progress.badges.brave_voice;
      break;
    case 'what_if_explorer':
      conditionMet = progress.whatIfPromptViews >= 3;
      break;
    case 'truth_spotter':
      conditionMet = progress.badges.truth_spotter;
      break;
    case 'kind_heart':
      conditionMet = progress.badges.kind_heart;
      break;
    case 'super_star':
      conditionMet = progress.badgeCount >= 17;
      break;
    case 'goal_getter':
      conditionMet = progress.challengesCompleted >= 5;
      break;
    case 'good_listener':
      conditionMet = progress.historyViews >= 3;
      break;
    case 'creative_spark':
      conditionMet = progress.colorsUsedInDrawing >= 5;
      break;
    case 'deep_thinker':
      conditionMet = progress.badges.deep_thinker;
      break;
    case 'boost_buddy':
      conditionMet = progress.readItToMeUsed >= 1;
      break;
    case 'resilient':
      conditionMet = progress.returnDays.length >= 3;
      break;
    default:
      return null;
  }

  // If condition is met and badge not already earned
  if (conditionMet && !progress.badges[triggeredBadgeId]) {
    // Award the badge
    const updatedBadges = { ...progress.badges, [triggeredBadgeId]: true };
    const newBadgeCount = progress.badgeCount + 1;
    
    // For focus_finder and stay_positive badges, don't update challenge state here
    // This will be handled in App.tsx when the completion screen is displayed
    if (triggeredBadgeId === 'focus_finder' || triggeredBadgeId === 'stay_positive') {
      const updatedProgress = {
        ...progress,
        badges: updatedBadges,
        badgeCount: newBadgeCount,
        earnedBadges: [...progress.earnedBadges, triggeredBadgeId]
      };
      saveProgress(updatedProgress);
      updateBadgeCounterDisplay(newBadgeCount);
      return triggeredBadgeId;
    } else {
      // For all other badges, update challenge state immediately
      const updatedProgress = {
        ...progress,
        badges: updatedBadges,
        badgeCount: newBadgeCount,
        earnedBadges: [...progress.earnedBadges, triggeredBadgeId],
        challengeActive: false,
        currentChallengeIndex: Math.min(progress.currentChallengeIndex + 1, badgeQueue.length - 1),
        challengesCompleted: progress.challengesCompleted + 1
      };
      saveProgress(updatedProgress);
      updateBadgeCounterDisplay(newBadgeCount);
      return triggeredBadgeId;
    }
  }

  return null;
};

export const updateBadgeCounterDisplay = (badgeCount?: number): void => {
  const count = badgeCount ?? loadProgress().badgeCount;
  const counterElements = document.querySelectorAll('[id="badge-counter"]');
  counterElements.forEach(element => {
    if (element) {
      element.textContent = `${count} of 18 Collected!`;
    }
  });
};

export const trackDailyVisit = (): ReflectoBotProgress => {
  const progress = loadProgress();
  const today = new Date().toDateString();
  
  if (progress.lastVisitDate !== today) {
    const returnDays = [...new Set([...progress.returnDays, today])];
    return updateProgress({
      lastVisitDate: today,
      returnDays
    });
  }
  
  return progress;
};

export const exportProgress = (): void => {
  const progress = loadProgress();
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reflectobot-progress.json';
  link.click();
  
  URL.revokeObjectURL(url);
};

export const importProgress = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target?.result as string);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        window.location.reload(); // Reload to reflect changes
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};