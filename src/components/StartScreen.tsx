import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Wand2, Disc, Flame, Gauge, Maximize, HelpCircle, Music2 } from 'lucide-react';
import { CostumeId } from '../types/game';
import { COSTUMES_DATA } from '../game/Beatmaps';
import { SongData } from '../game/SongRegistry';

interface StartScreenProps {
  currentSong: SongData;
  selectedCostume: CostumeId;
  onStartGame: (song: SongData, difficulty: 'Easy' | 'Normal' | 'Hard', noteSpeed: number) => void;
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [selectedNoteSpeed, setSelectedNoteSpeed] = useState<number>(1.0);
  const [paperSprinkles, setPaperSprinkles] = useState<number[]>([]);
  const [imgSrc, setImgSrc] = useState<string>('/yoaka_main.jpg');
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  const costumeObj = COSTUMES_DATA.find(c => c.id === selectedCostume) || COSTUMES_DATA[0];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    let candidates: string[] = ['/yoaka_main.jpg'];
    if (selectedCostume === 'office_glasses') {
      candidates = ['/assets/yoaka_office.png', '/assets/yoaka_office.jpg', '/yoaka_office.png', '/yoaka_office.jpg', '/yoaka_main.jpg'];
    } else if (selectedCostume === 'kpop_idol') {
      candidates = ['/assets/yoaka_kpop.png', '/assets/yoaka_kpop.jpg', '/yoaka_kpop.png', '/yoaka_kpop.jpg', '/yoaka_main.jpg'];
    } else {
      candidates = ['/assets/yoaka_default.png', '/assets/yoaka_default.jpg', '/yoaka_default.png', '/yoaka_default.jpg', '/yoaka_main.jpg'];
    }

    let index = 0;
    const testNext = () => {
      if (index < candidates.length) {
        const url = candidates[index++];
        const img = new Image();
        img.onload = () => setImgSrc(url);
        img.onerror = () => testNext();
        img.src = url;
      }
    };
    testNext();
  }, [selectedCostume]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPaperSprinkles(prev => [...prev.slice(-14), Date.now()]);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100svh',
      position: 'relative',
      backgroundColor: '#070814',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Cyber Rays & Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 70% 50%, #2b0645 0%, #0d081f 55%, #05060f 100%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Tissue Paper Rain Animation */}
      {paperSprinkles.map(id => (
        <div key={id} style={{
          position: 'absolute',
          left: `${45 + Math.random() * 45}%`,
          top: '20%',
          fontSize: '2.2rem',
          animation: 'tissueRain 2.5s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          ✨
        </div>
      ))}

      {/* TOP RIGHT FUNCTION BUTTONS GROUP */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0.4rem) + 0.5rem)',
        right: '1.2rem',
        zIndex: 10,
        display: 'flex',
        gap: '0.6rem'
      }}>
        {/* TUTORIAL BUTTON */}
        <button
          onClick={onOpenTutorial}
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1.5px solid #00f0ff',
            color: '#00f0ff',
            borderRadius: '20px',
            padding: isMobileScreen ? '4px 12px' : '6px 16px',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            fontSize: isMobileScreen ? '0.75rem' : '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0,240,255,0.4)'
          }}
        >
          <HelpCircle size={15} /> ❓ 新手指南
        </button>

        {/* FULLSCREEN BUTTON */}
        <button
          onClick={handleFullscreen}
          style={{
            background: 'rgba(255, 230, 0, 0.15)',
            border: '1.5px solid #ffe600',
            color: '#ffe600',
            borderRadius: '20px',
            padding: isMobileScreen ? '4px 12px' : '6px 16px',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            fontSize: isMobileScreen ? '0.75rem' : '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255,230,0,0.4)'
          }}
        >
          <Maximize size={15} /> 全螢幕
        </button>
      </div>

      {/* LEFT HALF (50vw): Borderless Clean Hero Character Artwork Showcase */}
      <div style={{
        width: '50vw',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobileScreen ? '0.4rem' : '1.5rem',
        zIndex: 2
      }}>
        <div className="float-animation" style={{
          position: 'relative',
          width: '100%',
          height: '85%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={imgSrc}
            alt="Yoaka Hero Character Artwork"
            style={{
              maxHeight: isMobileScreen ? '76vh' : '84vh',
              maxWidth: isMobileScreen ? '42vw' : '46vw',
              objectFit: 'contain',
              borderRadius: '24px',
              filter: `drop-shadow(0 0 30px ${costumeObj.accentColor}) contrast(1.06) brightness(1.05)`
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: isMobileScreen ? '6px' : '18px',
            background: 'rgba(10, 12, 28, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${costumeObj.accentColor}`,
            borderRadius: '20px',
            padding: isMobileScreen ? '3px 12px' : '8px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 0 20px ${costumeObj.accentColor}`
          }}>
            <span style={{
              color: costumeObj.accentColor,
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              fontSize: isMobileScreen ? '0.82rem' : '1.15rem'
            }}>
              👑 {costumeObj.name}
            </span>
            <span style={{
              background: costumeObj.accentColor,
              color: '#000',
              fontWeight: 900,
              padding: isMobileScreen ? '2px 8px' : '4px 14px',
              borderRadius: '14px',
              fontSize: isMobileScreen ? '0.68rem' : '0.8rem'
            }}>
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT HALF (50vw): Mobile-Friendly Non-Overflowing Panel */}
      <div style={{
        width: '50vw',
        maxHeight: '92svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobileScreen ? '0.2rem 2.5vw 0.2rem 0.5vw' : '0 4vw 0 1vw',
        margin: 'auto 0',
        zIndex: 2,
        gap: isMobileScreen ? '0.35rem' : '0.9rem',
        overflowY: 'auto'
      }}>
        {/* Top Campaign Badge Pill */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          padding: isMobileScreen ? '2px 10px' : '5px 22px',
          borderRadius: '30px',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Flame size={isMobileScreen ? 12 : 18} color="#ffe600" />
          <span style={{ fontSize: isMobileScreen ? '0.72rem' : '1rem', fontWeight: 900, color: '#000', letterSpacing: '1px' }}>
            WEB3 小島區里長熱血大選！
          </span>
        </div>

        {/* Main Neon Title & Slogan Catchphrase Group */}
        <div>
          <h1 style={{
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? 'calc(1.5rem + 1.2vh)' : '4.2rem',
            fontWeight: 900,
            fontStyle: 'italic',
            background: 'linear-gradient(180deg, #ffffff 0%, #ffe600 45%, #ff007f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(255, 0, 127, 0.9)) drop-shadow(0 0 35px rgba(0, 240, 255, 0.6))',
            lineHeight: 1.0,
            marginBottom: '0.2rem',
            letterSpacing: '-1px'
          }}>
            YOAKA DASH!
          </h1>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: isMobileScreen ? '0.78rem' : '1.15rem',
            color: '#00f0ff',
            fontWeight: 900,
            background: 'rgba(0, 240, 255, 0.12)',
            padding: isMobileScreen ? '0.15rem 0.8rem' : '0.35rem 1.5rem',
            borderRadius: '40px',
            border: '1.5px solid rgba(0, 240, 255, 0.5)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            <span>「家人們，幫主包個忙！」</span>
          </div>
        </div>

        {/* Selected Track Display Card */}
        <div className="cyber-panel" style={{ padding: isMobileScreen ? '0.5rem 0.75rem' : '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobileScreen ? '0.15rem' : '0.5rem' }}>
            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: isMobileScreen ? '0.72rem' : '0.9rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Disc size={isMobileScreen ? 12 : 18} /> 【{currentSong.storyStage}】戰歌
            </span>
            
            <button
              onClick={onOpenSongSelect}
              style={{
                background: 'rgba(0, 240, 255, 0.2)',
                border: '1.5px solid #00f0ff',
                color: '#00f0ff',
                padding: isMobileScreen ? '2px 8px' : '4px 14px',
                borderRadius: '16px',
                fontWeight: 900,
                fontSize: isMobileScreen ? '0.70rem' : '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Music2 size={12} /> 🎵 切換樂曲
            </button>
          </div>

          <h3 style={{ fontSize: isMobileScreen ? '1.1rem' : '1.8rem', fontWeight: 900, marginBottom: '0.1rem', color: '#fff', textShadow: '0 0 15px rgba(255,230,0,0.5)' }}>
            {currentSong.title}
            {currentSong.isRhapsody && (
              <span style={{ fontSize: '0.72rem', color: '#ffe600', marginLeft: '6px', border: '1px solid #ffe600', padding: '1px 6px', borderRadius: '6px' }}>
                ⚡ 狂想曲
              </span>
            )}
          </h3>
          <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.72rem' : '0.9rem', marginBottom: '0.4rem' }}>
            {currentSong.subtitle} • BPM {currentSong.bpm}
          </p>

          {/* Difficulty Switch Pills */}
          <div style={{ display: 'flex', gap: isMobileScreen ? '0.3rem' : '0.6rem', marginTop: isMobileScreen ? '0.3rem' : '0.6rem' }}>
            {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  flex: 1,
                  padding: isMobileScreen ? '0.25rem' : '0.5rem',
                  background: selectedDifficulty === diff ? (diff === 'Hard' ? 'linear-gradient(135deg, #ff007f, #d80068)' : diff === 'Normal' ? 'linear-gradient(135deg, #00f0ff, #0077b6)' : 'linear-gradient(135deg, #ffe600, #ffb703)') : 'rgba(255,255,255,0.05)',
                  border: selectedDifficulty === diff ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: selectedDifficulty === diff && diff === 'Normal' ? '#000' : selectedDifficulty === diff && diff === 'Easy' ? '#000' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: isMobileScreen ? '0.72rem' : '0.9rem',
                  transition: 'all 0.25s'
                }}
              >
                {diff === 'Easy' && (isMobileScreen ? 'Easy' : '🌱 Easy')}
                {diff === 'Normal' && (isMobileScreen ? 'Normal' : '🔥 Normal')}
                {diff === 'Hard' && (isMobileScreen ? 'Hard' : '⚡ Hard')}
              </button>
            ))}
          </div>

          {/* Note Speed Multiplier Selection Bar */}
          <div style={{ marginTop: isMobileScreen ? '0.3rem' : '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)', padding: isMobileScreen ? '0.2rem 0.5rem' : '0.4rem 0.8rem', borderRadius: '10px' }}>
            <span style={{ fontSize: isMobileScreen ? '0.68rem' : '0.82rem', color: '#aaa', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Gauge size={isMobileScreen ? 11 : 16} color="#ffe600" /> 流速:
            </span>
            <div style={{ display: 'flex', gap: isMobileScreen ? '2px' : '4px' }}>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSelectedNoteSpeed(speed)}
                  style={{
                    background: selectedNoteSpeed === speed ? (speed < 1.0 ? '#00f0ff' : '#ffe600') : 'rgba(255,255,255,0.08)',
                    color: selectedNoteSpeed === speed ? '#000' : '#fff',
                    border: selectedNoteSpeed === speed ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    padding: isMobileScreen ? '1px 4px' : '2px 8px',
                    fontWeight: 900,
                    fontSize: isMobileScreen ? '0.65rem' : '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {speed < 1.0 ? `🐢${speed.toFixed(2)}x` : `${speed.toFixed(2)}x`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          className="muse-btn"
          onClick={() => onStartGame(currentSong, selectedDifficulty, selectedNoteSpeed)}
          style={{ width: '100%', fontSize: isMobileScreen ? '1.05rem' : '1.45rem', padding: isMobileScreen ? '0.5rem' : '0.9rem' }}
        >
          <span><Play fill="#fff" size={isMobileScreen ? 16 : 24} /> 開啟競選拜票 ({selectedNoteSpeed.toFixed(2)}x)</span>
        </button>

        {/* Sub Option Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobileScreen ? '0.35rem' : '0.8rem' }}>
          <button className="muse-btn muse-btn-cyan" onClick={onOpenCostumes} style={{ fontSize: isMobileScreen ? '0.75rem' : '1rem', padding: isMobileScreen ? '0.45rem' : '0.8rem' }}>
            <span><Sparkles size={isMobileScreen ? 13 : 18} /> 造型: {costumeObj.name}</span>
          </button>

          <button className="muse-btn muse-btn-yellow" onClick={onOpenEditor} style={{ fontSize: isMobileScreen ? '0.75rem' : '1rem', padding: isMobileScreen ? '0.45rem' : '0.8rem' }}>
            <span><Wand2 size={isMobileScreen ? 13 : 18} /> A+B 譜面創作者</span>
          </button>
        </div>
      </div>
    </div>
  );
};
