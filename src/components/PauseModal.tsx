import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
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
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 6, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '550px',
        maxWidth: '92vw',
        padding: '2.2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Header */}
        <h2 style={{
          fontFamily: 'Chakra Petch, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 900,
          color: '#ffe600',
          marginBottom: '0.4rem',
          letterSpacing: '1px'
        }}>
          ⏸️ 競選拜票暫停中
        </h2>
        <p style={{ color: '#00f0ff', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          {beatmapTitle}
        </p>

        {/* Current Stats Brief */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          background: 'rgba(0,0,0,0.5)',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>當前獲票數</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffe600' }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#fff' }}>票</span>
            </p>
          </div>

          <div>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>選民支持度</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: stats.supportRate <= 30 ? '#ff0055' : '#00f0ff' }}>
              {stats.supportRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="muse-btn" onClick={onResume} style={{ width: '100%', fontSize: '1.3rem' }}>
            <span><Play fill="#fff" size={22} /> 繼續競選 (Resume)</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="muse-btn muse-btn-cyan" onClick={onRestart} style={{ fontSize: '1rem' }}>
              <span><RotateCcw size={18} /> 重新開始</span>
            </button>

            <button className="muse-btn muse-btn-yellow" onClick={onHome} style={{ fontSize: '1rem' }}>
              <span><Home size={18} /> 返回主選單</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
