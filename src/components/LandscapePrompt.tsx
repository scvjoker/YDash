import React, { useState, useEffect } from 'react';
import { RotateCw, Smartphone, Maximize } from 'lucide-react';

export const LandscapePrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window);
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && portrait);
    };

    try {
      const orientationApi = window.screen?.orientation as unknown as { lock?: (orient: string) => Promise<void> };
      if (orientationApi && typeof orientationApi.lock === 'function') {
        orientationApi.lock('landscape').catch(() => {});
      }
    } catch {
      // Ignore fallback
    }

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleEnterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  if (!isPortrait) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.96)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="cyber-panel float-animation" style={{
        padding: '2.2rem',
        borderRadius: '28px',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 45px rgba(0, 240, 255, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '380px'
      }}>
        <div style={{
          position: 'relative',
          width: '76px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 240, 255, 0.1)',
          borderRadius: '50%',
          border: '1.5px solid #00f0ff',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)'
        }}>
          <Smartphone size={38} color="#00f0ff" />
          <RotateCw
            size={26}
            color="#ffe600"
            style={{
              position: 'absolute',
              right: '-6px',
              bottom: '-6px',
              animation: 'spin 3s linear infinite'
            }}
          />
        </div>

        <h2 style={{
          fontFamily: 'Chakra Petch, sans-serif',
          fontSize: '1.7rem',
          fontWeight: 900,
          color: '#ffe600',
          textShadow: '0 0 15px rgba(255,230,0,0.6)'
        }}>
          📱 請旋轉手機為「橫向模式」
        </h2>

        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.45 }}>
          轉為橫向拿握並進入全螢幕，享受最廣闊的 Muse Dash 雙軌打擊體驗！
        </p>

        <button
          className="muse-btn muse-btn-yellow"
          onClick={handleEnterFullscreen}
          style={{ width: '100%', fontSize: '1rem', padding: '0.75rem', gap: '6px' }}
        >
          <span><Maximize size={18} /> 進入全螢幕 (FULLSCREEN)</span>
        </button>

        <div style={{
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          color: '#000',
          fontWeight: 900,
          padding: '6px 18px',
          borderRadius: '16px',
          fontSize: '0.8rem'
        }}>
          ROTATE & PLAY FULLSCREEN
        </div>
      </div>
    </div>
  );
};
