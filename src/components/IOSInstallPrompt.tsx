import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Detect if user is on iOS Safari and NOT in standalone PWA mode
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
    const isStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      // Check if user previously dismissed it
      const dismissed = sessionStorage.getItem('ios_pwa_prompt_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }
  }, []);

  if (!showPrompt) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('ios_pwa_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '440px',
      backgroundColor: 'rgba(10, 14, 35, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '2px solid #ffe600',
      borderRadius: '20px',
      padding: '1rem 1.2rem',
      boxShadow: '0 0 30px rgba(255, 230, 0, 0.5)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem' }}>
          📱 iOS 沉浸全螢幕祕訣
        </span>
        <button
          onClick={handleDismiss}
          style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#fff', lineHeight: 1.4 }}>
        在 iOS Safari 享受 100% 獨立無邊框全螢幕：
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#00f0ff' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,240,255,0.15)', padding: '4px 8px', borderRadius: '6px' }}>
          1. 點擊 Safari 下方 <Share size={15} /> 分享按鈕
        </span>
        ➔
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,230,0,0.15)', color: '#ffe600', padding: '4px 8px', borderRadius: '6px' }}>
          2. 選擇 <PlusSquare size={15} /> 加入主畫面
        </span>
      </div>
    </div>
  );
};
