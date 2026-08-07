import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});

  const getImageSrc = (key: string, fallback: string) => {
    if (imgErrors[key]) return '/assets/tissue_pack.png';
    return fallback;
  };

  const lessons = [
    {
      stepTitle: '第 1 課：Note 一般音符與投遞面紙',
      badge: '📘 音符基礎概念',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson1', '/assets/tutorial_lesson1.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson1: true }))}
              alt="Note 打擊教學"
              style={{
                maxHeight: '165px',
                maxWidth: '220px',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '2px solid #00f0ff',
                boxShadow: '0 0 20px rgba(0,240,255,0.3)',
                background: '#080a1e',
                padding: '4px'
              }}
            />
          </div>

          {/* Right Text Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {/* Air Note Card */}
              <div style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1.5px solid #00f0ff', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#00f0ff', marginBottom: '2px' }}>
                  ☁️ 空中選民音符
                </div>
                <p style={{ fontSize: '0.8rem', color: '#ddd', marginBottom: '6px' }}>
                  按下 <strong style={{ color: '#ffe600' }}>[D] / [F]</strong> 躍起投遞面紙拉票！
                </p>
                <div style={{ background: '#00f0ff', color: '#000', fontWeight: 900, padding: '3px', borderRadius: '6px', fontSize: '0.75rem' }}>
                  手機按鈕：空中按鈕 (AIR)
                </div>
              </div>

              {/* Ground Note Card */}
              <div style={{ background: 'rgba(255, 0, 127, 0.12)', border: '1.5px solid #ff007f', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ff007f', marginBottom: '2px' }}>
                  🏃 地面選民音符
                </div>
                <p style={{ fontSize: '0.8rem', color: '#ddd', marginBottom: '6px' }}>
                  按下 <strong style={{ color: '#ffe600' }}>[J] / [K]</strong> 地面奔跑親切發面紙！
                </p>
                <div style={{ background: '#ff007f', color: '#fff', fontWeight: 900, padding: '3px', borderRadius: '6px', fontSize: '0.75rem' }}>
                  手機按鈕：地面按鈕 (GROUND)
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,230,0,0.3)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.82rem', color: '#ffe600', fontWeight: 800 }}>
                💡 拜票小秘訣：抓準音符抵達 Hit Zone 的黃金瞬間（Perfect 完美聲勢），即可贏得大量選民支持票數！
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
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson2', '/assets/tutorial_lesson2.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson2: true }))}
              alt="Dual Note 金黃雙擊"
              style={{
                maxHeight: '165px',
                maxWidth: '220px',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '2px solid #ffe600',
                boxShadow: '0 0 20px rgba(255,230,0,0.4)',
                background: '#080a1e',
                padding: '4px'
              }}
            />
          </div>

          {/* Right Text */}
          <div style={{ background: 'rgba(255, 230, 0, 0.12)', border: '2px solid #ffe600', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffe600', marginBottom: '6px' }}>
              ⚡ 金黃連線雙音符 (DUAL STRIKE)
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.5, marginBottom: '10px' }}>
              當畫面上出現金黃色雷射光束連接的上下軌音符時，請同時按下 <strong style={{ color: '#00f0ff' }}>空中[D/F]</strong> 與 <strong style={{ color: '#ff007f' }}>地面[J/K]</strong>！
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ background: '#ffe600', color: '#000', fontWeight: 900, padding: '5px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                得票加爆：+200 票數！！
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, padding: '5px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                手機：左右雙手同時按壓！
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      stepTitle: '第 3 課：Hater 6666狗頭板與霸道鯊魚',
      badge: '⚠️ 障礙物閃避',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
            {/* Dog Board */}
            <div style={{ background: 'rgba(255, 0, 85, 0.12)', border: '1.5px solid #ff0055', borderRadius: '12px', padding: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/assets/hater_dog_board.png" alt="6666狗頭板" style={{ height: '75px', objectFit: 'contain', marginBottom: '4px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ff0055' }}>6666 黑粉狗頭板</div>
              <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '4px' }}>撞擊將扣減 6% 選民支持度！</p>
            </div>

            {/* Shark */}
            <div style={{ background: 'rgba(255, 0, 85, 0.12)', border: '1.5px solid #ff0055', borderRadius: '12px', padding: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/assets/hater_shark.png" alt="霸道鯊魚" style={{ height: '75px', objectFit: 'contain', marginBottom: '4px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ff0055' }}>霸道鯊魚障礙</div>
              <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '4px' }}>切換至對側軌道即可成功閃避！</p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 0, 85, 0.2)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ff0055', textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 900 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Hero Image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={getImageSrc('lesson4', '/assets/tutorial_lesson4.png')}
              onError={() => setImgErrors(prev => ({ ...prev, lesson4: true }))}
              alt="Fevertime 熱血爆發"
              style={{
                maxHeight: '165px',
                maxWidth: '220px',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '2px solid #ff007f',
                boxShadow: '0 0 20px rgba(255,0,127,0.4)',
                background: '#080a1e',
                padding: '4px'
              }}
            />
          </div>

          {/* Right Text */}
          <div style={{ background: 'rgba(255, 0, 127, 0.15)', border: '2px solid #ff007f', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff007f', marginBottom: '6px' }}>
              🔥 FEVER TIME 雙倍得票熱血爆發！
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.5, marginBottom: '8px' }}>
              只要持續擊中音符、累積滿畫面頂部的熱血 Fever 量條，即可自動觸發全場雙倍得分與絢麗背景光效！
            </p>
            <span style={{ background: '#ff007f', color: '#fff', fontWeight: 900, padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', width: '100%' }}>
          {/* Default */}
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1.5px solid #00f0ff', borderRadius: '12px', padding: '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_default.png" alt="競選 Yoaka" style={{ height: '65px', objectFit: 'contain', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#00f0ff' }}>競選 Yoaka</div>
            <p style={{ fontSize: '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>減傷保護：受擊扣血由 -6% 降至 -4%</p>
          </div>

          {/* Office */}
          <div style={{ background: 'rgba(255, 230, 0, 0.1)', border: '1.5px solid #ffe600', borderRadius: '12px', padding: '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_office.png" alt="學霸 Yoaka" style={{ height: '65px', objectFit: 'contain', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffe600' }}>學霸 Yoaka</div>
            <p style={{ fontSize: '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>得分霸主：擊中得票永久額外 +20%！</p>
          </div>

          {/* Kpop */}
          <div style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1.5px solid #ff007f', borderRadius: '12px', padding: '0.7rem', textAlign: 'center' }}>
            <img src="/assets/yoaka_kpop.png" alt="偶像 Yoaka" style={{ height: '65px', objectFit: 'contain', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ff007f' }}>偶像 Yoaka</div>
            <p style={{ fontSize: '0.75rem', color: '#ffe600', fontWeight: 800, marginTop: '2px' }}>爆發魅力：Fever 能量累積速度翻倍！</p>
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
      padding: '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: '880px',
        maxWidth: '94vw',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '1.4rem 1.8rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
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
            width: '38px',
            height: '38px',
            fontWeight: 900,
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <span style={{ background: '#00f0ff', color: '#000', fontWeight: 900, padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
            {lessons[currentSlide].badge}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
            {lessons[currentSlide].stepTitle}
          </h2>
        </div>

        {/* Slide Content Box */}
        <div style={{ minHeight: '220px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center' }}>
          {lessons[currentSlide].content}
        </div>

        {/* Footer Navigation Dots & Prev/Next Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            style={{
              padding: '0.55rem 1.2rem',
              background: currentSlide === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0, 240, 255, 0.15)',
              border: currentSlide === 0 ? '1px solid #444' : '1.5px solid #00f0ff',
              color: currentSlide === 0 ? '#555' : '#00f0ff',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ◀ 上一頁
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {lessons.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
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
                padding: '0.55rem 1.2rem',
                background: 'rgba(255, 230, 0, 0.15)',
                border: '1.5px solid #ffe600',
                color: '#ffe600',
                borderRadius: '8px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              下一頁 ▶
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                padding: '0.55rem 1.4rem',
                background: '#00f0ff',
                border: 'none',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              🚀 我學會了，開局！
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
