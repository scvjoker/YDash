import React, { useState, useEffect } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getImageSrc = (key: string, fallback: string) => {
    if (imgErrors[key]) return '/assets/tissue_pack.png';
    return fallback;
  };

  const lessons = [
    {
      stepTitle: '第 1 課：Note 一般音符與投遞面紙',
      badge: '📘 音符基礎概念',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: isMobileScreen ? 'auto 1fr' : 'auto 1fr', gap: isMobileScreen ? '0.7rem' : '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson1', '/assets/tutorial_lesson1.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson1: true }))}
              alt="Note 打擊教學"
              style={{
                maxHeight: isMobileScreen ? '100px' : '165px',
                maxWidth: isMobileScreen ? '140px' : '220px',
                objectFit: 'contain',
                borderRadius: '10px',
                border: '2px solid #00f0ff',
                boxShadow: '0 0 15px rgba(0,240,255,0.3)',
                background: '#080a1e',
                padding: '3px'
              }}
            />
          </div>

          {/* Right Text Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobileScreen ? '0.4rem' : '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobileScreen ? '0.4rem' : '0.8rem' }}>
              {/* Air Note Card */}
              <div style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1.5px solid #00f0ff', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: isMobileScreen ? '0.78rem' : '1rem', fontWeight: 900, color: '#00f0ff', marginBottom: '2px' }}>
                  ☁️ 空中選民音符
                </div>
                <p style={{ fontSize: isMobileScreen ? '0.68rem' : '0.8rem', color: '#ddd', marginBottom: '4px' }}>
                  按下 <strong style={{ color: '#ffe600' }}>[D] / [F]</strong> 躍起投遞面紙拉票！
                </p>
                <div style={{ background: '#00f0ff', color: '#000', fontWeight: 900, padding: '2px', borderRadius: '5px', fontSize: isMobileScreen ? '0.65rem' : '0.75rem' }}>
                  左半屏：空中按鈕 (AIR)
                </div>
              </div>

              {/* Ground Note Card */}
              <div style={{ background: 'rgba(255, 0, 127, 0.12)', border: '1.5px solid #ff007f', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: isMobileScreen ? '0.78rem' : '1rem', fontWeight: 900, color: '#ff007f', marginBottom: '2px' }}>
                  🏃 地面選民音符
                </div>
                <p style={{ fontSize: isMobileScreen ? '0.68rem' : '0.8rem', color: '#ddd', marginBottom: '4px' }}>
                  按下 <strong style={{ color: '#ffe600' }}>[J] / [K]</strong> 地面奔跑親切發面紙！
                </p>
                <div style={{ background: '#ff007f', color: '#fff', fontWeight: 900, padding: '2px', borderRadius: '5px', fontSize: isMobileScreen ? '0.65rem' : '0.75rem' }}>
                  右半屏：地面按鈕 (GROUND)
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: isMobileScreen ? '0.35rem 0.6rem' : '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,230,0,0.3)', textAlign: 'center' }}>
              <p style={{ fontSize: isMobileScreen ? '0.70rem' : '0.82rem', color: '#ffe600', fontWeight: 800 }}>
                💡 抓準音符抵達 Hit Zone 的瞬間（Perfect 聲勢），獲得最高選民支持！
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      stepTitle: '第 2 課：Dual Note 金黃雙擊',
      badge: '⚡ 雙連擊高潮',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: isMobileScreen ? '0.7rem' : '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson2', '/assets/tutorial_lesson2.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson2: true }))}
              alt="Dual Note 金黃雙擊"
              style={{
                maxHeight: isMobileScreen ? '100px' : '165px',
                maxWidth: isMobileScreen ? '140px' : '220px',
                objectFit: 'contain',
                borderRadius: '10px',
                border: '2px solid #ffe600',
                boxShadow: '0 0 15px rgba(255,230,0,0.4)',
                background: '#080a1e',
                padding: '3px'
              }}
            />
          </div>

          {/* Right Text */}
          <div style={{ background: 'rgba(255, 230, 0, 0.12)', border: '2px solid #ffe600', borderRadius: '12px', padding: isMobileScreen ? '0.6rem 0.8rem' : '1.1rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: isMobileScreen ? '0.95rem' : '1.25rem', fontWeight: 900, color: '#ffe600', marginBottom: '4px' }}>
              ⚡ 金黃連線雙音符 (DUAL STRIKE)
            </h4>
            <p style={{ fontSize: isMobileScreen ? '0.72rem' : '0.88rem', color: '#fff', lineHeight: 1.4, marginBottom: '6px' }}>
              當出現金黃色雷射連接的上下軌音符，同時按下 <strong style={{ color: '#00f0ff' }}>空中[D/F]</strong> 與 <strong style={{ color: '#ff007f' }}>地面[J/K]</strong>！
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobileScreen ? '0.5rem' : '1rem' }}>
              <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: isMobileScreen ? '3px 8px' : '5px 14px', borderRadius: '6px', fontSize: isMobileScreen ? '0.70rem' : '0.85rem' }}>
                得票加爆：+200 票數！
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, padding: isMobileScreen ? '3px 8px' : '5px 14px', borderRadius: '6px', fontSize: isMobileScreen ? '0.70rem' : '0.85rem' }}>
                手機：左右雙手同時按壓！
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      stepTitle: '第 3 課：障礙物閃避',
      badge: '⚠️ 障礙物閃避',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobileScreen ? '0.4rem' : '0.8rem', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobileScreen ? '0.5rem' : '1rem', width: '100%' }}>
            {/* Dog Board */}
            <div style={{ background: 'rgba(255, 0, 85, 0.12)', border: '1.5px solid #ff0055', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/assets/hater_dog_board.png" alt="6666狗頭板" style={{ height: isMobileScreen ? '45px' : '75px', objectFit: 'contain', marginBottom: '2px' }} />
              <div style={{ fontSize: isMobileScreen ? '0.80rem' : '1rem', fontWeight: 900, color: '#ff0055' }}>6666 粉絲團長</div>
              <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.78rem', color: '#aaa', marginTop: '2px' }}>撞擊扣減 6% 選民支持度！</p>
            </div>

            {/* Shark */}
            <div style={{ background: 'rgba(255, 0, 85, 0.12)', border: '1.5px solid #ff0055', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/assets/hater_shark.png" alt="霸道鯊魚" style={{ height: isMobileScreen ? '45px' : '75px', objectFit: 'contain', marginBottom: '2px' }} />
              <div style={{ fontSize: isMobileScreen ? '0.80rem' : '1rem', fontWeight: 900, color: '#ff0055' }}>英俊鯊魚</div>
              <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.78rem', color: '#aaa', marginTop: '2px' }}>切換至對側軌道即可閃避！</p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 0, 85, 0.2)', padding: isMobileScreen ? '0.35rem 0.6rem' : '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ff0055', textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: isMobileScreen ? '0.72rem' : '0.85rem', color: '#fff', fontWeight: 900 }}>
              🛡️ 閃避法則：障礙物在空中時切到地面，障礙物在地面時切到空中！
            </span>
          </div>
        </div>
      )
    },
    {
      stepTitle: '第 4 課：Fevertime 熱血爆發模式',
      badge: '🔥 全場雙倍狂歡',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: isMobileScreen ? '0.7rem' : '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson4', '/assets/tutorial_lesson4.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson4: true }))}
              alt="Fevertime 熱血爆發"
              style={{
                maxHeight: isMobileScreen ? '100px' : '165px',
                maxWidth: isMobileScreen ? '140px' : '220px',
                objectFit: 'contain',
                borderRadius: '10px',
                border: '2px solid #ff007f',
                boxShadow: '0 0 15px rgba(255,0,127,0.4)',
                background: '#080a1e',
                padding: '3px'
              }}
            />
          </div>

          {/* Right Text */}
          <div style={{ background: 'rgba(255, 0, 127, 0.15)', border: '2px solid #ff007f', borderRadius: '12px', padding: isMobileScreen ? '0.6rem 0.8rem' : '1.1rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: isMobileScreen ? '0.95rem' : '1.25rem', fontWeight: 900, color: '#ff007f', marginBottom: '4px' }}>
              🔥 FEVER TIME 雙倍得票熱血爆發！
            </h4>
            <p style={{ fontSize: isMobileScreen ? '0.72rem' : '0.88rem', color: '#fff', lineHeight: 1.4, marginBottom: '6px' }}>
              持續擊中音符、積滿頂部熱血量條，自動觸發全場雙倍得分與絢麗光效！
            </p>
            <span style={{ background: '#ff007f', color: '#fff', fontWeight: 900, padding: isMobileScreen ? '3px 8px' : '4px 12px', borderRadius: '6px', fontSize: isMobileScreen ? '0.70rem' : '0.85rem' }}>
              持續時間：6 秒極限雙倍狂歡！
            </span>
          </div>
        </div>
      )
    },
    {
      stepTitle: '第 5 課：3 大造型戰力特化',
      badge: '👑 英雄造型技能',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: isMobileScreen ? '0.4rem' : '0.8rem', width: '100%' }}>
          {/* Default */}
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1.5px solid #00f0ff', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_default.png" alt="競選 Yoaka" style={{ height: isMobileScreen ? '42px' : '65px', objectFit: 'contain', marginBottom: '2px' }} />
            <div style={{ fontSize: isMobileScreen ? '0.78rem' : '0.95rem', fontWeight: 900, color: '#00f0ff' }}>競選 Yoaka</div>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>減傷：扣血降至 -4%</p>
          </div>

          {/* Office */}
          <div style={{ background: 'rgba(255, 230, 0, 0.1)', border: '1.5px solid #ffe600', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_office.png" alt="學霸 Yoaka" style={{ height: isMobileScreen ? '42px' : '65px', objectFit: 'contain', marginBottom: '2px' }} />
            <div style={{ fontSize: isMobileScreen ? '0.78rem' : '0.95rem', fontWeight: 900, color: '#ffe600' }}>學霸 Yoaka</div>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>得分：擊中得分 +20%</p>
          </div>

          {/* Kpop */}
          <div style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1.5px solid #ff007f', borderRadius: '10px', padding: isMobileScreen ? '0.4rem' : '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_kpop.png" alt="偶像 Yoaka" style={{ height: isMobileScreen ? '42px' : '65px', objectFit: 'contain', marginBottom: '2px' }} />
            <div style={{ fontSize: isMobileScreen ? '0.78rem' : '0.95rem', fontWeight: 900, color: '#ff007f' }}>偶像 Yoaka</div>
            <p style={{ fontSize: isMobileScreen ? '0.65rem' : '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>魅力：Fever 集速翻倍</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: isMobileScreen ? '0.4rem' : '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: '880px',
        maxWidth: '94vw',
        maxHeight: '94svh',
        overflowY: 'auto',
        padding: isMobileScreen ? '0.6rem 0.9rem' : '1.4rem 1.8rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobileScreen ? '0.4rem' : '0.8rem',
            right: isMobileScreen ? '0.4rem' : '0.8rem',
            background: 'rgba(255, 0, 85, 0.2)',
            border: '1.5px solid #ff0055',
            color: '#fff',
            borderRadius: '50%',
            width: isMobileScreen ? '30px' : '38px',
            height: isMobileScreen ? '30px' : '38px',
            fontWeight: 900,
            fontSize: isMobileScreen ? '0.9rem' : '1.1rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobileScreen ? '0.4rem' : '1rem' }}>
          <span style={{ background: '#00f0ff', color: '#000', fontWeight: 900, padding: isMobileScreen ? '2px 6px' : '3px 10px', borderRadius: '6px', fontSize: isMobileScreen ? '0.68rem' : '0.82rem' }}>
            {lessons[currentSlide].badge}
          </span>
          <h2 style={{ fontSize: isMobileScreen ? '1.05rem' : '1.6rem', fontWeight: 900, color: '#fff' }}>
            {lessons[currentSlide].stepTitle}
          </h2>
        </div>

        {/* Slide Content Box */}
        <div style={{ minHeight: isMobileScreen ? '135px' : '220px', marginBottom: isMobileScreen ? '0.6rem' : '1.2rem', display: 'flex', alignItems: 'center' }}>
          {lessons[currentSlide].content}
        </div>

        {/* Footer Navigation Dots & Prev/Next Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: isMobileScreen ? '0.4rem' : '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            style={{
              padding: isMobileScreen ? '0.35rem 0.8rem' : '0.55rem 1.2rem',
              background: currentSlide === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0, 240, 255, 0.15)',
              border: currentSlide === 0 ? '1px solid #444' : '1.5px solid #00f0ff',
              color: currentSlide === 0 ? '#555' : '#00f0ff',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: isMobileScreen ? '0.72rem' : '0.9rem',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ◀ 上一頁
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {lessons.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? (isMobileScreen ? '18px' : '24px') : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentSlide ? '#ffe600' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {currentSlide < lessons.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => Math.min(lessons.length - 1, prev + 1))}
              style={{
                padding: isMobileScreen ? '0.35rem 0.8rem' : '0.55rem 1.2rem',
                background: 'rgba(255, 230, 0, 0.15)',
                border: '1.5px solid #ffe600',
                color: '#ffe600',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: isMobileScreen ? '0.72rem' : '0.9rem',
                cursor: 'pointer'
              }}
            >
              下一頁 ▶
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                padding: isMobileScreen ? '0.35rem 1.0rem' : '0.55rem 1.4rem',
                background: '#00f0ff',
                border: 'none',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: isMobileScreen ? '0.75rem' : '0.9rem',
                cursor: 'pointer'
              }}
            >
              🚀 開局！
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
