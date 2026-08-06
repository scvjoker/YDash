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

  // Helper format MM:SS
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
      padding: '1.2rem 2rem',
      zIndex: 10
    }}>
      {/* TOP BAR: Support Rate & Song Progress Bar & Combo Count & Score */}
      <div>
        {/* SONG PROGRESS BAR (頂端全寬流光歌曲進度條) */}
        <div style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto 1rem',
          background: 'rgba(10, 12, 28, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(0, 240, 255, 0.4)',
          borderRadius: '20px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
        }}>
          <Music size={16} color="#ffe600" />
          <span style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {formatTime(currentTime)}
          </span>

          <div style={{
            flex: 1,
            height: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{
              width: `${songProgressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00f0ff 0%, #ffe600 50%, #ff007f 100%)',
              boxShadow: '0 0 12px #00f0ff',
              transition: 'width 0.1s linear'
            }} />
          </div>

          <span style={{ fontSize: '0.8rem', color: '#ffe600', fontWeight: 900, whiteSpace: 'nowrap' }}>
            {formatTime(totalDuration)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left: Support Rate Bar with Red Alarm Flash */}
          <div 
            className="cyber-panel" 
            style={{ 
              padding: '0.8rem 1.2rem', 
              minWidth: '280px',
              border: isHpFlashing ? '2.5px solid #ff0055' : isLowSupport ? '2px solid #ff0055' : '1px solid rgba(0,240,255,0.4)',
              boxShadow: isHpFlashing ? '0 0 30px #ff0055, inset 0 0 20px #ff0055' : isLowSupport ? '0 0 20px #ff0055' : '0 0 10px rgba(0,240,255,0.3)',
              backgroundColor: isHpFlashing ? 'rgba(255, 0, 85, 0.35)' : 'rgba(10, 12, 28, 0.85)',
              transition: 'all 0.15s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 900, color: isLowSupport || isHpFlashing ? '#ff0055' : '#00f0ff', marginBottom: '6px' }}>
              <span>{isHpFlashing ? '⚠️ 支持度告急!' : '選民支持度 (HP)'}</span>
              <span>{stats.supportRate.toFixed(0)}%</span>
            </div>

            <div style={{
              width: '100%',
              height: '16px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: isHpFlashing ? '2px solid #ff0055' : '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                width: `${stats.supportRate}%`,
                height: '100%',
                background: isLowSupport || isHpFlashing ? 'linear-gradient(90deg, #ff0055 0%, #ff4d00 100%)' : 'linear-gradient(90deg, #00f0ff 0%, #0077b6 100%)',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
          </div>

          {/* Center: Fever Bar & Combo Count */}
          <div style={{ textAlign: 'center' }}>
            {stats.combo > 1 && (
              <div style={{
                fontSize: '3.5rem',
                fontFamily: 'Chakra Petch, sans-serif',
                fontWeight: 900,
                fontStyle: 'italic',
                background: 'linear-gradient(180deg, #ffe600 0%, #ff007f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 15px rgba(255,0,127,0.8))',
                lineHeight: 1
              }}>
                {stats.combo} <span style={{ fontSize: '1.5rem', fontStyle: 'normal', color: '#fff' }}>COMBO</span>
              </div>
            )}

            {/* Fever Bar */}
            <div style={{ marginTop: '8px', width: '200px', margin: '8px auto 0' }}>
              <div style={{
                height: '10px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '6px',
                overflow: 'hidden',
                border: stats.isFeverActive ? '2px solid #ffe600' : '1px solid rgba(255,0,127,0.4)',
                boxShadow: stats.isFeverActive ? '0 0 20px #ffe600' : 'none'
              }}>
                <div style={{
                  width: `${stats.feverGauge}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff007f, #ffe600)'
                }} />
              </div>
            </div>
          </div>

          {/* Right: Score Badge & Pause Button */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="cyber-panel" style={{ padding: '0.8rem 1.4rem', textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>
                當前得票數 (SCORE)
              </p>
              <p style={{
                fontSize: '2rem',
                fontFamily: 'Chakra Petch, sans-serif',
                fontWeight: 900,
                color: '#ffe600',
                textShadow: '0 0 15px rgba(255,230,0,0.6)'
              }}>
                {stats.score.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#fff' }}>票</span>
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
                borderRadius: '12px',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(255,0,127,0.5)',
                transition: 'all 0.2s'
              }}
            >
              <Pause size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM / MOBILE DUAL CONTROLS */}
      <div style={{
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Air Touch Button (Left: D/F) */}
        <button
          onClick={onAirPress}
          onTouchStart={handleAirTouch}
          style={{
            flex: 1,
            height: '115px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3) 0%, rgba(0, 119, 182, 0.5) 100%)',
            border: '2.5px solid #00f0ff',
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            touchAction: 'manipulation'
          }}
        >
          上軌 (空中投紙/閃避) <span style={{ fontSize: '1rem', opacity: 0.8 }}>(D / F)</span>
        </button>

        {/* Ground Touch Button (Right: J/K) */}
        <button
          onClick={onGroundPress}
          onTouchStart={handleGroundTouch}
          style={{
            flex: 1,
            height: '115px',
            background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.3) 0%, rgba(216, 0, 104, 0.5) 100%)',
            border: '2.5px solid #ff007f',
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 25px rgba(255, 0, 127, 0.5)',
            color: '#fff',
            fontFamily: 'Chakra Petch, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            touchAction: 'manipulation'
          }}
        >
          下軌 (地面發紙/閃避) <span style={{ fontSize: '1rem', opacity: 0.8 }}>(J / K)</span>
        </button>
      </div>
    </div>
  );
};
