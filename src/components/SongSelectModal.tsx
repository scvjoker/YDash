import React, { useState, useEffect } from 'react';
import { ArrowDown, Music2, Play } from 'lucide-react';
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
    onSelectSong(selectedSong, currentDifficulty, currentSpeed);
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
        padding: isMobileScreen ? '0.6rem 0.9rem' : '1.5rem 2.0rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)',
        display: 'flex',
        flexDirection: 'column'
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
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Modal Title Header */}
        <div style={{ marginBottom: isMobileScreen ? '0.4rem' : '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: isMobileScreen ? '1.2rem' : '2.1rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#00f0ff',
              textShadow: '0 0 15px rgba(0,240,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Music2 size={isMobileScreen ? 18 : 26} color="#ffe600" /> 競選音樂大廳 (8 首精選曲庫)
            </h2>
            <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.72rem' : '0.90rem', marginTop: '1px' }}>
              點擊切換樂曲即可自動試聽！無縫切換零衝突，實時解析動態長度。
            </p>
          </div>

          {/* SCROLL HINT BADGE */}
          <div style={{
            background: 'rgba(255, 230, 0, 0.12)',
            border: '1.5px solid rgba(255, 230, 0, 0.4)',
            color: '#ffe600',
            borderRadius: '12px',
            padding: isMobileScreen ? '2px 8px' : '5px 14px',
            fontSize: isMobileScreen ? '0.68rem' : '0.85rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: isMobileScreen ? '34px' : '46px'
          }}>
            <ArrowDown size={isMobileScreen ? 11 : 16} /> ↕️ 可上下滑動瀏覽
          </div>
        </div>

        {/* Main Grid: Exact Equal Height Containers (58vh on mobile, 56vh on desktop) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobileScreen ? '1fr 1fr' : '1.25fr 1fr',
          gap: isMobileScreen ? '0.6rem' : '1.4rem',
          alignItems: 'stretch'
        }}>
          {/* LEFT COLUMN: 8 Songs List with Cyber Scrollbar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobileScreen ? '0.35rem' : '0.65rem',
            height: isMobileScreen ? '58vh' : '56vh',
            maxHeight: isMobileScreen ? '58vh' : '56vh',
            overflowY: 'scroll',
            paddingRight: '10px'
          }} className="cyber-scrollbar">
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
                    padding: isMobileScreen ? '0.35rem 0.6rem' : '0.75rem 1.0rem',
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
                        width: isMobileScreen ? '32px' : '44px',
                        height: isMobileScreen ? '32px' : '44px',
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
                      padding: isMobileScreen ? '2px 6px' : '3px 9px',
                      borderRadius: '6px',
                      fontSize: isMobileScreen ? '0.65rem' : '0.78rem',
                      whiteSpace: 'nowrap'
                    }}>
                      【{song.storyStage}】
                    </span>

                    <div>
                      <h4 style={{
                        fontSize: isMobileScreen ? '0.82rem' : '1.05rem',
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
                    {'★'.repeat(song.difficultyRating[currentDifficulty])}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Detailed Song Preview Panel 100% Equal Height to Left */}
          <div className="cyber-panel cyber-scrollbar" style={{
            padding: isMobileScreen ? '0.6rem 0.8rem' : '1.2rem 1.4rem',
            border: '1.5px solid #ffe600',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: isMobileScreen ? '58vh' : '56vh',
            maxHeight: isMobileScreen ? '58vh' : '56vh',
            overflowY: 'auto'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: isMobileScreen ? '0.5rem' : '1rem', alignItems: 'center', marginBottom: isMobileScreen ? '0.5rem' : '1.0rem' }}>
                <img
                  src={getSmartCover(selectedSong)}
                  onError={() => setCoverErrors(prev => ({ ...prev, [selectedSong.id]: true }))}
                  alt={selectedSong.title}
                  style={{
                    width: isMobileScreen ? '55px' : '90px',
                    height: isMobileScreen ? '55px' : '90px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    background: '#080a1e',
                    border: '1.5px solid #ffe600',
                    padding: '2px'
                  }}
                />
                <div>
                  <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '5px', fontSize: isMobileScreen ? '0.65rem' : '0.78rem' }}>
                    【{selectedSong.storyStage}】階段曲目 (🔊 試聽中)
                  </span>
                  <h3 style={{ fontSize: isMobileScreen ? '1.05rem' : '1.45rem', fontWeight: 900, color: '#fff', marginTop: '3px' }}>
                    {selectedSong.title}
                  </h3>
                  <p style={{ fontSize: isMobileScreen ? '0.72rem' : '0.85rem', color: '#aaa' }}>{selectedSong.artist}</p>
                  <p style={{ fontSize: isMobileScreen ? '0.70rem' : '0.80rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>
                    BPM {selectedSong.bpm} • {Math.floor(displayDuration / 60)}分{displayDuration % 60}秒
                  </p>
                </div>
              </div>

              {/* Story Context Box */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: isMobileScreen ? '0.5rem 0.7rem' : '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid rgba(255,230,0,0.3)', marginBottom: isMobileScreen ? '0.5rem' : '1.0rem' }}>
                <p style={{ fontSize: isMobileScreen ? '0.72rem' : '0.88rem', color: '#ddd', lineHeight: 1.4 }}>
                  {selectedSong.storyContext}
                </p>
              </div>
            </div>

            {/* Confirm Play Button (Streamlined with current external Difficulty & Speed) */}
            <button
              className="muse-btn"
              onClick={handleConfirmPlay}
              style={{ marginTop: isMobileScreen ? '0.5rem' : '1.0rem', width: '100%', fontSize: isMobileScreen ? '0.95rem' : '1.2rem', padding: isMobileScreen ? '0.55rem' : '0.85rem' }}
            >
              <span><Play fill="#000" size={isMobileScreen ? 16 : 20} /> 播放開局 ({currentDifficulty} - {currentSpeed.toFixed(2)}x)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
