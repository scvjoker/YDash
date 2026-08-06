import React from 'react';
import { Play, RotateCcw, Home, Maximize } from 'lucide-react';
import { GameStats } from '../types/game';

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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '460px',
        maxWidth: '92vw',
        padding: '1.8rem',
        textAlign: 'center',
        border: '2px solid #ff007f',
        boxShadow: '0 0 35px rgba(255, 0, 127, 0.4)',
        position: 'relative'
      }}>
        {/* Fullscreen Button on Top Right */}
        <button
          onClick={handleFullscreen}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 230, 0, 0.15)',
            border: '1.5px solid #ffe600',
            color: '#ffe600',
            borderRadius: '16px',
            padding: '4px 12px',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255,230,0,0.4)'
          }}
        >
          <Maximize size={14} /> 全螢幕
        </button>

        <h2 style={{
          fontSize: '2.2rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#ff007f',
          marginBottom: '0.2rem',
          textShadow: '0 0 15px rgba(255,0,127,0.6)'
        }}>
          ⏸️ 遊戲暫停 (PAUSED)
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
          {beatmapTitle}
        </p>

        {/* Game Stats Snapshot */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '14px',
          padding: '0.8rem 1rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>當前得票: </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffe600' }}>
              {stats.score.toLocaleString()} 票
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>最高 COMBO: </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00f0ff' }}>
              {stats.maxCombo}
            </span>
          </div>
        </div>

        {/* Buttons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button
            className="muse-btn"
            onClick={onResume}
            style={{ fontSize: '1.2rem', padding: '0.85rem' }}
          >
            <span><Play fill="#fff" size={20} /> 繼續拜票 (RESUME - 享 5 秒緩衝)</span>
          </button>

          <button
            className="muse-btn muse-btn-cyan"
            onClick={onRestart}
            style={{ fontSize: '1rem', padding: '0.7rem' }}
          >
            <span><RotateCcw size={18} /> 重新開始 (RESTART)</span>
          </button>

          <button
            className="muse-btn muse-btn-yellow"
            onClick={onHome}
            style={{ fontSize: '1rem', padding: '0.7rem' }}
          >
            <span><Home size={18} /> 返回競選主頁 (HOME)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
