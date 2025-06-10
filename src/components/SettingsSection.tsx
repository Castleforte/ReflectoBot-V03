import React, { useState } from 'react';

interface SettingsSectionProps {
  onClose: () => void;
  onShowGrownUpModal: () => void;
}

function SettingsSection({ onClose, onShowGrownUpModal }: SettingsSectionProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  return (
    <div className="settings-section">
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
        </div>

        <div className="settings-rows">
          <div className="settings-row">
            <div className="settings-label">
              <img src="/Save-icon copy.png" alt="Save icon" className="settings-icon" />
              <span>Save/Load Session</span>
            </div>
            <div className="settings-controls">
              <button className="settings-button">
                <img src="/Save-icon copy.png" alt="Save icon" className="button-icon" />
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold leading-none">Save</span>
                  <span className="text-2xl font-bold leading-none">Session</span>
                </div>
              </button>
              <button className="settings-button">
                <img src="/Load-icon.png" alt="Load icon" className="button-icon" />
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold leading-none">Load</span>
                  <span className="text-2xl font-bold leading-none">Session</span>
                </div>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Speaker-icon.png" alt="Sound icon" className="settings-icon" />
              <span>Sound On/Off</span>
            </div>
            <div className="settings-controls">
              <button
                className={`toggle-switch ${soundEnabled ? 'enabled' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-pressed={soundEnabled}
                role="switch"
              >
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Brain-icon.png" alt="Brain icon" className="settings-icon" />
              <span>Reset Progress</span>
            </div>
            <div className="settings-controls justify-center lg:justify-end">
              <button
                className="settings-button settings-button-lg danger"
                onClick={() => setShowResetModal(true)}
              >
                Erase My Progress
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Shield-icon.png" alt="Grown-up access icon" className="settings-icon" />
              <span>Grown-Up Access</span>
            </div>
            <div className="settings-controls justify-center lg:justify-end">
              <button 
                className="settings-button settings-button-lg"
                onClick={onShowGrownUpModal}
              >
                I'm a Grown-Up
              </button>
            </div>
          </div>
        </div>

        <div className="settings-hint">
          <span className="text-[#a4f61e]">Want to come back here? Just tap the ReflectoBot logo anytime!</span>
        </div>
      </div>

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <p className="modal-message">
              This will clear your badges and reset all your activities. It's like starting fresh!
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowResetModal(false)}
              >
                Don't Do It
              </button>
              <button
                className="modal-button danger"
                onClick={() => {
                  // Handle reset logic here
                  setShowResetModal(false);
                }}
              >
                Yes, Do It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsSection;