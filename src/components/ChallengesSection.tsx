import React, { useState, useEffect } from 'react';
import NextChallengePage from './NextChallengePage';
import ChallengeCompletePage from './ChallengeCompletePage';
import MyBadgesPage from './MyBadgesPage';
import { loadProgress, updateProgress } from '../utils/progressManager';
import { challengeDetails, badgeQueue } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengesSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
}

type ChallengeScreen = 'next-challenge' | 'challenge-complete' | 'my-badges';

function ChallengesSection({ onClose, setRobotSpeech }: ChallengesSectionProps) {
  const [currentScreen, setCurrentScreen] = useState<ChallengeScreen>('next-challenge');
  const [progress, setProgress] = useState<ReflectoBotProgress>(loadProgress());
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null);

  // Get the current challenge based on progress
  const getCurrentChallenge = () => {
    // Get the badge ID from the queue based on current index
    const currentBadgeId = badgeQueue[progress.currentChallengeIndex];
    if (!currentBadgeId) return null; // All challenges completed
    
    // Find the challenge details for this badge
    return challengeDetails.find(challenge => challenge.badgeId === currentBadgeId);
  };

  const currentChallenge = getCurrentChallenge();

  const handleStartChallenge = () => {
    if (!currentChallenge) return;
    
    // Activate the challenge
    const updatedProgress = updateProgress({
      challengeActive: true
    });
    setProgress(updatedProgress);
    
    // Update robot speech based on challenge
    switch (currentChallenge.badgeId) {
      case 'calm_creator':
        setRobotSpeech("Time to get creative! Head to Draw It Out and create a beautiful drawing that shows how you're feeling.");
        break;
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
      case 'boost_buddy':
        setRobotSpeech("Let's try something fun! Go to What If and use the 'Read It to Me' button to hear a prompt out loud.");
        break;
      default:
        setRobotSpeech("Great choice! Go explore and complete your challenge. I believe in you!");
    }
    
    // Close challenges section to let user complete the challenge
    onClose();
  };

  const handleNextChallenge = () => {
    setCurrentScreen('next-challenge');
    setNewlyEarnedBadge(null);
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
  };

  const handleMyBadges = () => {
    setCurrentScreen('my-badges');
    setRobotSpeech(`Wow! You've already earned ${progress.badgeCount} badges! Just ${18 - progress.badgeCount} more to unlock the full set. Keep going!`);
  };

  const handleBackToNextChallenge = () => {
    setCurrentScreen('next-challenge');
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
  };

  // If all challenges are completed, show completion message
  if (!currentChallenge) {
    return (
      <div className="challenges-section">
        <div className="next-challenge-content">
          <div className="next-challenge-header">
            <h1 className="next-challenge-title">All Challenges Complete!</h1>
            <button 
              className="my-badges-button"
              onClick={handleMyBadges}
            >
              <img src="/My_Badges_Button_Icon.png" alt="My Badges" className="button-icon" />
              <span className="font-bold leading-none">My Badges</span>
            </button>
          </div>
          
          <div className="challenge-card">
            <div className="challenge-content">
              <h2 className="challenge-card-title">Congratulations!</h2>
              <p className="challenge-card-description">
                You've completed all available challenges! You're a true ReflectoBot champion.
                Keep exploring and growing with your AI buddy!
              </p>
              <div className="challenge-buttons-container">
                <button 
                  className="start-challenge-button"
                  onClick={handleMyBadges}
                >
                  View All Badges
                </button>
              </div>
            </div>
            <img 
              src="/badges/SuperStar.png" 
              alt="Super Star Badge"
              className="challenge-badge"
            />
          </div>
        </div>
      </div>
    );
  }

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