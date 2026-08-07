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

  const handleAirTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onAirPress();
  };

  const handleGroundTouch = (e: React.TouchEvent | React.MouseEvent) => {
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
        label: '支持度'
      };
    } else if (hp > 30) {
      return {
        gradient: 'linear-gradient(90deg, #ffe600 0%, #ff9900 100%)',
        color: '#ffe600',
        glow: '#ffe600',
        label: '支持度'
      };
    } else {
      return {
        gradient: 'linear-gradient(90deg, #ff0055 0%, #ff007f 100%)',
        color: '#ff0055',
        glow: '#ff0055',
        label: '⚠️告急'
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
      padding: isMobileScreen ? '0.3rem 0.6rem' : '0.8rem 1.6rem',
      zIndex: 10
    }}>
      {/* 1. TOP HUD: Scaled Down to 60% for Unobstructed Runway View */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.6rem',
        marginTop: 'env(safe-area-inset-top, 0px)',
        transform: isMobileScreen ? 'scale(0.88)' : 'scale(0.95)',
        transformOrigin: 'top center'
      }}>
        {/* Left: Compact Support Rate (HP) & Integrated Progress Bar */}
        <div 
          className="cyber-panel" 
          style={{ 
            flex: 1,
            maxWidth: isMobileScreen ? '400px' : '600px',
            padding: isMobileScreen ? '0.25rem 0.6rem' : '0.5rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: isMobileScreen ? '8px' : '14px',
            border: isHpFlashing ? '2px solid #ff0055' : `1.2px solid ${hpTheme.color}66`,
            boxShadow: isHpFlashing ? '0 0 20px #ff0055' : `0 0 12px ${hpTheme.glow}33`,
            backgroundColor: isHpFlashing ? 'rgba(255, 0, 85, 0.35)' : 'rgba(10, 12, 28, 0.85)',
            transition: 'all 0.25s ease-out'
          }}
        >
          {/* HP Label & Bar */}
          <div style={{ minWidth: isMobileScreen ? '80px' : '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobileScreen ? '0.62rem' : '0.82rem', fontWeight: 900, color: hpTheme.color, marginBottom: '1px' }}>
              <span>{hpTheme.label}</span>
              <span>{stats.supportRate.toFixed(0)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: isMobileScreen ? '5px' : '10px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${stats.supportRate}%`,
                height: '100%',
                background: isHpFlashing ? 'linear-gradient(90deg, #ff0055 0%, #ff4d00 100%)' : hpTheme.gradient,
                transition: 'width 0.2s ease-out'
              }} />
            </div>
          </div>

          <div style={{ width: '1px', height: isMobileScreen ? '16px' : '28px', background: 'rgba(255,255,255,0.2)' }} />

          {/* Integrated Song Progress Bar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isMobileScreen ? '6px' : '10px' }}>
            <Music size={isMobileScreen ? 11 : 15} color="#ffe600" />
            <div style={{
              flex: 1,
              height: isMobileScreen ? '4px' : '8px',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${songProgressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00f0ff 0%, #ffe600 50%, #ff007f 100%)'
              }} />
            </div>
            <span style={{ fontSize: isMobileScreen ? '0.62rem' : '0.80rem', color: '#ffe600', fontWeight: 900, whiteSpace: 'nowrap' }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Right: Score & Compact Pause */}
        <div style={{ display: 'flex', gap: isMobileScreen ? '0.4rem' : '0.8rem', alignItems: 'center' }}>
          <div className="cyber-panel" style={{ padding: isMobileScreen ? '0.25rem 0.6rem' : '0.5rem 1rem', textAlign: 'right' }}>
            <p style={{ fontSize: isMobileScreen ? '0.58rem' : '0.70rem', color: '#aaa', fontWeight: 700 }}>
              得票 (SCORE)
            </p>
            <p style={{
              fontSize: isMobileScreen ? '1.0rem' : '1.7rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              lineHeight: 1
            }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: '0.65rem', color: '#fff' }}>票</span>
            </p>
          </div>

          <button
            onClick={onPause}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 0, 127, 0.25)',
              border: '1.5px solid #ff007f',
              color: '#fff',
              borderRadius: '12px',
              width: isMobileScreen ? '32px' : '44px',
              height: isMobileScreen ? '32px' : '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255,0,127,0.4)'
            }}
          >
            <Pause size={isMobileScreen ? 14 : 20} />
          </button>
        </div>
      </div>

      {/* 2. FULL-SCREEN HALF-SCREEN TAP ZONES (Left 50% = AIR, Right 50% = GROUND) + High Transparency Hint Buttons */}
      <div style={{
        position: 'absolute',
        inset: 0,
        top: '60px',
        pointerEvents: 'none',
        display: 'flex',
        zIndex: 5
      }}>
        {/* LEFT HALF SCREEN TOUCH ZONE: AIR ATTACK */}
        <div
          onClick={handleAirTouch}
          onTouchStart={handleAirTouch}
          style={{
            flex: 1,
            height: '100%',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: isMobileScreen ? '0.4rem 0.6rem' : '1.2rem 2rem',
            cursor: 'pointer'
          }}
        >
          {/* Transparent Floating Hint Button */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.18)',
            border: '1.5px solid rgba(0, 240, 255, 0.45)',
            borderRadius: '12px',
            padding: isMobileScreen ? '0.35rem 0.8rem' : '0.6rem 1.4rem',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? '0.82rem' : '1.1rem',
            fontWeight: 900,
            backdropFilter: 'blur(4px)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)',
            marginBottom: 'env(safe-area-inset-bottom, 0px)',
            opacity: 0.85
          }}>
            ☁️ 左半屏：上軌 (D/F)
          </div>
        </div>

        {/* RIGHT HALF SCREEN TOUCH ZONE: GROUND ATTACK */}
        <div
          onClick={handleGroundTouch}
          onTouchStart={handleGroundTouch}
          style={{
            flex: 1,
            height: '100%',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: isMobileScreen ? '0.4rem 0.6rem' : '1.2rem 2rem',
            cursor: 'pointer'
          }}
        >
          {/* Transparent Floating Hint Button */}
          <div style={{
            background: 'rgba(255, 0, 127, 0.18)',
            border: '1.5px solid rgba(255, 0, 127, 0.45)',
            borderRadius: '12px',
            padding: isMobileScreen ? '0.35rem 0.8rem' : '0.6rem 1.4rem',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: isMobileScreen ? '0.82rem' : '1.1rem',
            fontWeight: 900,
            backdropFilter: 'blur(4px)',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.25)',
            marginBottom: 'env(safe-area-inset-bottom, 0px)',
            opacity: 0.85
          }}>
            🏃 右半屏：下軌 (J/K)
          </div>
        </div>
      </div>
    </div>
  );
};
