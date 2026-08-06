import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Wand2, Disc, Flame } from 'lucide-react';
import { BeatmapData } from '../types/game';
import { DEFAULT_BEATMAPS } from '../game/Beatmaps';

interface StartScreenProps {
  onStartGame: (beatmap: BeatmapData, difficulty: 'Easy' | 'Normal' | 'Hard') => void;
  onOpenCostumes: () => void;
  onOpenEditor: () => void;
  selectedCostumeName: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenCostumes,
  onOpenEditor,
  selectedCostumeName
}) => {
  const [selectedMap] = useState<BeatmapData>(DEFAULT_BEATMAPS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [paperSprinkles, setPaperSprinkles] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPaperSprinkles(prev => [...prev.slice(-14), Date.now()]);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#070814',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5vw',
      overflow: 'hidden'
    }}>
      {/* Background Cyber Rays & Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, #2b0645 0%, #0d081f 55%, #05060f 100%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Tissue Paper Rain Animation */}
      {paperSprinkles.map(id => (
        <div key={id} style={{
          position: 'absolute',
          left: `${12 + Math.random() * 32}%`,
          top: '25%',
          fontSize: '2.2rem',
          animation: 'tissueRain 2.5s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          ✨
        </div>
      ))}

      {/* LEFT SECTION: Official Yoaka Main Visual Hero Stage Card */}
      <div style={{
        position: 'relative',
        width: '46vw',
        height: '86vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        {/* Campaign Badge Pill */}
        <div style={{
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          padding: '4px 22px',
          borderRadius: '30px',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
          marginBottom: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Flame size={18} color="#ffe600" />
          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000', letterSpacing: '2px' }}>
            WEB3 小島區里長熱血大選！
          </span>
        </div>

        {/* Main Neon Title */}
        <h1 style={{
          fontFamily: 'Chakra Petch, sans-serif',
          fontSize: '4.8rem',
          fontWeight: 900,
          fontStyle: 'italic',
          background: 'linear-gradient(180deg, #ffffff 0%, #ffe600 45%, #ff007f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255, 0, 127, 0.9)) drop-shadow(0 0 35px rgba(0, 240, 255, 0.6))',
          lineHeight: 1.05,
          textAlign: 'center',
          marginBottom: '0.6rem',
          letterSpacing: '-1px'
        }}>
          YOAKA DASH!
        </h1>

        {/* Catchphrase Bubble */}
        <div style={{
          fontSize: '1.25rem',
          color: '#00f0ff',
          fontWeight: 900,
          background: 'rgba(0, 240, 255, 0.12)',
          padding: '0.5rem 1.8rem',
          borderRadius: '40px',
          border: '1.5px solid rgba(0, 240, 255, 0.5)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2)',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>「家人們，幫主包個忙！」</span>
        </div>

        {/* OFFICIAL YOAKA HIGH-RES ARTSTAGE CARD */}
        <div className="float-animation" style={{
          position: 'relative',
          width: '360px',
          height: '360px',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '3px solid #00f0ff',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.6), inset 0 0 20px rgba(255, 0, 127, 0.4)',
          background: '#0e0b24'
        }}>
          <img
            src="/yoaka_main.jpg"
            alt="Yoaka Official Artwork"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: 'contrast(1.05) brightness(1.05)'
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(10, 12, 28, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            borderRadius: '12px',
            padding: '6px 14px',
            textAlign: 'center',
            color: '#ffe600',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            fontSize: '1rem',
            letterSpacing: '1px'
          }}>
            👑 OFFICIAL CANDIDATE • YOAKA
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Track Selector & Difficulty Switch */}
      <div style={{
        width: '42vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.3rem',
        zIndex: 2
      }}>
        {/* Track Selection Card */}
        <div className="cyber-panel" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Disc size={18} /> 專屬競選拜票戰歌
            </span>
            <span style={{
              background: selectedDifficulty === 'Hard' ? '#ff007f' : selectedDifficulty === 'Normal' ? '#00f0ff' : '#ffe600',
              color: '#000',
              fontWeight: 900,
              padding: '3px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              boxShadow: '0 0 12px currentColor'
            }}>
              {selectedDifficulty} Mode
            </span>
          </div>

          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#fff', textShadow: '0 0 15px rgba(255,230,0,0.5)' }}>
            yoaka競選之旅
          </h3>
          <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '1.2rem' }}>
            You & Yoaka AI • web3 小島區里長主打歌
          </p>

          {/* Easy / Normal / Hard Difficulty Pills Switch */}
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: selectedDifficulty === diff ? (diff === 'Hard' ? 'linear-gradient(135deg, #ff007f, #d80068)' : diff === 'Normal' ? 'linear-gradient(135deg, #00f0ff, #0077b6)' : 'linear-gradient(135deg, #ffe600, #ffb703)') : 'rgba(255,255,255,0.05)',
                  border: selectedDifficulty === diff ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: selectedDifficulty === diff && diff === 'Normal' ? '#000' : selectedDifficulty === diff && diff === 'Easy' ? '#000' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '1rem',
                  transition: 'all 0.25s',
                  boxShadow: selectedDifficulty === diff ? '0 0 15px currentColor' : 'none'
                }}
              >
                {diff === 'Easy' && '🌱 Easy (休閒拜票)'}
                {diff === 'Normal' && '🔥 Normal (熱血競選)'}
                {diff === 'Hard' && '⚡ Hard (極限造勢)'}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          className="muse-btn"
          onClick={() => onStartGame(selectedMap, selectedDifficulty)}
          style={{ width: '100%', fontSize: '1.6rem', padding: '1.2rem' }}
        >
          <span><Play fill="#fff" size={28} /> 開啟競選拜票 (START - {selectedDifficulty})</span>
        </button>

        {/* Sub Option Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button className="muse-btn muse-btn-cyan" onClick={onOpenCostumes} style={{ fontSize: '1.1rem' }}>
            <span><Sparkles size={20} /> 造型: {selectedCostumeName}</span>
          </button>

          <button className="muse-btn muse-btn-yellow" onClick={onOpenEditor} style={{ fontSize: '1.1rem' }}>
            <span><Wand2 size={20} /> A+B 譜面創作者</span>
          </button>
        </div>

        {/* Key Guide Box */}
        <div className="cyber-panel" style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#00f0ff', fontWeight: 800, marginBottom: '6px' }}>上軌 (空中投紙)</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span className="key-badge">D</span>
              <span className="key-badge">F</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.15)' }} />

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#ff007f', fontWeight: 800, marginBottom: '6px' }}>下軌 (地面發衛生紙)</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span className="key-badge">J</span>
              <span className="key-badge">K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
