import React from 'react';
import { RotateCcw, Home, Award, Sparkles, Trophy } from 'lucide-react';
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
      backgroundColor: 'rgba(7, 8, 20, 0.72)', // Blurred Transparent Overlay over Runway
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '2rem'
    }}>
      <div className="cyber-panel float-animation" style={{
        width: '780px',
        maxWidth: '92vw',
        padding: '2.5rem',
        textAlign: 'center',
        position: 'relative',
        border: isFullCombo ? '3px solid #ffe600' : '2px solid #00f0ff',
        boxShadow: isFullCombo ? '0 0 50px rgba(255, 230, 0, 0.6)' : '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Top Header Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          padding: '5px 22px',
          borderRadius: '30px',
          color: '#000',
          fontWeight: 900,
          marginBottom: '1rem',
          boxShadow: '0 0 20px rgba(0,240,255,0.5)'
        }}>
          <Award size={18} />
          <span>ELECTION CAMPAIGN RESULT • 競選拜票結果</span>
        </div>

        <h2 style={{
          fontSize: '2.4rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#fff',
          marginBottom: '0.4rem'
        }}>
          {beatmapTitle}
        </h2>

        {/* FULL COMBO CERTIFIED BADGE */}
        {isFullCombo && (
          <div style={{
            margin: '0.8rem auto 1.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(90deg, #ffe600, #ffb703)',
            color: '#000',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 900,
            padding: '8px 28px',
            borderRadius: '40px',
            boxShadow: '0 0 35px #ffe600',
            animation: 'pulse 1.5s infinite alternate'
          }}>
            <Trophy size={26} fill="#000" /> 🏆 FULL COMBO! 全連擊完美達成
          </div>
        )}

        <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '2rem' }}>
          {evaluationText}
        </p>

        {/* Score & Grade Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Grade Badge */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 800, textTransform: 'uppercase' }}>評價 GRADE</p>
            <div style={{
              fontSize: '5.5rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: gradeColor,
              textShadow: `0 0 25px ${gradeColor}`,
              lineHeight: 1
            }}>
              {grade}
            </div>
          </div>

          <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.15)' }} />

          {/* Score Display */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 800, textTransform: 'uppercase' }}>總得票數 (FINAL SCORE)</p>
            <div style={{
              fontSize: '3.2rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 20px rgba(255, 230, 0, 0.7)'
            }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: '1.2rem', color: '#fff' }}>票</span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Grid (Max Combo / Max Possible Combo) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2.2rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800 }}>最高連擊 (MAX COMBO)</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: isFullCombo ? '#ffe600' : '#00f0ff', marginTop: '4px' }}>
              {stats.maxCombo} <span style={{ fontSize: '0.85rem', color: '#888' }}>/ {maxPossibleCombo} 極限</span>
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,230,0,0.3)' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800 }}>完美 WINK (PERFECT)</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffe600', marginTop: '4px' }}>
              {stats.perfectCount}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800 }}>良好拜票 (GREAT)</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00f0ff', marginTop: '4px' }}>
              {stats.greatCount}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,0,127,0.3)' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800 }}>失誤/撞擊 (MISS)</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: stats.missCount === 0 ? '#00f0ff' : '#ff007f', marginTop: '4px' }}>
              {stats.missCount}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
          <button
            className="muse-btn muse-btn-cyan"
            onClick={onReplay}
            style={{ flex: 1, padding: '1rem', fontSize: '1.25rem' }}
          >
            <span><RotateCcw size={22} /> 再次競選拜票 (REPLAY)</span>
          </button>

          <button
            className="muse-btn muse-btn-yellow"
            onClick={onHome}
            style={{ flex: 1, padding: '1rem', fontSize: '1.25rem' }}
          >
            <span><Home size={22} /> 返回選單 (MAIN MENU)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
