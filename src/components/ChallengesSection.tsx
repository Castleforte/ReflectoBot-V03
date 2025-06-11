import React, { useState, useEffect } from 'react';
import NextChallengePage from './NextChallengePage';
import ChallengeCompletePage from './ChallengeCompletePage';
import MyBadgesPage from './MyBadgesPage';
import { loadProgress, checkAndUpdateBadges, updateProgress } from '../utils/progressManager';
import { challengeDetails } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengesSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
}

type ChallengeScreen = 'next-challenge' | 'challenge-complete' | 'my-badges';

function ChallengesSection({ onClose, setRobotSpeech }: ChallengesSectionProps) {
  const [currentScreen, setCurrentScreen] = useState<ChallengeScreen>('next-challenge');
  const [progress, setProgress] = useState<ReflectoBotProgress>(loadProgress());
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null);

  useEffect(() => {
    // Check for newly earned badges when component mounts
    const { progress: updatedProgress, newBadges } = checkAndUpdateBadges(progress);
    setProgress(updatedProgress);
    
    if (newBadges.length > 0) {
      setNewlyEarnedBadge(newBadges[0]); // Show first new badge
      setCurrentScreen('challenge-complete');
    }
  }, []);

  const handleStartChallenge = () => {
    const currentChallenge = challengeDetails[currentChallengeIndex];
    
    // Mark that user started a focused challenge
    updateProgress({ focusedChallengeCompleted: false });
    
    // Update robot speech based on challenge
    switch (currentChallenge.badgeId) {
      case 'mood_mapper':
        setRobotSpeech("Time to explore your emotions! Head to Daily Check-In and track how you're feeling today.");
        break;
      case 'creative_spark':
        setRobotSpeech("Let's get creative! Go to Draw It Out and use lots of colors to express yourself.");
        break;
      case 'deep_thinker':
        setRobotSpeech("Time for some deep thinking! Go to Chat and share what's really on your mind.");
        break;
      case 'what_if_explorer':
        setRobotSpeech("Ready to explore your imagination? Check out the What If section and let your creativity soar!");
        break;
      case 'brave_voice':
        setRobotSpeech("Time to be brave and share your feelings! Use the word 'because' to explain how you're feeling.");
        break;
      default:
        setRobotSpeech("Great choice! Go explore and complete your challenge. I believe in you!");
    }
    
    // Close challenges section to let user complete the challenge
    onClose();
  };

  const handleNextChallenge = () => {
    // Cycle to next challenge
    setCurrentChallengeIndex((prev) => (prev + 1) % challengeDetails.length);
    setCurrentScreen('next-challenge');
    setNewlyEarnedBadge(null);
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
  };

  const handleMyBadges = () => {
    setCurrentScreen('my-badges');
    setRobotSpeech(`Wow! You've already earned ${progress.badgeCount} badges! Just ${18 - progress.badgeCount} more to unlock the full set. Keep going—`);
  };

  const handleBackToNextChallenge = () => {
    setCurrentScreen('next-challenge');
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
  };

  const currentChallenge = challengeDetails[currentChallengeIndex];

  return (
    <div className="challenges-section">
      {currentScreen === 'next-challenge' && (
        <NextChallengePage
          challenge={currentChallenge}
          onStartChallenge={handleStartChallenge}
          onMyBadges={handleMyBadges}
          progress={progress}
        />
      )}
      
      {currentScreen === 'challenge-complete' && newlyEarnedBadge && (
        <ChallengeCompletePage
          badgeId={newlyEarnedBadge}
          progress={progress}
          onNextChallenge={handleNextChallenge}
          onMyBadges={handleMyBadges}
        />
      )}
      
      {currentScreen === 'my-badges' && (
        <MyBadgesPage
          progress={progress}
          onNextChallenge={handleBackToNextChallenge}
        />
      )}
    </div>
  );
}

export default ChallengesSection;