import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { GameStats } from '../types/game';

interface ResultScreenProps {
  stats: GameStats;
  beatmapTitle: string;
  onReplay: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stats,
  beatmapTitle,
  onReplay,
  onHome
}) => {
  const isElected = stats.supportRate > 0;
  const accuracy = ((stats.perfectCount + stats.greatCount * 0.6) / Math.max(1, stats.perfectCount + stats.greatCount + stats.missCount)) * 100;

  let grade = 'S';
  if (accuracy < 70) grade = 'C';
  else if (accuracy < 85) grade = 'B';
  else if (accuracy < 95) grade = 'A';

  useEffect(() => {
    if (isElected) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isElected]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at 50% 40%, #25093b 0%, #080914 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '650px',
        maxWidth: '92vw',
        padding: '2.5rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Election Status Header */}
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 900,
          color: isElected ? '#ffe600' : '#ff0055',
          letterSpacing: '2px',
          marginBottom: '0.5rem'
        }}>
          {isElected ? '🎉 恭喜當選！WEB3 小島區新科里長！' : '💔 拜票中途殘念！支持度耗盡！'}
        </div>

        <h1 style={{
          fontFamily: 'Chakra Petch, sans-serif',
          fontSize: '3rem',
          fontWeight: 900,
          color: '#fff',
          marginBottom: '1rem'
        }}>
          {beatmapTitle}
        </h1>

        {/* Grade Badge */}
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: isElected ? 'linear-gradient(135deg, #ff007f 0%, #ffe600 100%)' : 'rgba(255, 0, 85, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#fff',
          boxShadow: isElected ? '0 0 30px rgba(255, 230, 0, 0.8)' : 'none'
        }}>
          {grade}
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          background: 'rgba(0,0,0,0.4)',
          padding: '1.2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>總得票數 (Total Votes)</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffe600' }}>{stats.score.toLocaleString()}</p>
          </div>

          <div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>最高連擊 (Max Combo)</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00f0ff' }}>{stats.maxCombo}</p>
          </div>

          <div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Perfect 遞衛生紙</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{stats.perfectCount}</p>
          </div>

          <div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Great 遞衛生紙</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#aaa' }}>{stats.greatCount}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="muse-btn muse-btn-cyan" onClick={onReplay}>
            <span><RotateCcw size={20} /> 再次競選拜票</span>
          </button>

          <button className="muse-btn" onClick={onHome}>
            <span><Home size={20} /> 返回主選單</span>
          </button>
        </div>
      </div>
    </div>
  );
};
