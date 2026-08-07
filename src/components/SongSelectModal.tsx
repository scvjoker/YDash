import React, { useState } from 'react';
import { SONG_REGISTRY, SongData } from '../game/SongRegistry';

interface SongSelectModalProps {
  currentSongId: string;
  currentDifficulty: 'Easy' | 'Normal' | 'Hard';
  currentSpeed: number;
  onSelectSong: (song: SongData, difficulty: 'Easy' | 'Normal' | 'Hard', speed: number) => void;
  onClose: () => void;
}

export const SongSelectModal: React.FC<SongSelectModalProps> = ({
  currentSongId,
  currentDifficulty,
  currentSpeed,
  onSelectSong,
  onClose
}) => {
  const [selectedSong, setSelectedSong] = useState<SongData>(
    SONG_REGISTRY.find(s => s.id === currentSongId) || SONG_REGISTRY[0]
  );
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>(currentDifficulty);
  const [speed, setSpeed] = useState<number>(currentSpeed);

  const handleConfirmPlay = () => {
    onSelectSong(selectedSong, difficulty, speed);
  };

  const getStageBadgeColor = (stage: '起' | '承' | '轉' | '合') => {
    switch (stage) {
      case '起': return { bg: '#00f0ff', color: '#000' };
      case '承': return { bg: '#ffe600', color: '#000' };
      case '轉': return { bg: '#ff007f', color: '#fff' };
      case '合': return { bg: '#a200ff', color: '#fff' };
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1.2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '1020px',
        maxWidth: '96vw',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '1.8rem 2.2rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 0, 85, 0.2)',
            border: '1.5px solid #ff0055',
            color: '#fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontWeight: 900,
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Modal Title Header */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            color: '#00f0ff',
            textShadow: '0 0 15px rgba(0,240,255,0.6)',
            marginBottom: '4px'
          }}>
            🎵 競選音樂大廳 (SONG SELECTION)
          </h2>
          <p style={{ color: '#aaa', fontSize: '0.92rem' }}>
            體驗起承轉合熱血競選故事線！狂想曲版本長度更長、拍點難度更具挑戰性。
          </p>
        </div>

        {/* Main Grid: Left Track List vs Right Selected Song Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' }}>
          {/* LEFT: 6 Songs Selection Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '52vh', overflowY: 'auto', paddingRight: '6px' }}>
            {SONG_REGISTRY.map(song => {
              const isSelected = selectedSong.id === song.id;
              const stageBadge = getStageBadgeColor(song.storyStage);

              return (
                <div
                  key={song.id}
                  onClick={() => setSelectedSong(song)}
                  style={{
                    background: isSelected ? 'rgba(10, 24, 50, 0.95)' : 'rgba(15, 18, 38, 0.65)',
                    border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '14px',
                    padding: '0.85rem 1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 20px rgba(0,240,255,0.4)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Stage Badge Pill */}
                    <span style={{
                      background: stageBadge.bg,
                      color: stageBadge.color,
                      fontWeight: 900,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap'
                    }}>
                      【{song.storyStage}】
                    </span>

                    <div>
                      <h4 style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: isSelected ? '#00f0ff' : '#fff',
                        marginBottom: '2px'
                      }}>
                        {song.title}
                        {song.isRhapsody && (
                          <span style={{ fontSize: '0.75rem', color: '#ffe600', marginLeft: '8px', border: '1px solid #ffe600', padding: '1px 6px', borderRadius: '6px' }}>
                            ⚡ 狂想曲 (高難/長曲)
                          </span>
                        )}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        {song.subtitle} • BPM {song.bpm}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.82rem', color: '#ffe600', fontWeight: 800 }}>
                    {'★'.repeat(song.difficultyRating[difficulty])}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Detailed Song Preview Panel */}
          <div className="cyber-panel" style={{ padding: '1.4rem', border: '1.5px solid #ffe600', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={selectedSong.cover}
                  alt={selectedSong.title}
                  style={{
                    width: '90px',
                    height: '90px',
                    objectFit: 'contain',
                    borderRadius: '14px',
                    background: '#080a1e',
                    border: '1.5px solid #ffe600',
                    padding: '4px'
                  }}
                />
                <div>
                  <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    【{selectedSong.storyStage}】階段曲目
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
                    {selectedSong.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#aaa' }}>{selectedSong.artist}</p>
                  <p style={{ fontSize: '0.8rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>
                    BPM {selectedSong.bpm} • 大約 {Math.floor(selectedSong.duration / 60)}分{selectedSong.duration % 60}秒
                  </p>
                </div>
              </div>

              {/* Story Context Box */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,230,0,0.3)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#ddd', lineHeight: 1.45 }}>
                  {selectedSong.storyContext}
                </p>
              </div>

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
                        padding: '0.45rem',
                        background: difficulty === d ? '#ffe600' : 'rgba(255,255,255,0.06)',
                        color: difficulty === d ? '#000' : '#fff',
                        border: difficulty === d ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {d} ({'★'.repeat(selectedSong.difficultyRating[d])})
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Multiplier */}
              <div>
                <p style={{ fontSize: '0.82rem', color: '#aaa', fontWeight: 800, marginBottom: '6px' }}>音符流速 (SPEED):</p>
                <div style={{ display: 'flex', gap: '5px' }}>
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
                        padding: '3px 0',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s.toFixed(2)}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirm Play Button */}
            <button
              className="muse-btn"
              onClick={handleConfirmPlay}
              style={{ marginTop: '1.2rem', width: '100%', fontSize: '1.2rem', padding: '0.85rem' }}
            >
              <span>▶ 播放此曲目並開局 ({difficulty} - {speed.toFixed(2)}x)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
