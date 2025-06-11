import { ReflectoBotProgress, Badge } from '../types';
import { allBadges } from '../badgeData';

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
    lastVisitDate: today
  };
};

export const loadProgress = (): ReflectoBotProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required fields exist
      const initial = getInitialProgress();
      return { ...initial, ...parsed };
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

export const checkBadgeEarned = (badgeId: string, progress: ReflectoBotProgress): boolean => {
  switch (badgeId) {
    case 'calm_creator':
      return progress.drawingsSaved >= 1;
    case 'mood_mapper':
      return progress.moodCheckInCount >= 3;
    case 'bounce_back':
      return progress.undoCount >= 3;
    case 'reflecto_rookie':
      return progress.chatMessageCount >= 1;
    case 'persistence':
      return progress.returnDays.length >= 3;
    case 'stay_positive':
      return progress.badges.stay_positive; // Set manually when happy emoji selected
    case 'great_job':
      return progress.pdfExportCount >= 1;
    case 'brave_voice':
      return progress.badges.brave_voice; // Set manually when "because" detected
    case 'what_if_explorer':
      return progress.whatIfPromptViews >= 3;
    case 'truth_spotter':
      return progress.badges.truth_spotter; // Set manually when "I realized" detected
    case 'kind_heart':
      return progress.badges.kind_heart; // Set manually when love emoji selected
    case 'super_star':
      return progress.badgeCount >= 17; // All other badges except this one
    case 'goal_getter':
      return progress.challengesCompleted >= 5;
    case 'good_listener':
      return progress.historyViews >= 3;
    case 'creative_spark':
      return progress.colorsUsedInDrawing >= 5;
    case 'deep_thinker':
      return progress.badges.deep_thinker; // Set manually when 15+ word message detected
    case 'boost_buddy':
      return progress.readItToMeUsed >= 1;
    case 'focus_finder':
      return progress.focusedChallengeCompleted;
    default:
      return false;
  }
};

export const checkAndUpdateBadges = (progress: ReflectoBotProgress): { progress: ReflectoBotProgress; newBadges: string[] } => {
  const newBadges: string[] = [];
  const updatedBadges = { ...progress.badges };

  allBadges.forEach(badge => {
    if (!updatedBadges[badge.id] && checkBadgeEarned(badge.id, progress)) {
      updatedBadges[badge.id] = true;
      newBadges.push(badge.id);
    }
  });

  const earnedBadges = Object.keys(updatedBadges).filter(id => updatedBadges[id]);
  const badgeCount = earnedBadges.length;

  const updatedProgress = {
    ...progress,
    badges: updatedBadges,
    badgeCount,
    earnedBadges
  };

  saveProgress(updatedProgress);
  return { progress: updatedProgress, newBadges };
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