import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TUTORIAL_SLIDES = [
  {
    step: 1,
    title: '🏃 第一課：雙軌拜票與傳單發送',
    badge: '基礎操作',
    icon: '🏃',
    color: '#00f0ff',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.45 }}>
          《YoakaDash》是一款雙軌賽博跑道音遊！主角 Yoaka 將在賽道上勇敢前進，您的任務是手握【面紙傳單】精準發送給選民！
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1.5px solid #00f0ff', borderRadius: '12px', padding: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <img src="/assets/tissue_pack.png" alt="面紙" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <h4 style={{ color: '#00f0ff', fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>
                ☁️ 上軌 (空中投紙)
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '6px' }}>
              當藍色音符抵達左側靶心時擊扣！
            </p>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span className="key-badge">D</span>
              <span className="key-badge">F</span>
              <span style={{ fontSize: '0.72rem', color: '#00f0ff', alignSelf: 'center' }}>或點擊左下藍紐</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1.5px solid #ff007f', borderRadius: '12px', padding: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <img src="/assets/tissue_pack.png" alt="面紙" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <h4 style={{ color: '#ff007f', fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>
                🏃 下軌 (地面發紙)
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '6px' }}>
              當粉色音符抵達左側靶心時擊扣！
            </p>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span className="key-badge">J</span>
              <span className="key-badge">K</span>
              <span style={{ fontSize: '0.72rem', color: '#ff007f', alignSelf: 'center' }}>或點擊右下粉紐</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 2,
    title: '⚡ 第二課：雙擊音符與票數倍增',
    badge: '高分技巧',
    icon: '⚡',
    color: '#ffe600',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.45 }}>
          賽道上會出現帶有【⚡ DUAL】光芒的金黃音符！這代表上下兩軌同時出現重要選民支持者！
        </p>

        <div style={{ background: 'rgba(255, 230, 0, 0.12)', border: '1.5px solid #ffe600', borderRadius: '14px', padding: '0.9rem', textAlign: 'center' }}>
          <h4 style={{ color: '#ffe600', fontSize: '1.05rem', fontWeight: 900, marginBottom: '6px' }}>
            ⚡ 雙手同時按壓 (DUAL STRIKE)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#fff', marginBottom: '8px' }}>
            同時按下【上軌 (D/F)】與【下軌 (J/K)】鍵，觸發金黃雙管齊下！
          </p>
          <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '4px 14px', borderRadius: '20px' }}>
            <span style={{ color: '#ffe600', fontWeight: 900, fontSize: '0.88rem' }}>+200 得票數加倍！</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 3,
    title: '⚠️ 第三課：閃避黑粉與支持度 (HP)',
    badge: '生存防禦',
    icon: '⚠️',
    color: '#ff0055',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', textAlign: 'left' }}>
        <p style={{ color: '#ccc', fontSize: '0.88rem', lineHeight: 1.4 }}>
          競選路上會有【狗頭舉牌板】與【賽博巨型鯊魚】黑粉攔路！
        </p>

        {/* Hater Real Images Showcase Box */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <img src="/assets/hater_dog_board.png" alt="狗頭黑粉" style={{ width: '55px', height: '55px', objectFit: 'contain' }} />
            <p style={{ fontSize: '0.7rem', color: '#ff0055', fontWeight: 800 }}>狗頭舉牌黑粉</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src="/assets/hater_shark.png" alt="鯊魚黑粉" style={{ width: '55px', height: '55px', objectFit: 'contain' }} />
            <p style={{ fontSize: '0.7rem', color: '#ff0055', fontWeight: 800 }}>賽博巨型鯊魚</p>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 0, 85, 0.12)', border: '1.5px solid #ff0055', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
          <h4 style={{ color: '#ff0055', fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>
            🛡️ 軌道切換閃避 (DODGE)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#fff', margin: 0 }}>
            黑粉在下軌請切換至【上軌】；黑粉在上軌請切換至【下軌】！正面撞擊黑粉將扣減【選民支持度 (HP)】！
          </p>
        </div>
      </div>
    )
  },
  {
    step: 4,
    title: '🔥 第四課：FEVER 熱血雙倍爆發',
    badge: '熱血爆發',
    icon: '🔥',
    color: '#ff007f',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.45 }}>
          連續精準擊中音符將迅速積累【FEVER 熱血值】！
        </p>

        <div style={{ background: 'rgba(255, 0, 127, 0.12)', border: '1.5px solid #ff007f', borderRadius: '14px', padding: '0.9rem', textAlign: 'center' }}>
          <h4 style={{ color: '#ff007f', fontSize: '1.05rem', fontWeight: 900, marginBottom: '6px' }}>
            🔥 FEVER MODE 雙倍票數狂歡
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#fff', marginBottom: '8px' }}>
            熱血值填滿後自動進入 FEVER 狀態！6 秒內獲得的【得票數全部乘以 2 倍】！
          </p>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block' }}>
            <span style={{ color: '#ffe600', fontWeight: 900, fontSize: '0.85rem' }}>🔥 搭配高 Combo 瞬間衝上競選榜首！</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 5,
    title: '👑 第五課：3 大競選戰袍技能指南',
    badge: '換裝戰力',
    icon: '👑',
    color: '#00ff87',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
        <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>
          在主選單的【選民拜票換裝館】可隨時更換 Yoaka 的戰鬥姿態，每套皆具備專屬技能：
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid #00f0ff', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/yoaka_default.png" alt="競選 Yoaka" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px' }} />
            <div style={{ flex: 1 }}>
              <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: '0.85rem' }}>競選 Yoaka </span>
              <span style={{ color: '#fff', fontSize: '0.75rem' }}>: Miss 扣血傷害減少 33% (新手保底)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 230, 0, 0.1)', border: '1px solid #ffe600', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/yoaka_office.png" alt="學霸 Yoaka" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px' }} />
            <div style={{ flex: 1 }}>
              <span style={{ color: '#ffe600', fontWeight: 900, fontSize: '0.85rem' }}>學霸 Yoaka </span>
              <span style={{ color: '#fff', fontSize: '0.75rem' }}>: 總獲票數 (Score) 獲得額外 +20% 加成</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1px solid #ff007f', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/yoaka_kpop.png" alt="偶像 Yoaka" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px' }} />
            <div style={{ flex: 1 }}>
              <span style={{ color: '#ff007f', fontWeight: 900, fontSize: '0.85rem' }}>偶像 Yoaka </span>
              <span style={{ color: '#fff', fontSize: '0.75rem' }}>: FEVER 熱血爆發積累速度翻倍</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const currentSlide = TUTORIAL_SLIDES[currentSlideIndex];
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === TUTORIAL_SLIDES.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentSlideIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentSlideIndex(prev => prev - 1);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '680px',
        maxWidth: '94vw',
        maxHeight: '94vh',
        padding: '1.8rem 2.2rem',
        position: 'relative',
        border: `2px solid ${currentSlide.color}`,
        boxShadow: `0 0 35px ${currentSlide.color}55`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1.5px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255, 0, 127, 0.5)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <span style={{
              background: currentSlide.color,
              color: '#000',
              fontWeight: 900,
              padding: '3px 12px',
              borderRadius: '14px',
              fontSize: '0.78rem'
            }}>
              {currentSlide.badge} ({currentSlideIndex + 1}/{TUTORIAL_SLIDES.length})
            </span>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: currentSlide.color,
              textShadow: `0 0 12px ${currentSlide.color}66`
            }}>
              {currentSlide.title}
            </h2>
          </div>
        </div>

        {/* Slide Content Body */}
        <div style={{ margin: '1rem 0', minHeight: '210px' }}>
          {currentSlide.content}
        </div>

        {/* Slide Footer Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '0.9rem'
        }}>
          {/* Step Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {TUTORIAL_SLIDES.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: idx === currentSlideIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentSlideIndex ? currentSlide.color : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {!isFirst && (
              <button
                onClick={handlePrev}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '6px 16px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft size={16} /> 上一頁
              </button>
            )}

            {!isLast ? (
              <button
                className="muse-btn"
                onClick={handleNext}
                style={{ fontSize: '0.95rem', padding: '0.55rem 1.4rem' }}
              >
                <span>下一頁 <ChevronRight size={18} /></span>
              </button>
            ) : (
              <button
                className="muse-btn muse-btn-yellow"
                onClick={onClose}
                style={{ fontSize: '0.95rem', padding: '0.55rem 1.4rem' }}
              >
                <span><CheckCircle size={18} /> 我懂了！開始競選拜票</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
