import React, { useState, useEffect } from 'react';
import { GameStats } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface PauseModalProps {
  stats: GameStats;
  beatmapTitle: string;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  beatmapTitle,
  onResume,
  onRestart,
  onHome
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(audioEngine.isSfxEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(audioEngine.isVibrationEnabled);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleSfx = () => {
    audioEngine.isSfxEnabled = !sfxEnabled;
    setSfxEnabled(!sfxEnabled);
    if (!sfxEnabled) {
      audioEngine.playSFX('perfect');
    }
  };

  const toggleVibration = () => {
    audioEngine.isVibrationEnabled = !vibrationEnabled;
    setVibrationEnabled(!vibrationEnabled);
    if (!vibrationEnabled) {
      audioEngine.triggerHapticVibration('dual');
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 18, 0.90)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: isMobileScreen ? '0.4rem' : '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: isMobileScreen ? '360px' : '420px',
        maxWidth: '92vw',
        maxHeight: '92svh',
        overflowY: 'auto',
        padding: isMobileScreen ? '0.8rem 1.0rem' : '1.6rem 1.8rem',
        textAlign: 'center',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Modal Title Header */}
        <h2 style={{
          fontSize: isMobileScreen ? '1.3rem' : '2.1rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#ffe600',
          textShadow: '0 0 15px rgba(255, 230, 0, 0.6)',
          marginBottom: '2px'
        }}>
          ⏸ 遊戲暫停 (PAUSED)
        </h2>
        <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.75rem' : '0.9rem', marginBottom: isMobileScreen ? '0.6rem' : '1.2rem' }}>
          {beatmapTitle}
        </p>

        {/* SFX & Vibration Settings Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobileScreen ? '0.4rem' : '0.65rem', marginBottom: isMobileScreen ? '0.6rem' : '1.1rem' }}>
          {/* Drum SFX Toggle */}
          <button
            onClick={toggleSfx}
            style={{
              padding: isMobileScreen ? '0.4rem 0.2rem' : '0.65rem 0.4rem',
              background: sfxEnabled ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: sfxEnabled ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.2)',
              color: sfxEnabled ? '#00f0ff' : '#888',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: isMobileScreen ? '0.72rem' : '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px'
            }}
          >
            🥁 鼓聲: <span style={{ color: sfxEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{sfxEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Mobile Vibration Toggle */}
          <button
            onClick={toggleVibration}
            style={{
              padding: isMobileScreen ? '0.4rem 0.2rem' : '0.65rem 0.4rem',
              background: vibrationEnabled ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: vibrationEnabled ? '1.5px solid #ff007f' : '1px solid rgba(255, 255, 255, 0.2)',
              color: vibrationEnabled ? '#ff007f' : '#888',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: isMobileScreen ? '0.72rem' : '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px'
            }}
          >
            📳 震動: <span style={{ color: vibrationEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{vibrationEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          style={{
            width: '100%',
            marginBottom: isMobileScreen ? '0.6rem' : '1.2rem',
            padding: isMobileScreen ? '0.45rem' : '0.65rem',
            background: 'rgba(255, 230, 0, 0.12)',
            border: '1.5px solid #ffe600',
            color: '#ffe600',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: isMobileScreen ? '0.75rem' : '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isFullscreen ? '📺 退出全螢幕' : '🖥️ 切換全螢幕'}
        </button>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobileScreen ? '0.4rem' : '0.8rem' }}>
          <button
            className="muse-btn"
            onClick={onResume}
            style={{ width: '100%', fontSize: isMobileScreen ? '0.92rem' : '1.18rem', padding: isMobileScreen ? '0.45rem' : '0.8rem' }}
          >
            <span>▶ 繼續競選 (RESUME)</span>
          </button>

          <div style={{ display: 'flex', gap: isMobileScreen ? '0.4rem' : '0.8rem' }}>
            <button
              onClick={onRestart}
              style={{
                flex: 1,
                padding: isMobileScreen ? '0.45rem' : '0.75rem',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1.5px solid #00f0ff',
                color: '#00f0ff',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: isMobileScreen ? '0.75rem' : '0.9rem',
                cursor: 'pointer'
              }}
            >
              🔄 重新開局
            </button>

            <button
              onClick={onHome}
              style={{
                flex: 1,
                padding: isMobileScreen ? '0.45rem' : '0.75rem',
                background: 'rgba(255, 0, 85, 0.1)',
                border: '1.5px solid #ff0055',
                color: '#ff0055',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: isMobileScreen ? '0.75rem' : '0.9rem',
                cursor: 'pointer'
              }}
            >
              🏠 主畫面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
