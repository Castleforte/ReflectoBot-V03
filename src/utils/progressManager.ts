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
    currentChallengeIndex: 0
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

export const checkAndUpdateBadges = (progress: ReflectoBotProgress): { progress: ReflectoBotProgress; newBadges: string[] } => {
  const newBadges: string[] = [];
  const updatedBadges = { ...progress.badges };
  let updatedProgress = { ...progress };

  // Only check for badge if challenge is active
  if (progress.challengeActive && progress.currentChallengeIndex < badgeQueue.length) {
    const currentChallenge = badgeQueue[progress.currentChallengeIndex];
    
    // Check if the current challenge condition is met and badge not already earned
    if (!updatedBadges[currentChallenge.key] && currentChallenge.condition(progress)) {
      // Award the badge
      updatedBadges[currentChallenge.key] = true;
      newBadges.push(currentChallenge.key);
      
      // Update challenge state
      updatedProgress = {
        ...updatedProgress,
        challengeActive: false,
        currentChallengeIndex: progress.currentChallengeIndex + 1,
        challengesCompleted: progress.challengesCompleted + 1
      };
    }
  }

  // Check for super_star badge (all other badges earned)
  const earnedBadges = Object.keys(updatedBadges).filter(id => updatedBadges[id] && id !== 'super_star');
  if (earnedBadges.length >= 17 && !updatedBadges.super_star) {
    updatedBadges.super_star = true;
    if (!newBadges.includes('super_star')) {
      newBadges.push('super_star');
    }
  }

  const badgeCount = Object.keys(updatedBadges).filter(id => updatedBadges[id]).length;

  const finalProgress = {
    ...updatedProgress,
    badges: updatedBadges,
    badgeCount,
    earnedBadges: Object.keys(updatedBadges).filter(id => updatedBadges[id])
  };

  saveProgress(finalProgress);
  updateBadgeCounterDisplay(badgeCount);
  
  return { progress: finalProgress, newBadges };
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