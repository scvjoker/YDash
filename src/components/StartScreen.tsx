import React, { useState } from 'react';
import { SongData } from '../game/SongRegistry';
import { CostumeId } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface StartScreenProps {
  currentSong: SongData;
  selectedCostume: CostumeId;
  onStartGame: (song: SongData, difficulty: 'Easy' | 'Normal' | 'Hard', speed: number) => void;
  onOpenSongSelect: () => void;
  onOpenTutorial: () => void;
  onOpenCostumes: () => void;
  onOpenEditor: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  currentSong,
  selectedCostume,
  onStartGame,
  onOpenSongSelect,
  onOpenTutorial,
  onOpenCostumes,
  onOpenEditor
}) => {
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [speed, setSpeed] = useState<number>(1.0);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(audioEngine.isSfxEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(audioEngine.isVibrationEnabled);

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

  const getCostumeName = (costume: CostumeId) => {
    switch (costume) {
      case 'campaign_vest': return '競選背心裝 (選民支持度受擊損耗 -33%)';
      case 'office_glasses': return '眼鏡學霸裝 (得票數額外 +20% 加成)';
      case 'kpop_idol': return '偶像滿分裝 (Fever 熱血條累積速度雙倍)';
    }
  };

  const getCostumeBadge = (costume: CostumeId) => {
    switch (costume) {
      case 'campaign_vest': return { label: '競選 Yoaka', color: '#00f0ff' };
      case 'office_glasses': return { label: '學霸 Yoaka', color: '#ffe600' };
      case 'kpop_idol': return { label: '偶像 Yoaka', color: '#ff007f' };
    }
  };

  const currentBadge = getCostumeBadge(selectedCostume);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(8, 10, 26, 0.92) 0%, rgba(20, 10, 35, 0.95) 100%), url("/cyber_runway_bg.png") center/cover no-repeat',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 3rem',
      color: '#fff',
      zIndex: 20
    }}>
      {/* Top Header Bar: Logo & Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{
            fontSize: '3.6rem',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #00f0ff, #ffe600, #ff007f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.6))',
            margin: 0
          }}>
            YOAKA DASH 競選冒險音遊
          </h1>
          <p style={{ color: '#00f0ff', margin: '4px 0 0 0', fontWeight: 700, letterSpacing: '1px', fontSize: '1.05rem' }}>
            賽博龐克跑道 • 音浪全開 • 拉票拜票衝刺高票勝選！
          </p>
        </div>

        {/* Top Right Action Buttons including SFX & Vibration Toggles */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {/* Drum SFX Toggle */}
          <button
            onClick={toggleSfx}
            style={{
              padding: '0.6rem 0.9rem',
              background: sfxEnabled ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: sfxEnabled ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.2)',
              color: sfxEnabled ? '#00f0ff' : '#aaa',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🥁 鼓聲: <span style={{ color: sfxEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{sfxEnabled ? 'ON 啟用' : 'OFF 靜音'}</span>
          </button>

          {/* Mobile Haptic Vibration Toggle */}
          <button
            onClick={toggleVibration}
            style={{
              padding: '0.6rem 0.9rem',
              background: vibrationEnabled ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: vibrationEnabled ? '1.5px solid #ff007f' : '1px solid rgba(255, 255, 255, 0.2)',
              color: vibrationEnabled ? '#ff007f' : '#aaa',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📳 震動: <span style={{ color: vibrationEnabled ? '#ffe600' : '#888', fontWeight: 900 }}>{vibrationEnabled ? 'ON 啟用' : 'OFF 關閉'}</span>
          </button>

          <button
            onClick={onOpenTutorial}
            style={{
              padding: '0.6rem 1.1rem',
              background: 'rgba(255, 230, 0, 0.15)',
              border: '1.5px solid #ffe600',
              color: '#ffe600',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ❓ 新手指南
          </button>

          <button
            onClick={onOpenCostumes}
            style={{
              padding: '0.6rem 1.1rem',
              background: 'rgba(255, 0, 127, 0.15)',
              border: '1.5px solid #ff007f',
              color: '#ff007f',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            👗 戰力造型館
          </button>

          <button
            onClick={onOpenEditor}
            style={{
              padding: '0.6rem 1.1rem',
              background: 'rgba(0, 240, 255, 0.12)',
              border: '1.5px solid #00f0ff',
              color: '#00f0ff',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🎹 自製譜面工作室
          </button>
        </div>
      </div>

      {/* Center Main Control Content: Current Song Box & Game Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
        {/* Left Side: Yoaka Character Display Card */}
        <div className="cyber-panel" style={{
          padding: '1.8rem',
          border: `2px solid ${currentBadge.color}`,
          boxShadow: `0 0 30px ${currentBadge.color}40`,
          display: 'flex',
          gap: '1.8rem',
          alignItems: 'center'
        }}>
          <img
            src={
              selectedCostume === 'office_glasses' ? '/assets/yoaka_office.png' :
              selectedCostume === 'kpop_idol' ? '/assets/yoaka_kpop.png' :
              '/assets/yoaka_default.png'
            }
            alt="Yoaka Runner"
            style={{
              width: '165px',
              height: '165px',
              objectFit: 'contain',
              borderRadius: '16px',
              background: '#07081a',
              border: `2px solid ${currentBadge.color}`,
              padding: '6px'
            }}
          />
          <div>
            <span style={{
              background: currentBadge.color,
              color: '#000',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              當前參選造型: {currentBadge.label}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '8px 0 4px 0' }}>
              {getCostumeName(selectedCostume)}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#aaa', margin: 0 }}>
              按鍵提示：使用 <b style={{ color: '#00f0ff' }}>[D/F]</b> 鍵空中投紙拉票，<b style={{ color: '#ff007f' }}>[J/K]</b> 鍵地面投紙拉票！
            </p>
          </div>
        </div>

        {/* Right Side: Selected Song & Speed / Difficulty Selector */}
        <div className="cyber-panel" style={{ padding: '1.8rem', border: '2px solid #ffe600', boxShadow: '0 0 30px rgba(255, 230, 0, 0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '3px 10px', borderRadius: '8px', fontSize: '0.85rem' }}>
              【{currentSong.storyStage}】當前競選戰歌
            </span>
            <button
              onClick={onOpenSongSelect}
              style={{
                padding: '0.45rem 0.9rem',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1.5px solid #00f0ff',
                color: '#00f0ff',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)'
              }}
            >
              🎵 切換樂曲 (SONG HALL)
            </button>
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 0 4px 0' }}>
            {currentSong.title}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 1rem 0' }}>
            {currentSong.subtitle} • {currentSong.artist} • BPM {currentSong.bpm}
          </p>

          {/* Difficulty Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#aaa', fontWeight: 800, marginBottom: '6px' }}>難度模式選擇 (DIFFICULTY):</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {(['Easy', 'Normal', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: difficulty === d ? '#ffe600' : 'rgba(255,255,255,0.06)',
                    color: difficulty === d ? '#000' : '#fff',
                    border: difficulty === d ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {d} ({'★'.repeat(currentSong.difficultyRating[d])})
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selection */}
          <div style={{ marginBottom: '1.4rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#aaa', fontWeight: 800, marginBottom: '6px' }}>音符流速 (SPEED):</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    flex: 1,
                    background: speed === s ? '#00f0ff' : 'rgba(255,255,255,0.08)',
                    color: speed === s ? '#000' : '#fff',
                    border: speed === s ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    padding: '4px 0',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {s.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>

          {/* Big Start Button */}
          <button
            className="muse-btn"
            onClick={() => onStartGame(currentSong, difficulty, speed)}
            style={{ width: '100%', fontSize: '1.35rem', padding: '0.95rem' }}
          >
            <span>🚀 開啟拜票競選狂歡 ({difficulty} - {speed.toFixed(2)}x)</span>
          </button>
        </div>
      </div>

      {/* Footer Instructions */}
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
        Press <b style={{ color: '#00f0ff' }}>D/F</b> (Air) or <b style={{ color: '#ff007f' }}>J/K</b> (Ground) to hit voters. Press <b style={{ color: '#ffe600' }}>ESC</b> anytime to Pause.
      </div>
    </div>
  );
};
