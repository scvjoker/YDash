import React, { useState, useEffect } from 'react';
import { RotateCcw, Home, Award, Trophy } from 'lucide-react';
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
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isFullCombo = stats.missCount === 0 && stats.maxCombo > 0;

  // Grade Evaluation Logic
  let grade = 'S';
  let gradeColor = '#ffe600';
  let evaluationText = '🎉 完美拜票！ web3 小島區最高人氣里長候選人誕生！';

  if (stats.supportRate >= 90) {
    grade = 'S';
    gradeColor = '#ffe600';
  } else if (stats.supportRate >= 70) {
    grade = 'A';
    gradeColor = '#00f0ff';
    evaluationText = '✨ 大獲好評！ 選民支持度高漲，勝選在望！';
  } else if (stats.supportRate >= 50) {
    grade = 'B';
    gradeColor = '#ff007f';
    evaluationText = '👍 順利通關！ 繼續加油發面紙拉票！';
  } else {
    grade = 'C';
    gradeColor = '#aaa';
    evaluationText = '💪 再接再厲！ 拜票之旅充滿挑戰！';
  }

  const maxPossibleCombo = stats.totalNotesCount || stats.maxCombo;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.78)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: isMobileScreen ? '0.4rem' : '0.8rem'
    }}>
      <div className="cyber-panel float-animation" style={{
        width: '780px',
        maxWidth: '95vw',
        maxHeight: '94svh',
        overflowY: 'auto',
        padding: isMobileScreen ? '0.55rem 0.9rem' : '1.2rem 1.6rem',
        textAlign: 'center',
        position: 'relative',
        border: isFullCombo ? '2.5px solid #ffe600' : '2px solid #00f0ff',
        boxShadow: isFullCombo ? '0 0 35px rgba(255, 230, 0, 0.6)' : '0 0 25px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Top Header Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          padding: isMobileScreen ? '2px 12px' : '4px 16px',
          borderRadius: '30px',
          color: '#000',
          fontWeight: 900,
          marginBottom: isMobileScreen ? '0.2rem' : '0.5rem',
          fontSize: isMobileScreen ? '0.72rem' : '0.82rem',
          boxShadow: '0 0 15px rgba(0,240,255,0.4)'
        }}>
          <Award size={isMobileScreen ? 13 : 15} />
          <span>ELECTION CAMPAIGN RESULT • 競選拜票結果</span>
        </div>

        <h2 style={{
          fontSize: isMobileScreen ? '1.25rem' : '1.8rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#fff',
          marginBottom: '0.1rem'
        }}>
          {beatmapTitle}
        </h2>

        {/* FULL COMBO CERTIFIED BADGE */}
        {isFullCombo && (
          <div style={{
            margin: isMobileScreen ? '0.2rem auto 0.4rem' : '0.4rem auto 0.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(90deg, #ffe600, #ffb703)',
            color: '#000',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? '0.88rem' : '1.1rem',
            fontWeight: 900,
            padding: isMobileScreen ? '3px 14px' : '5px 20px',
            borderRadius: '30px',
            boxShadow: '0 0 20px #ffe600',
            animation: 'pulse 1.5s infinite alternate'
          }}>
            <Trophy size={isMobileScreen ? 16 : 20} fill="#000" /> 🏆 FULL COMBO! 全連擊完美達成
          </div>
        )}

        <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.75rem' : '0.88rem', marginBottom: isMobileScreen ? '0.5rem' : '1rem' }}>
          {evaluationText}
        </p>

        {/* Score & Grade Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: '14px',
          padding: isMobileScreen ? '0.4rem 0.8rem' : '0.8rem 1.2rem',
          marginBottom: isMobileScreen ? '0.5rem' : '1rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Grade Badge */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.75rem', color: '#aaa', fontWeight: 800, textTransform: 'uppercase' }}>評價 GRADE</p>
            <div style={{
              fontSize: isMobileScreen ? '2.4rem' : '3.6rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: gradeColor,
              textShadow: `0 0 15px ${gradeColor}`,
              lineHeight: 1
            }}>
              {grade}
            </div>
          </div>

          <div style={{ width: '1px', height: isMobileScreen ? '40px' : '60px', background: 'rgba(255,255,255,0.15)' }} />

          {/* Score Display */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.75rem', color: '#aaa', fontWeight: 800, textTransform: 'uppercase' }}>總得票數 (FINAL SCORE)</p>
            <div style={{
              fontSize: isMobileScreen ? '1.65rem' : '2.4rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 15px rgba(255, 230, 0, 0.7)',
              lineHeight: 1.1
            }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: isMobileScreen ? '0.75rem' : '1rem', color: '#fff' }}>票</span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Grid (Max Combo / Max Possible Combo) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: isMobileScreen ? '0.35rem' : '0.6rem',
          marginBottom: isMobileScreen ? '0.6rem' : '1.2rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: isMobileScreen ? '0.35rem 0.2rem' : '0.6rem 0.4rem', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <p style={{ fontSize: isMobileScreen ? '0.62rem' : '0.72rem', color: '#aaa', fontWeight: 800 }}>最高連擊 (COMBO)</p>
            <p style={{ fontSize: isMobileScreen ? '1.0rem' : '1.2rem', fontWeight: 900, color: isFullCombo ? '#ffe600' : '#00f0ff', marginTop: '1px' }}>
              {stats.maxCombo} <span style={{ fontSize: '0.62rem', color: '#888' }}>/ {maxPossibleCombo}</span>
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: isMobileScreen ? '0.35rem 0.2rem' : '0.6rem 0.4rem', borderRadius: '8px', border: '1px solid rgba(255,230,0,0.3)' }}>
            <p style={{ fontSize: isMobileScreen ? '0.62rem' : '0.72rem', color: '#aaa', fontWeight: 800 }}>完美 (PERFECT)</p>
            <p style={{ fontSize: isMobileScreen ? '1.0rem' : '1.2rem', fontWeight: 900, color: '#ffe600', marginTop: '1px' }}>
              {stats.perfectCount}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: isMobileScreen ? '0.35rem 0.2rem' : '0.6rem 0.4rem', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <p style={{ fontSize: isMobileScreen ? '0.62rem' : '0.72rem', color: '#aaa', fontWeight: 800 }}>良好 (GREAT)</p>
            <p style={{ fontSize: isMobileScreen ? '1.0rem' : '1.2rem', fontWeight: 900, color: '#00f0ff', marginTop: '1px' }}>
              {stats.greatCount}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: isMobileScreen ? '0.35rem 0.2rem' : '0.6rem 0.4rem', borderRadius: '8px', border: '1px solid rgba(255,0,127,0.3)' }}>
            <p style={{ fontSize: isMobileScreen ? '0.62rem' : '0.72rem', color: '#aaa', fontWeight: 800 }}>失誤 (MISS)</p>
            <p style={{ fontSize: isMobileScreen ? '1.0rem' : '1.2rem', fontWeight: 900, color: stats.missCount === 0 ? '#00f0ff' : '#ff007f', marginTop: '1px' }}>
              {stats.missCount}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: isMobileScreen ? '0.5rem' : '0.8rem', justifyContent: 'center' }}>
          <button
            className="muse-btn muse-btn-cyan"
            onClick={onReplay}
            style={{ flex: 1, padding: isMobileScreen ? '0.55rem' : '0.75rem', fontSize: isMobileScreen ? '0.9rem' : '1.05rem' }}
          >
            <span><RotateCcw size={isMobileScreen ? 15 : 18} /> 再次競選拜票 (REPLAY)</span>
          </button>

          <button
            className="muse-btn muse-btn-yellow"
            onClick={onHome}
            style={{ flex: 1, padding: isMobileScreen ? '0.55rem' : '0.75rem', fontSize: isMobileScreen ? '0.9rem' : '1.05rem' }}
          >
            <span><Home size={isMobileScreen ? 15 : 18} /> 返回選單 (MAIN MENU)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
