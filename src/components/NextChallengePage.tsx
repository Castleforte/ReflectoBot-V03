import React from 'react';
import { Challenge, ReflectoBotProgress } from '../types';

interface NextChallengePageProps {
  challenge: Challenge;
  onStartChallenge: () => void;
  onMyBadges: () => void;
  progress: ReflectoBotProgress;
}

function NextChallengePage({ challenge, onStartChallenge, onMyBadges, progress }: NextChallengePageProps) {
  const remainingBadges = 18 - progress.badgeCount;

  return (
    <div className="next-challenge-content">
      <div className="next-challenge-header">
        <h1 className="next-challenge-title">Next Challenge</h1>
        <button 
          className="my-badges-button"
          onClick={onMyBadges}
        >
          <img src="/Trophy-icon.png" alt="My Badges" className="button-icon" />
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold leading-none">My</span>
            <span className="text-2xl font-bold leading-none">Badges</span>
          </div>
        </button>
      </div>

      <div className="challenge-card">
        <div className="challenge-card-header">
          <h2 className="challenge-card-title">{challenge.title}</h2>
        </div>
        
        <p className="challenge-card-description">
          {challenge.description}
        </p>

        <div className="challenge-progress-indicator">
          <span className="challenge-progress-text">Just {remainingBadges} More To Go</span>
        </div>

        <button 
          className="start-challenge-button"
          onClick={onStartChallenge}
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
}

export default NextChallengePage;