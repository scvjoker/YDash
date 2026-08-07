import React, { useState, useEffect } from 'react';
import { SONG_REGISTRY, SongData } from '../game/SongRegistry';
import { audioEngine } from '../game/AudioEngine';

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
  const [coverErrors, setCoverErrors] = useState<{ [id: string]: boolean }>({});
  const [realDurationSec, setRealDurationSec] = useState<number | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play audio preview when clicking a song card with Strict Mutex Protection
  useEffect(() => {
    audioEngine.stopAllAudio();
    setRealDurationSec(null);

    let isMounted = true;

    audioEngine.playPreviewFromUrl(selectedSong.audio).then(durationSec => {
      if (isMounted && durationSec) {
        setRealDurationSec(durationSec);
      }
    });

    return () => {
      isMounted = false;
      audioEngine.stopPreview();
    };
  }, [selectedSong]);

  const handleConfirmPlay = () => {
    audioEngine.stopAllAudio();
    onSelectSong(selectedSong, difficulty, speed);
  };

  const handleClose = () => {
    audioEngine.stopAllAudio();
    onClose();
  };

  const getStageBadgeColor = (stage: '起' | '承' | '轉' | '合' | 'DLC') => {
    switch (stage) {
      case '起': return { bg: '#00f0ff', color: '#000' };
      case '承': return { bg: '#ffe600', color: '#000' };
      case '轉': return { bg: '#ff007f', color: '#fff' };
      case '合': return { bg: '#a200ff', color: '#fff' };
      case 'DLC': return { bg: 'linear-gradient(90deg, #ffe600, #ff007f)', color: '#000' };
    }
  };

  const getSmartCover = (song: SongData) => {
    if (coverErrors[song.id] || !song.cover) {
      return '/assets/tissue_pack.png';
    }
    return song.cover;
  };

  const displayDuration = realDurationSec || selectedSong.duration;

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
      padding: isMobileScreen ? '0.4rem' : '1.2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: '94svh',
        overflowY: 'auto',
        padding: isMobileScreen ? '0.6rem 0.9rem' : '1.8rem 2.2rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: isMobileScreen ? '0.4rem' : '1rem',
            right: isMobileScreen ? '0.4rem' : '1rem',
            background: 'rgba(255, 0, 85, 0.2)',
            border: '1.5px solid #ff0055',
            color: '#fff',
            borderRadius: '50%',
            width: isMobileScreen ? '30px' : '40px',
            height: isMobileScreen ? '30px' : '40px',
            fontWeight: 900,
            fontSize: isMobileScreen ? '0.9rem' : '1.2rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Modal Title Header */}
        <div style={{ marginBottom: isMobileScreen ? '0.4rem' : '1.2rem' }}>
          <h2 style={{
            fontSize: isMobileScreen ? '1.2rem' : '2.2rem',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            color: '#00f0ff',
            textShadow: '0 0 15px rgba(0,240,255,0.6)',
            marginBottom: '2px'
          }}>
            🎵 競選音樂大廳 (8 首精選曲庫)
          </h2>
          <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.72rem' : '0.92rem' }}>
            點擊切換樂曲即可自動試聽！無縫切換零衝突，實時解析動態長度。
          </p>
        </div>

        {/* Main Grid: Left Track List vs Right Selected Song Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobileScreen ? '1fr 1fr' : '1.25fr 1fr', gap: isMobileScreen ? '0.6rem' : '1.5rem', marginBottom: isMobileScreen ? '0.4rem' : '1.2rem' }}>
          {/* LEFT: 8 Songs Selection Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobileScreen ? '0.35rem' : '0.75rem', maxHeight: isMobileScreen ? '65vh' : '54vh', overflowY: 'auto', paddingRight: '4px' }}>
            {SONG_REGISTRY.map(song => {
              const isSelected = selectedSong.id === song.id;
              const stageBadge = getStageBadgeColor(song.storyStage);
              const songCoverSrc = getSmartCover(song);

              return (
                <div
                  key={song.id}
                  onClick={() => setSelectedSong(song)}
                  style={{
                    background: isSelected ? 'rgba(10, 24, 50, 0.95)' : 'rgba(15, 18, 38, 0.65)',
                    border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: isMobileScreen ? '0.35rem 0.6rem' : '0.85rem 1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 15px rgba(0,240,255,0.4)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobileScreen ? '6px' : '12px' }}>
                    {/* Small Cover Thumbnail with Fallback */}
                    <img
                      src={songCoverSrc}
                      onError={() => setCoverErrors(prev => ({ ...prev, [song.id]: true }))}
                      alt={song.title}
                      style={{
                        width: isMobileScreen ? '32px' : '45px',
                        height: isMobileScreen ? '32px' : '45px',
                        borderRadius: '6px',
                        objectFit: 'contain',
                        background: '#07091e',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    />

                    {/* Stage Badge Pill */}
                    <span style={{
                      background: stageBadge.bg,
                      color: stageBadge.color,
                      fontWeight: 900,
                      padding: isMobileScreen ? '2px 6px' : '4px 10px',
                      borderRadius: '6px',
                      fontSize: isMobileScreen ? '0.65rem' : '0.8rem',
                      whiteSpace: 'nowrap'
                    }}>
                      【{song.storyStage}】
                    </span>

                    <div>
                      <h4 style={{
                        fontSize: isMobileScreen ? '0.82rem' : '1.1rem',
                        fontWeight: 900,
                        color: isSelected ? '#00f0ff' : '#fff',
                        marginBottom: '1px'
                      }}>
                        {song.title}
                        {song.isRhapsody && (
                          <span style={{ fontSize: '0.65rem', color: '#ffe600', marginLeft: '4px', border: '1px solid #ffe600', padding: '1px 4px', borderRadius: '4px' }}>
                            ⚡ DLC
                          </span>
                        )}
                      </h4>
                      <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.78rem', color: '#aaa' }}>
                        {song.subtitle} • BPM {song.bpm}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: isMobileScreen ? '0.70rem' : '0.82rem', color: '#ffe600', fontWeight: 800 }}>
                    {'★'.repeat(song.difficultyRating[difficulty])}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Detailed Song Preview Panel */}
          <div className="cyber-panel" style={{ padding: isMobileScreen ? '0.6rem 0.8rem' : '1.4rem', border: '1.5px solid #ffe600', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: isMobileScreen ? '0.5rem' : '1rem', alignItems: 'center', marginBottom: isMobileScreen ? '0.4rem' : '1rem' }}>
                <img
                  src={getSmartCover(selectedSong)}
                  onError={() => setCoverErrors(prev => ({ ...prev, [selectedSong.id]: true }))}
                  alt={selectedSong.title}
                  style={{
                    width: isMobileScreen ? '50px' : '90px',
                    height: isMobileScreen ? '50px' : '90px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    background: '#080a1e',
                    border: '1.5px solid #ffe600',
                    padding: '2px'
                  }}
                />
                <div>
                  <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '1px 6px', borderRadius: '5px', fontSize: isMobileScreen ? '0.65rem' : '0.75rem' }}>
                    【{selectedSong.storyStage}】 (🔊 試聽中)
                  </span>
                  <h3 style={{ fontSize: isMobileScreen ? '1.0rem' : '1.4rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                    {selectedSong.title}
                  </h3>
                  <p style={{ fontSize: isMobileScreen ? '0.70rem' : '0.85rem', color: '#aaa' }}>{selectedSong.artist}</p>
                  <p style={{ fontSize: isMobileScreen ? '0.68rem' : '0.8rem', color: '#ffe600', fontWeight: 800, marginTop: '1px' }}>
                    BPM {selectedSong.bpm} • {Math.floor(displayDuration / 60)}分{displayDuration % 60}秒
                  </p>
                </div>
              </div>

              {/* Story Context Box */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: isMobileScreen ? '0.4rem 0.6rem' : '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,230,0,0.3)', marginBottom: isMobileScreen ? '0.4rem' : '1rem' }}>
                <p style={{ fontSize: isMobileScreen ? '0.70rem' : '0.85rem', color: '#ddd', lineHeight: 1.35 }}>
                  {selectedSong.storyContext}
                </p>
              </div>

              {/* Difficulty Selection */}
              <div style={{ marginBottom: isMobileScreen ? '0.4rem' : '1rem' }}>
                <p style={{ fontSize: isMobileScreen ? '0.68rem' : '0.82rem', color: '#aaa', fontWeight: 800, marginBottom: '4px' }}>難度模式 (DIFFICULTY):</p>
                <div style={{ display: 'flex', gap: isMobileScreen ? '0.3rem' : '0.6rem' }}>
                  {(['Easy', 'Normal', 'Hard'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        flex: 1,
                        padding: isMobileScreen ? '0.25rem' : '0.45rem',
                        background: difficulty === d ? '#ffe600' : 'rgba(255,255,255,0.06)',
                        color: difficulty === d ? '#000' : '#fff',
                        border: difficulty === d ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        fontWeight: 900,
                        fontSize: isMobileScreen ? '0.68rem' : '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Multiplier */}
              <div>
                <p style={{ fontSize: isMobileScreen ? '0.68rem' : '0.82rem', color: '#aaa', fontWeight: 800, marginBottom: '4px' }}>流速 (SPEED):</p>
                <div style={{ display: 'flex', gap: isMobileScreen ? '2px' : '5px' }}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      style={{
                        flex: 1,
                        background: speed === s ? '#00f0ff' : 'rgba(255,255,255,0.08)',
                        color: speed === s ? '#000' : '#fff',
                        border: speed === s ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        padding: isMobileScreen ? '1px 0' : '3px 0',
                        fontWeight: 900,
                        fontSize: isMobileScreen ? '0.62rem' : '0.78rem',
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
              style={{ marginTop: isMobileScreen ? '0.5rem' : '1.2rem', width: '100%', fontSize: isMobileScreen ? '0.90rem' : '1.2rem', padding: isMobileScreen ? '0.45rem' : '0.85rem' }}
            >
              <span>▶ 播放開局 ({difficulty} - {speed.toFixed(2)}x)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
