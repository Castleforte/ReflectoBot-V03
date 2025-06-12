import React, { useRef } from 'react';
import { Challenge, ReflectoBotProgress } from '../types';
import { exportProgress, importProgress } from '../utils/progressManager';
import { badgeQueue } from '../badgeData';

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

  // Get current challenge info for dev display
  const currentChallenge = badgeQueue[progress.currentChallengeIndex];
  const currentBadgeEarned = currentChallenge ? progress.badges[currentChallenge.key] : false;

  return (
    <div className="next-challenge-content">
      <div className="next-challenge-header">
        <h1 className="next-challenge-title">Next Challenge</h1>
        <button 
          className="my-badges-button"
          onClick={onMyBadges}
        >
          <img src="/My_Badges_Button_Icon.png" alt="My Badges" className="button-icon" />
          <span className="font-bold leading-none">My Badges</span>
        </button>
      </div>

      <div className="challenge-card">
        <div className="challenge-content">
          <h2 className="challenge-card-title">{challenge.title}</h2>
          
          <p className="challenge-card-description">
            {challenge.description}
          </p>

          <div className="challenge-progress-indicator">
            <span className="challenge-progress-text">Just {remainingBadges} More To Go</span>
          </div>

          <div className="challenge-buttons-container">
            <button 
              className="start-challenge-button"
              onClick={onStartChallenge}
            >
              Start Challenge
            </button>
          </div>
        </div>
        
        <img 
          src="/badges/MoodMapper.png" 
          alt="Mood Mapper Badge"
          className="challenge-badge"
        />
      </div>

      <p className="challenge-helper-text">
        Your badges save automatically. You can also save or load progress from the Settings page.
      </p>

      {/* Developer Tools Display */}
      <div style={{
        backgroundColor: '#1c1a30',
        border: '2px solid #ff6b35',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: '#fff'
      }}>
        <div style={{ color: '#ff6b35', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🔧 DEV TOOLS - Challenge Status
        </div>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>Current Challenge:</strong> {currentChallenge ? currentChallenge.key : 'No more challenges'}
        </div>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>Challenge Active:</strong> {progress.challengeActive ? 'true' : 'false'}
        </div>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>Badge Earned:</strong> {currentBadgeEarned ? 'true' : 'false'}
        </div>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>Challenge Index:</strong> {progress.currentChallengeIndex} / {badgeQueue.length}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9FE7F5', marginTop: '0.5rem' }}>
          Use "Reset Badge Progress" in Settings to test from the beginning
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