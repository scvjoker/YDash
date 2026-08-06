import React, { useState, useEffect } from 'react';
import { RotateCw, Smartphone } from 'lucide-react';

export const LandscapePrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window);
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && portrait);
    };

    // Auto attempt to lock orientation if API supported
    try {
      const orientationApi = window.screen?.orientation as unknown as { lock?: (orient: string) => Promise<void> };
      if (orientationApi && typeof orientationApi.lock === 'function') {
        orientationApi.lock('landscape').catch(() => {
          // Device policy may block automatic locking until user interaction
        });
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
        padding: '2.5rem',
        borderRadius: '28px',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 45px rgba(0, 240, 255, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem',
        maxWidth: '380px'
      }}>
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 240, 255, 0.1)',
          borderRadius: '50%',
          border: '1.5px solid #00f0ff',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)'
        }}>
          <Smartphone size={42} color="#00f0ff" />
          <RotateCw
            size={28}
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
          fontSize: '1.8rem',
          fontWeight: 900,
          color: '#ffe600',
          textShadow: '0 0 15px rgba(255,230,0,0.6)'
        }}>
          📱 請旋轉手機為「橫向模式」
        </h2>

        <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.5 }}>
          為了獲得最極致的 Muse Dash 雙軌音遊打擊視野與雙手靈敏觸控體驗，請將手機橫向拿握！
        </p>

        <div style={{
          background: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          color: '#000',
          fontWeight: 900,
          padding: '8px 24px',
          borderRadius: '20px',
          fontSize: '0.88rem',
          boxShadow: '0 0 15px rgba(0,240,255,0.4)'
        }}>
          ROTATE YOUR PHONE TO LANDSCAPE
        </div>
      </div>
    </div>
  );
};
