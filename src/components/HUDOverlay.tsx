import React, { useEffect, useState } from 'react';
import { Pause, Music } from 'lucide-react';
import { GameStats, CostumeId } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface HUDOverlayProps {
  stats: GameStats;
  costume: CostumeId;
  onAirPress: () => void;
  onGroundPress: () => void;
  onPause: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  stats,
  onAirPress,
  onGroundPress,
  onPause
}) => {
  const [prevHp, setPrevHp] = useState<number>(stats.supportRate);
  const [isHpFlashing, setIsHpFlashing] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(40);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Poll Song Time Progress
  useEffect(() => {
    const interval = setInterval(() => {
      const time = audioEngine.getHardwareTime();
      setCurrentTime(time);

      const activeBuf = audioEngine['customAudioBuffer'] || audioEngine['bgmBuffer'];
      if (activeBuf) {
        setTotalDuration(activeBuf.duration);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Trigger HP Red Flash animation on HP reduction
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (stats.supportRate < prevHp) {
      setIsHpFlashing(true);
      timer = setTimeout(() => setIsHpFlashing(false), 350);
    }
    setPrevHp(stats.supportRate);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stats.supportRate, prevHp]);

  const handleAirTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    onAirPress();
  };

  const handleGroundTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    onGroundPress();
  };

  const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const songProgressPct = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // 3-Tier HP Dynamic Threshold Theme (🟢綠 -> 🟡黃 -> 🔴紅)
  const getHpTheme = (hp: number) => {
    if (hp > 60) {
      return {
        gradient: 'linear-gradient(90deg, #00ff87 0%, #60efff 100%)',
        color: '#00ff87',
        glow: '#00ff87',
        label: '選民支持度 (HP)'
      };
    } else if (hp > 30) {
      return {
        gradient: 'linear-gradient(90deg, #ffe600 0%, #ff9900 100%)',
        color: '#ffe600',
        glow: '#ffe600',
        label: '選民支持度 (HP)'
      };
    } else {
      return {
        gradient: 'linear-gradient(90deg, #ff0055 0%, #ff007f 100%)',
        color: '#ff0055',
        glow: '#ff0055',
        label: '⚠️ 支持度告急!'
      };
    }
  };

  const hpTheme = getHpTheme(stats.supportRate);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: isMobileScreen ? '0.5rem 1.2rem' : '1.2rem 2.2rem',
      zIndex: 10
    }}>
      {/* TOP HEADER: Unified Single-Line Bar (HP + Progress Bar in SAME Row!) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.2rem' }}>
        {/* Left: Support Rate (HP) & Integrated Song Progress Bar (3-Tier Color Gradient: 🟢 -> 🟡 -> 🔴) */}
        <div 
          className="cyber-panel" 
          style={{ 
            flex: 1,
            maxWidth: isMobileScreen ? '520px' : '760px',
            padding: isMobileScreen ? '0.4rem 0.9rem' : '0.85rem 1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: isMobileScreen ? '12px' : '20px',
            border: isHpFlashing ? '2.5px solid #ff0055' : `1.5px solid ${hpTheme.color}66`,
            boxShadow: isHpFlashing ? '0 0 30px #ff0055, inset 0 0 15px #ff0055' : `0 0 20px ${hpTheme.glow}44`,
            backgroundColor: isHpFlashing ? 'rgba(255, 0, 85, 0.35)' : 'rgba(10, 12, 28, 0.85)',
            transition: 'all 0.25s ease-out'
          }}
        >
          {/* HP Label & Bar */}
          <div style={{ minWidth: isMobileScreen ? '110px' : '165px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobileScreen ? '0.72rem' : '0.95rem', fontWeight: 900, color: isHpFlashing ? '#ff0055' : hpTheme.color, marginBottom: '4px', transition: 'color 0.25s' }}>
              <span>{isHpFlashing ? '⚠️ 支持度告急!' : hpTheme.label}</span>
              <span>{stats.supportRate.toFixed(0)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: isMobileScreen ? '8px' : '14px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '6px',
              overflow: 'hidden',
              border: isHpFlashing ? '1.5px solid #ff0055' : '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                width: `${stats.supportRate}%`,
                height: '100%',
                background: isHpFlashing ? 'linear-gradient(90deg, #ff0055 0%, #ff4d00 100%)' : hpTheme.gradient,
                boxShadow: `0 0 10px ${hpTheme.glow}`,
                transition: 'width 0.2s ease-out, background 0.3s ease'
              }} />
            </div>
          </div>

          <div style={{ width: '1.5px', height: isMobileScreen ? '22px' : '36px', background: 'rgba(255,255,255,0.2)' }} />

          {/* Integrated Song Progress Bar in same row */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isMobileScreen ? '8px' : '14px' }}>
            <Music size={isMobileScreen ? 13 : 18} color="#ffe600" />
            <div style={{
              flex: 1,
              height: isMobileScreen ? '6px' : '10px',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '5px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: `${songProgressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00f0ff 0%, #ffe600 50%, #ff007f 100%)',
                boxShadow: '0 0 12px #00f0ff',
                transition: 'width 0.1s linear'
              }} />
            </div>
            <span style={{ fontSize: isMobileScreen ? '0.72rem' : '0.92rem', color: '#ffe600', fontWeight: 900, whiteSpace: 'nowrap' }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Right: Score Badge & Pause Button (Desktop Enlarged 2X) */}
        <div style={{ display: 'flex', gap: isMobileScreen ? '0.6rem' : '1.2rem', alignItems: 'center' }}>
          <div className="cyber-panel" style={{ padding: isMobileScreen ? '0.35rem 0.8rem' : '0.75rem 1.4rem', textAlign: 'right' }}>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.78rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>
              得票數 (SCORE)
            </p>
            <p style={{
              fontSize: isMobileScreen ? '1.25rem' : '2.2rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 15px rgba(255,230,0,0.6)',
              lineHeight: 1.1
            }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: isMobileScreen ? '0.72rem' : '0.95rem', color: '#fff' }}>票</span>
            </p>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 0, 127, 0.2)',
              border: '2px solid #ff007f',
              color: '#fff',
              borderRadius: '14px',
              width: isMobileScreen ? '38px' : '52px',
              height: isMobileScreen ? '38px' : '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(255,0,127,0.5)',
              transition: 'all 0.2s'
            }}
          >
            <Pause size={isMobileScreen ? 18 : 26} />
          </button>
        </div>
      </div>

      {/* BOTTOM TOUCH CONTROLS */}
      <div style={{
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: isMobileScreen ? '0.8rem' : '1.5rem',
        width: '100%'
      }}>
        {/* Air Touch Button (Left: D/F) */}
        <button
          onClick={onAirPress}
          onTouchStart={handleAirTouch}
          style={{
            flex: 1,
            height: isMobileScreen ? '62px' : '110px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.35) 0%, rgba(0, 119, 182, 0.55) 100%)',
            border: '2px solid #00f0ff',
            borderRadius: isMobileScreen ? '14px' : '22px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? '1.1rem' : '1.5rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            touchAction: 'manipulation'
          }}
        >
          上軌 (空中投紙/閃避) <span style={{ fontSize: isMobileScreen ? '0.8rem' : '1rem', opacity: 0.85 }}>(D / F)</span>
        </button>

        {/* Ground Touch Button (Right: J/K) */}
        <button
          onClick={onGroundPress}
          onTouchStart={handleGroundTouch}
          style={{
            flex: 1,
            height: isMobileScreen ? '62px' : '110px',
            background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.35) 0%, rgba(216, 0, 104, 0.55) 100%)',
            border: '2px solid #ff007f',
            borderRadius: isMobileScreen ? '14px' : '22px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 25px rgba(255, 0, 127, 0.5)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? '1.1rem' : '1.5rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            touchAction: 'manipulation'
          }}
        >
          下軌 (地面發紙/閃避) <span style={{ fontSize: isMobileScreen ? '0.8rem' : '1rem', opacity: 0.85 }}>(J / K)</span>
        </button>
      </div>
    </div>
  );
};
