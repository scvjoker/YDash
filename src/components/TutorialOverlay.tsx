import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TUTORIAL_SLIDES = [
  {
    id: 'notes',
    badge: '第一課：音符打擊 (NOTE)',
    title: '空中與地面選民音符',
    subtitle: '親切發放拜票衛生紙，獲得選民支持得票！',
    img: '/assets/tutorial_lesson1.png',
    cardBorder: '#00f0ff',
    content: (
      <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#e0e0e0' }}>
        <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #00f0ff', marginBottom: '1rem' }}>
          <p style={{ color: '#00f0ff', fontWeight: 900, fontSize: '1.05rem', marginBottom: '4px' }}>
            ☁️ 上軌空中音符 (AIR VOTER)
          </p>
          <p>按下鍵盤 <strong>[D]</strong> 或 <strong>[F]</strong> 鍵（手機點擊左側藍色按紐），跳起空中向高處選民發放拜票紙巾！</p>
        </div>

        <div style={{ background: 'rgba(255, 0, 127, 0.1)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #ff007f' }}>
          <p style={{ color: '#ff007f', fontWeight: 900, fontSize: '1.05rem', marginBottom: '4px' }}>
            🏃 下軌地面音符 (GROUND VOTER)
          </p>
          <p>按下鍵盤 <strong>[J]</strong> 或 <strong>[K]</strong> 鍵（手機點擊右側粉色按紐），在地面奔跑發放拜票紙巾！</p>
        </div>
      </div>
    )
  },
  {
    id: 'dual_note',
    badge: '第二課：金黃雙擊 (DUAL NOTE)',
    title: '⚡ 雙軌同時打擊',
    subtitle: '上下軌同時出現金黃光芒音符，獲得 2 倍超高票數！',
    img: '/assets/tutorial_lesson2.png',
    cardBorder: '#ffe600',
    content: (
      <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#e0e0e0' }}>
        <div style={{ background: 'rgba(255, 230, 0, 0.12)', padding: '1rem 1.2rem', borderRadius: '12px', border: '1.5px solid #ffe600', marginBottom: '1rem' }}>
          <p style={{ color: '#ffe600', fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>
            ⚡ 雙手同時按壓 (DUAL STRIKE)
          </p>
          <p>當上下軌同時出現帶有閃電金光的音符時，請<strong>同時按下左手 [D/F] 與右手 [J/K]</strong>（或手機左右按紐同時按壓）！</p>
          <p style={{ color: '#ffe600', fontWeight: 800, marginTop: '6px' }}>
            解鎖完美雙擊判定，一次直接入帳 200+ 得票數與金色電光特效！
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'hater',
    badge: '第三課：閃避障礙物',
    title: '⚠️ 6666板板 與 帥氣鯊魚',
    subtitle: '小心路上的生物，即時切換軌道閃避！',
    img: '/assets/hater_dog_board.png',
    cardBorder: '#ff0055',
    content: (
      <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#e0e0e0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(255, 0, 85, 0.15)', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ff0055', textAlign: 'center' }}>
            <img src="/assets/hater_dog_board.png" alt="6666 板板" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <p style={{ color: '#ff0055', fontWeight: 900, marginTop: '4px' }}>6666 板板</p>
          </div>

          <div style={{ background: 'rgba(255, 0, 85, 0.15)', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ff0055', textAlign: 'center' }}>
            <img src="/assets/hater_shark.png" alt="帥氣鯊魚" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <p style={{ color: '#ff0055', fontWeight: 900, marginTop: '4px' }}>帥氣鯊魚</p>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 0, 85, 0.1)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #ff0055' }}>
          <p style={{ color: '#ff0055', fontWeight: 900, marginBottom: '4px' }}>⚠️ 撞擊懲罰：</p>
          <p>若未及時切換軌道閃避，撞上障礙物將會<strong>扣除 6% 選民支持度 (HP)</strong> 並中斷 Combo！支持度降至 0% 競選將告失敗！</p>
        </div>
      </div>
    )
  },
  {
    id: 'fevertime',
    badge: '第四課：熱血爆發 (FEVER TIME)',
    title: '🔥 FEVER 雙倍票數熱血狂歡',
    subtitle: '連續完美 Hit 累積熱血能量，觸發全場雙倍得分！',
    img: '/assets/tutorial_lesson4.png',
    cardBorder: '#ffe600',
    content: (
      <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#e0e0e0' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,0,127,0.2), rgba(255,230,0,0.2))', padding: '1rem 1.2rem', borderRadius: '12px', border: '1.5px solid #ffe600', marginBottom: '1rem' }}>
          <p style={{ color: '#ffe600', fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>
            🔥 狂歡熱血全開！
          </p>
          <p>每次成功擊中音符都會累積能量。當能量條達到 100% 時，自動解鎖 <strong>FEVER MODE (6 秒)</strong>！</p>
          <p style={{ color: '#ff007f', fontWeight: 900, marginTop: '6px' }}>
            全場背景進入熱血紫色霓虹光，所有獲取的票數直接翻倍 (2X SCORE)！
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'costumes',
    badge: '第五課：造型技能 (COSTUMES)',
    title: '👑 3 大 Yoaka 戰力特化加成',
    subtitle: '前往「選民拜票換裝館」，裝備專屬競選戰袍！',
    img: '/assets/yoaka_office.png',
    cardBorder: '#00f0ff',
    content: (
      <div style={{ lineHeight: 1.5, fontSize: '0.88rem', color: '#e0e0e0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #00f0ff' }}>
          <span style={{ color: '#00f0ff', fontWeight: 900 }}>👑 競選 Yoaka：</span> 失誤或撞到黑粉時，支持度扣血減少 33% (防護保命)。
        </div>

        <div style={{ background: 'rgba(255, 230, 0, 0.1)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #ffe600' }}>
          <span style={{ color: '#ffe600', fontWeight: 900 }}>👓 學霸 Yoaka：</span> 理智高分特化，每次發紙獲票數額外 +20% 得票加成！
        </div>

        <div style={{ background: 'rgba(255, 0, 127, 0.1)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #ff007f' }}>
          <span style={{ color: '#ff007f', fontWeight: 900 }}>✨ 偶像 Yoaka：</span> 魅力全開，FEVER 熱血能量積累速度翻倍！
        </div>
      </div>
    )
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const currentSlide = TUTORIAL_SLIDES[currentSlideIndex];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '840px',
        maxWidth: '95vw',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '1.6rem 2rem',
        position: 'relative',
        border: `2px solid ${currentSlide.cardBorder}`,
        boxShadow: `0 0 35px ${currentSlide.cardBorder}55`
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <span style={{
              background: currentSlide.cardBorder,
              color: '#000',
              fontWeight: 900,
              padding: '3px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              letterSpacing: '1px'
            }}>
              {currentSlide.badge}
            </span>
            <h2 style={{
              fontSize: '1.8rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#fff',
              marginTop: '6px'
            }}>
              {currentSlide.title}
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{currentSlide.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 0, 85, 0.2)',
              border: '1.5px solid #ff0055',
              color: '#fff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontWeight: 900,
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Slide Body: Image + Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Real Game Image Showcase */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '16px',
            padding: '1rem',
            border: `1.5px solid ${currentSlide.cardBorder}66`,
            textAlign: 'center',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={currentSlide.img}
              alt={currentSlide.title}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </div>

          {/* Interactive Lesson Explanation Content */}
          <div>{currentSlide.content}</div>
        </div>

        {/* Bottom Pagination & Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Step Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {TUTORIAL_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: idx === currentSlideIndex ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: idx === currentSlideIndex ? currentSlide.cardBorder : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {currentSlideIndex > 0 && (
              <button
                className="muse-btn muse-btn-cyan"
                onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
              >
                <span>上一課</span>
              </button>
            )}

            {currentSlideIndex < TUTORIAL_SLIDES.length - 1 ? (
              <button
                className="muse-btn"
                onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
              >
                <span>下一課 ▸</span>
              </button>
            ) : (
              <button
                className="muse-btn muse-btn-yellow"
                onClick={onClose}
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
              >
                <span>學會了，開啟拜票！</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
