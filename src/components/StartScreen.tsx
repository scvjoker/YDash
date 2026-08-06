import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Wand2, Disc, Flame, Gauge, Maximize } from 'lucide-react';
import { BeatmapData, CostumeId } from '../types/game';
import { DEFAULT_BEATMAPS, COSTUMES_DATA } from '../game/Beatmaps';

interface StartScreenProps {
  onStartGame: (beatmap: BeatmapData, difficulty: 'Easy' | 'Normal' | 'Hard', noteSpeed: number) => void;
  onOpenCostumes: () => void;
  onOpenEditor: () => void;
  selectedCostume: CostumeId;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenCostumes,
  onOpenEditor,
  selectedCostume
}) => {
  const [selectedMap] = useState<BeatmapData>(DEFAULT_BEATMAPS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [selectedNoteSpeed, setSelectedNoteSpeed] = useState<number>(1.0);
  const [paperSprinkles, setPaperSprinkles] = useState<number[]>([]);
  const [imgSrc, setImgSrc] = useState<string>('/yoaka_main.jpg');

  const costumeObj = COSTUMES_DATA.find(c => c.id === selectedCostume) || COSTUMES_DATA[0];

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
      height: '100vh',
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
          fontSize: '2rem',
          animation: 'tissueRain 2.5s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          ✨
        </div>
      ))}

      {/* TOP RIGHT FULLSCREEN BUTTON */}
      <button
        onClick={handleFullscreen}
        style={{
          position: 'absolute',
          top: '0.8rem',
          right: '1rem',
          zIndex: 10,
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
          gap: '5px',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(255,230,0,0.4)'
        }}
      >
        <Maximize size={14} /> 全螢幕
      </button>

      {/* LEFT HALF (50vw): Borderless Clean Hero Character Artwork Showcase */}
      <div style={{
        width: '45vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        zIndex: 2
      }}>
        <div className="float-animation" style={{
          position: 'relative',
          width: '100%',
          height: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={imgSrc}
            alt="Yoaka Hero Character Artwork"
            style={{
              maxHeight: '82vh',
              maxWidth: '42vw',
              objectFit: 'contain',
              borderRadius: '20px',
              filter: `drop-shadow(0 0 25px ${costumeObj.accentColor}) contrast(1.05) brightness(1.05)`
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: '10px',
            background: 'rgba(10, 12, 28, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${costumeObj.accentColor}`,
            borderRadius: '18px',
            padding: '4px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 0 15px ${costumeObj.accentColor}`
          }}>
            <span style={{
              color: costumeObj.accentColor,
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              fontSize: '0.9rem'
            }}>
              👑 {costumeObj.name}
            </span>
            <span style={{
              background: costumeObj.accentColor,
              color: '#000',
              fontWeight: 900,
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.7rem'
            }}>
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT HALF (55vw): Mobile-Adaptive Auto-Fitting Compact Menu Container */}
      <div style={{
        width: '55vw',
        maxHeight: '98vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0.4rem 2.5vw 0.4rem 0.5vw',
        zIndex: 2,
        gap: '0.5rem',
        overflowY: 'auto'
      }}>
        {/* Top Campaign Badge Pill */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          padding: '3px 14px',
          borderRadius: '24px',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Flame size={14} color="#ffe600" />
          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#000', letterSpacing: '1px' }}>
            WEB3 小島區里長熱血大選！
          </span>
        </div>

        {/* Main Neon Title & Slogan Catchphrase Group */}
        <div>
          <h1 style={{
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: 'calc(1.8rem + 1.8vh)',
            fontWeight: 900,
            fontStyle: 'italic',
            background: 'linear-gradient(180deg, #ffffff 0%, #ffe600 45%, #ff007f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(255, 0, 127, 0.9))',
            lineHeight: 1.0,
            marginBottom: '0.1rem',
            letterSpacing: '-1px'
          }}>
            YOAKA DASH!
          </h1>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#00f0ff',
            fontWeight: 900,
            background: 'rgba(0, 240, 255, 0.12)',
            padding: '0.2rem 1rem',
            borderRadius: '24px',
            border: '1px solid rgba(0, 240, 255, 0.5)'
          }}>
            <span>「家人們，幫主包個忙！」</span>
          </div>
        </div>

        {/* Track Selection Card with Difficulty & Speed Switch */}
        <div className="cyber-panel" style={{ padding: '0.7rem 0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Disc size={14} /> 競選拜票戰歌
            </span>
            <span style={{
              background: selectedDifficulty === 'Hard' ? '#ff007f' : selectedDifficulty === 'Normal' ? '#00f0ff' : '#ffe600',
              color: '#000',
              fontWeight: 900,
              padding: '1px 10px',
              borderRadius: '12px',
              fontSize: '0.72rem'
            }}>
              {selectedDifficulty} Mode
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.1rem', color: '#fff', textShadow: '0 0 10px rgba(255,230,0,0.5)' }}>
            yoaka競選之旅
          </h3>

          {/* Difficulty Switch Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
            {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  flex: 1,
                  padding: '0.35rem',
                  background: selectedDifficulty === diff ? (diff === 'Hard' ? 'linear-gradient(135deg, #ff007f, #d80068)' : diff === 'Normal' ? 'linear-gradient(135deg, #00f0ff, #0077b6)' : 'linear-gradient(135deg, #ffe600, #ffb703)') : 'rgba(255,255,255,0.05)',
                  border: selectedDifficulty === diff ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  color: selectedDifficulty === diff && diff === 'Normal' ? '#000' : selectedDifficulty === diff && diff === 'Easy' ? '#000' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Note Speed Multiplier Selection Bar */}
          <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Gauge size={12} color="#ffe600" /> 流速:
            </span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSelectedNoteSpeed(speed)}
                  style={{
                    background: selectedNoteSpeed === speed ? (speed < 1.0 ? '#00f0ff' : '#ffe600') : 'rgba(255,255,255,0.08)',
                    color: selectedNoteSpeed === speed ? '#000' : '#fff',
                    border: selectedNoteSpeed === speed ? '1px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '5px',
                    padding: '1px 5px',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {speed.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          className="muse-btn"
          onClick={() => onStartGame(selectedMap, selectedDifficulty, selectedNoteSpeed)}
          style={{ width: '100%', fontSize: '1.15rem', padding: '0.65rem' }}
        >
          <span><Play fill="#fff" size={18} /> 開啟競選拜票 (START - {selectedNoteSpeed.toFixed(2)}x)</span>
        </button>

        {/* Sub Option Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button className="muse-btn muse-btn-cyan" onClick={onOpenCostumes} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
            <span><Sparkles size={14} /> 造型: {costumeObj.name}</span>
          </button>

          <button className="muse-btn muse-btn-yellow" onClick={onOpenEditor} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
            <span><Wand2 size={14} /> A+B 創作者</span>
          </button>
        </div>

        {/* Key Guide Box */}
        <div className="cyber-panel" style={{ padding: '0.4rem 0.8rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontWeight: 800, marginRight: '6px' }}>上軌:</span>
            <span className="key-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>D</span>
            <span className="key-badge" style={{ fontSize: '0.7rem', padding: '1px 6px', marginLeft: '3px' }}>F</span>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#ff007f', fontWeight: 800, marginRight: '6px' }}>下軌:</span>
            <span className="key-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>J</span>
            <span className="key-badge" style={{ fontSize: '0.7rem', padding: '1px 6px', marginLeft: '3px' }}>K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
