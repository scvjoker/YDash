import React, { useState } from 'react';
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
  stats,
  beatmapTitle,
  onResume,
  onRestart,
  onHome
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(audioEngine.isSfxEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(audioEngine.isVibrationEnabled);

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
      padding: '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: '480px',
        maxWidth: '94vw',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '1.4rem 1.6rem',
        textAlign: 'center',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Modal Title Header */}
        <h2 style={{
          fontSize: '2.1rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#ffe600',
          textShadow: '0 0 15px rgba(255, 230, 0, 0.6)',
          marginBottom: '4px'
        }}>
          ⏸ 遊戲暫停 (PAUSED)
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '1rem' }}>
          {beatmapTitle}
        </p>

        {/* Live Gameplay Stats Card */}
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          marginBottom: '1.1rem',
          textAlign: 'left'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>目前得票分數:</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#00f0ff' }}>
              {stats.score.toLocaleString()} 票
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>選民支持度 (HP):</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: stats.supportRate <= 30 ? '#ff0055' : '#ffe600' }}>
              {stats.supportRate}%
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>最高 Combo 連擊:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>
              {stats.maxCombo} 連擊
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>Perfect 完美聲勢:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#00f0ff' }}>
              {stats.perfectCount} 次
            </div>
          </div>
        </div>

        {/* SFX & Vibration Settings Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.1rem' }}>
          {/* Drum SFX Toggle */}
          <button
            onClick={toggleSfx}
            style={{
              padding: '0.65rem 0.4rem',
              background: sfxEnabled ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: sfxEnabled ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.2)',
              color: sfxEnabled ? '#00f0ff' : '#888',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            🥁 打擊鼓聲: <span style={{ color: sfxEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{sfxEnabled ? 'ON 啟用' : 'OFF 靜音'}</span>
          </button>

          {/* Mobile Vibration Toggle */}
          <button
            onClick={toggleVibration}
            style={{
              padding: '0.65rem 0.4rem',
              background: vibrationEnabled ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: vibrationEnabled ? '1.5px solid #ff007f' : '1px solid rgba(255, 255, 255, 0.2)',
              color: vibrationEnabled ? '#ff007f' : '#888',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            📳 手機震動: <span style={{ color: vibrationEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{vibrationEnabled ? 'ON 啟用' : 'OFF 關閉'}</span>
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          style={{
            width: '100%',
            marginBottom: '0.9rem',
            padding: '0.6rem',
            background: 'rgba(255, 230, 0, 0.12)',
            border: '1.5px solid #ffe600',
            color: '#ffe600',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isFullscreen ? '📺 退出全螢幕 (EXIT FULLSCREEN)' : '🖥️ 切換全螢幕沉浸體驗 (FULLSCREEN)'}
        </button>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="muse-btn"
            onClick={onResume}
            style={{ width: '100%', fontSize: '1.15rem', padding: '0.8rem' }}
          >
            <span>▶ 繼續競選 (RESUME)</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onRestart}
              style={{
                flex: 1,
                padding: '0.7rem',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1.5px solid #00f0ff',
                color: '#00f0ff',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              🔄 重新開局
            </button>

            <button
              onClick={onHome}
              style={{
                flex: 1,
                padding: '0.7rem',
                background: 'rgba(255, 0, 85, 0.1)',
                border: '1.5px solid #ff0055',
                color: '#ff0055',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              🏠 返回主畫面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
