import React, { useRef } from 'react';
import { Challenge, ReflectoBotProgress } from '../types';
import { exportProgress, importProgress } from '../utils/progressManager';

interface NextChallengePageProps {
  challenge: Challenge;
  onStartChallenge: () => void;
  onMyBadges: () => void;
  progress: ReflectoBotProgress;
}

function NextChallengePage({ challenge, onStartChallenge, onMyBadges, progress }: NextChallengePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remainingBadges = 18 - progress.badgeCount;

  const handleSaveProgress = () => {
    exportProgress();
  };

  const handleLoadProgress = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importProgress(file);
      } catch (error) {
        console.error('Error importing progress:', error);
        alert('Error loading progress file. Please check the file and try again.');
      }
    }
  };

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

      <div className="progress-management-section">
        <h3 className="progress-management-title">Progress Management</h3>
        <div className="progress-management-buttons">
          <button 
            className="progress-button save-button"
            onClick={handleSaveProgress}
          >
            <img src="/Save-icon.png" alt="Save Progress" className="button-icon" />
            Save Progress
          </button>
          <button 
            className="progress-button load-button"
            onClick={handleLoadProgress}
          >
            <img src="/Load-icon.png" alt="Load Progress" className="button-icon" />
            Load Progress
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default NextChallengePage;