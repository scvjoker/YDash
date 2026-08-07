import React from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

interface IOSHomePromptProps {
  onClose: () => void;
}

export const IOSHomePrompt: React.FC<IOSHomePromptProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 18, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '460px',
        maxWidth: '92vw',
        padding: '1.6rem 1.8rem',
        textAlign: 'center',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.8rem',
            right: '0.8rem',
            background: 'rgba(255, 0, 85, 0.2)',
            border: '1.5px solid #ff0055',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{
          fontSize: '1.5rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#ffe600',
          marginBottom: '0.5rem',
          textShadow: '0 0 15px rgba(255, 230, 0, 0.6)'
        }}>
          📱 iOS 沉浸全螢幕解鎖指南
        </h3>
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
          因 iOS Safari 限制不支援標準 RequestFullscreen API，只需簡單兩步將《YoakaDash》加入主畫面，即可自動隱藏網址列，享受無邊框全螢幕！
        </p>

        {/* Steps Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.4rem' }}>
          {/* Step 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1.5px solid #00f0ff',
            borderRadius: '12px',
            padding: '0.8rem 1rem',
            textAlign: 'left'
          }}>
            <div style={{ background: '#00f0ff', color: '#000', borderRadius: '8px', padding: '8px', display: 'flex' }}>
              <Share size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#00f0ff' }}>步驟 1：點擊 Safari 下方工具列</div>
              <div style={{ fontSize: '0.78rem', color: '#ddd', marginTop: '2px' }}>點選 Safari 瀏覽器底部的「分享」按鈕。</div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 0, 127, 0.1)',
            border: '1.5px solid #ff007f',
            borderRadius: '12px',
            padding: '0.8rem 1rem',
            textAlign: 'left'
          }}>
            <div style={{ background: '#ff007f', color: '#fff', borderRadius: '8px', padding: '8px', display: 'flex' }}>
              <PlusSquare size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ff007f' }}>步驟 2：選擇「加入主畫面」</div>
              <div style={{ fontSize: '0.78rem', color: '#ddd', marginTop: '2px' }}>滑動選單找到「加入主畫面 (Add to Home Screen)」。</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#ffe600',
            border: 'none',
            color: '#000',
            borderRadius: '10px',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🚀 我知道了，繼續遊玩！
        </button>
      </div>
    </div>
  );
};
