import React, { useState, useEffect } from 'react';
import { whatIfPrompts } from '../whatIfPrompts';

interface WhatIfSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
}

function WhatIfSection({ onClose, setRobotSpeech }: WhatIfSectionProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);

  const handleRefreshPrompt = () => {
    if (isRefreshDisabled) return;

    // Cycle to the next prompt in the array
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % whatIfPrompts.length);
    
    // Enable cooldown
    setIsRefreshDisabled(true);
    
    // Re-enable button after 2 seconds
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, 2000);
  };

  const handleReadItToMe = () => {
    // Toggle reading state
    setIsReading(!isReading);
    
    // TODO: Integrate with ElevenLabs API for text-to-speech
    // For now, we'll simulate the reading with a timeout
    if (!isReading) {
      // Simulate reading duration (you'll replace this with actual audio playback)
      setTimeout(() => {
        setIsReading(false);
      }, 3000);
      
      // Update robot speech to acknowledge the action
      setRobotSpeech("Listen up! I'm reading your What If prompt out loud. Let your imagination run wild!");
    }
  };

  return (
    <div className="what-if-section">
      <div className="what-if-content">
        <div className="what-if-header">
          <h1 className="what-if-title">Today's What If...?</h1>
          <div className="what-if-buttons">
            <button 
              className={`settings-button chat-action-button ${isRefreshDisabled ? 'disabled' : ''}`}
              onClick={handleRefreshPrompt}
              disabled={isRefreshDisabled}
            >
              <img src="/Refresh_Icon.png" alt="Prompt Refresh" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Prompt</span>
                <span className="text-2xl font-bold leading-none">Refresh</span>
              </div>
            </button>
            <button 
              className={`settings-button chat-action-button ${isReading ? 'reading-active' : ''}`}
              onClick={handleReadItToMe}
            >
              <img src="/Speaker-icon.png" alt="Read It to Me" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Read It</span>
                <span className="text-2xl font-bold leading-none">to Me</span>
              </div>
            </button>
          </div>
        </div>

        <div className={`what-if-prompt-display ${isReading ? 'reading-animation' : ''}`}>
          {whatIfPrompts[currentPromptIndex]}
        </div>

        <div className="what-if-encouragement">
          <p className="text-lg text-[#9FE7F5] text-center leading-relaxed">
            Imagine something wild, kind, or cool. Let's write it out!
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhatIfSection;