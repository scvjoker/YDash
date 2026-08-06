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

  const isLowSupport = stats.supportRate <= 30;

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

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '0.6rem 1.4rem',
      zIndex: 10
    }}>
      {/* TOP HEADER: Unified Single-Line Bar (HP + Progress Bar in SAME Row!) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        {/* Left: Support Rate (HP) & Integrated Song Progress Bar (同一層) */}
        <div 
          className="cyber-panel" 
          style={{ 
            flex: 1,
            maxWidth: '560px',
            padding: '0.45rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: isHpFlashing ? '2px solid #ff0055' : isLowSupport ? '2px solid #ff0055' : '1px solid rgba(0,240,255,0.4)',
            boxShadow: isHpFlashing ? '0 0 25px #ff0055, inset 0 0 15px #ff0055' : '0 0 12px rgba(0,240,255,0.25)',
            backgroundColor: isHpFlashing ? 'rgba(255, 0, 85, 0.35)' : 'rgba(10, 12, 28, 0.85)',
            transition: 'all 0.15s ease-out'
          }}
        >
          {/* HP Label & Bar */}
          <div style={{ minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 900, color: isLowSupport || isHpFlashing ? '#ff0055' : '#00f0ff', marginBottom: '3px' }}>
              <span>支持度</span>
              <span>{stats.supportRate.toFixed(0)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '9px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '5px',
              overflow: 'hidden',
              border: isHpFlashing ? '1px solid #ff0055' : '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                width: `${stats.supportRate}%`,
                height: '100%',
                background: isLowSupport || isHpFlashing ? 'linear-gradient(90deg, #ff0055 0%, #ff4d00 100%)' : 'linear-gradient(90deg, #00f0ff 0%, #0077b6 100%)',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

          {/* Integrated Song Progress Bar in same row */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={14} color="#ffe600" />
            <div style={{
              flex: 1,
              height: '7px',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{
                width: `${songProgressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00f0ff 0%, #ffe600 50%, #ff007f 100%)',
                boxShadow: '0 0 10px #00f0ff',
                transition: 'width 0.1s linear'
              }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#ffe600', fontWeight: 900, whiteSpace: 'nowrap' }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Right: Score Badge & Pause Button */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div className="cyber-panel" style={{ padding: '0.45rem 1rem', textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>
              得票數 (SCORE)
            </p>
            <p style={{
              fontSize: '1.4rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 12px rgba(255,230,0,0.6)',
              lineHeight: 1.1
            }}>
              {stats.score.toLocaleString()} <span style={{ fontSize: '0.78rem', color: '#fff' }}>票</span>
            </p>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 0, 127, 0.2)',
              border: '1.5px solid #ff007f',
              color: '#fff',
              borderRadius: '12px',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255,0,127,0.5)',
              transition: 'all 0.2s'
            }}
          >
            <Pause size={20} />
          </button>
        </div>
      </div>

      {/* BOTTOM TOUCH CONTROLS */}
      <div style={{
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '1rem',
        width: '100%'
      }}>
        {/* Air Touch Button (Left: D/F) */}
        <button
          onClick={onAirPress}
          onTouchStart={handleAirTouch}
          style={{
            flex: 1,
            height: '65px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.35) 0%, rgba(0, 119, 182, 0.55) 100%)',
            border: '1.5px solid #00f0ff',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 18px rgba(0, 240, 255, 0.4)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: '1.15rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            touchAction: 'manipulation'
          }}
        >
          上軌 (空中投紙) <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>(D / F)</span>
        </button>

        {/* Ground Touch Button (Right: J/K) */}
        <button
          onClick={onGroundPress}
          onTouchStart={handleGroundTouch}
          style={{
            flex: 1,
            height: '65px',
            background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.35) 0%, rgba(216, 0, 104, 0.55) 100%)',
            border: '1.5px solid #ff007f',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 18px rgba(255, 0, 127, 0.4)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: '1.15rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            touchAction: 'manipulation'
          }}
        >
          下軌 (地面發紙) <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>(J / K)</span>
        </button>
      </div>
    </div>
  );
};
