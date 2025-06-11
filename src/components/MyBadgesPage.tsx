import React, { useRef } from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface MyBadgesPageProps {
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
}

function MyBadgesPage({ progress, onNextChallenge }: MyBadgesPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadProgress = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { importProgress } = await import('../utils/progressManager');
        await importProgress(file);
      } catch (error) {
        console.error('Error importing progress:', error);
        alert('Error loading progress file. Please check the file and try again.');
      }
    }
  };

  return (
    <div className="my-badges-content">
      <div className="my-badges-header">
        <h1 className="my-badges-title">My Badges</h1>
        <div className="my-badges-header-buttons">
          <span className="badges-collected-indicator">{progress.badgeCount} of 18 Collected!</span>
          <button 
            className="next-challenge-button"
            onClick={onNextChallenge}
          >
            <img src="/Trophy-icon.png" alt="Next Challenge" className="button-icon" />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold leading-none">Next</span>
              <span className="text-2xl font-bold leading-none">Challenge</span>
            </div>
          </button>
        </div>
      </div>

      <div className="badges-grid">
        {allBadges.map((badge) => {
          const isEarned = progress.badges[badge.id];
          return (
            <div 
              key={badge.id}
              className={`badge-item ${isEarned ? 'badge-earned' : 'badge-unearned'}`}
            >
              <img 
                src={isEarned ? badge.colorIcon : badge.icon}
                alt={badge.name}
                className="badge-icon"
              />
              <span className="badge-label">{badge.name}</span>
            </div>
          );
        })}
      </div>

      <div className="progress-management-section">
        <h3 className="progress-management-title">Progress Management</h3>
        <div className="progress-management-buttons">
          <button 
            className="progress-button save-button"
            onClick={() => {
              const { exportProgress } = require('../utils/progressManager');
              exportProgress();
            }}
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

export default MyBadgesPage;