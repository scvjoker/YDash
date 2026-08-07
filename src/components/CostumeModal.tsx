import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Sparkles, ArrowDown } from 'lucide-react';
import { CostumeId } from '../types/game';
import { COSTUMES_DATA } from '../game/Beatmaps';

interface CostumeModalProps {
  selectedCostume: CostumeId;
  onSelectCostume: (id: CostumeId) => void;
  onClose: () => void;
}

export const CostumeModal: React.FC<CostumeModalProps> = ({
  selectedCostume,
  onSelectCostume,
  onClose
}) => {
  const [imagesMap, setImagesMap] = useState<{ [id: string]: string }>({});
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900 || window.innerHeight <= 550);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    COSTUMES_DATA.forEach(costume => {
      let candidates: string[] = ['/yoaka_main.jpg'];
      if (costume.id === 'office_glasses') {
        candidates = ['/assets/yoaka_office.png', '/assets/yoaka_office.jpg', '/yoaka_office.png', '/yoaka_office.jpg', '/yoaka_main.jpg'];
      } else if (costume.id === 'kpop_idol') {
        candidates = ['/assets/yoaka_kpop.png', '/assets/yoaka_kpop.jpg', '/yoaka_kpop.png', '/yoaka_kpop.jpg', '/yoaka_main.jpg'];
      } else {
        candidates = ['/assets/yoaka_default.png', '/assets/yoaka_default.jpg', '/yoaka_default.png', '/yoaka_default.jpg', '/yoaka_main.jpg'];
      }

      let index = 0;
      const testNext = () => {
        if (index < candidates.length) {
          const url = candidates[index++];
          const img = new Image();
          img.onload = () => {
            setImagesMap(prev => ({ ...prev, [costume.id]: url }));
          };
          img.onerror = () => testNext();
          img.src = url;
        }
      };
      testNext();
    });
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: isMobileScreen ? '0.4rem' : '1.5rem'
    }}>
      <div className="cyber-panel" style={{
        width: '960px',
        maxWidth: '96vw',
        maxHeight: '94svh',
        overflowY: 'auto',
        padding: isMobileScreen ? '0.6rem 0.9rem' : '1.8rem 2.2rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobileScreen ? '0.4rem' : '1rem',
            right: isMobileScreen ? '0.4rem' : '1rem',
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1.5px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: isMobileScreen ? '30px' : '42px',
            height: isMobileScreen ? '30px' : '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255, 0, 127, 0.5)',
            zIndex: 10
          }}
        >
          <X size={isMobileScreen ? 16 : 22} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobileScreen ? '0.4rem' : '1.2rem' }}>
          <div>
            <h2 style={{
              fontSize: isMobileScreen ? '1.2rem' : '2.2rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#00f0ff',
              textShadow: '0 0 12px rgba(0,240,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={isMobileScreen ? 16 : 26} color="#ffe600" /> 選民拜票換裝館 (COSTUME WARDROBE)
            </h2>
            <p style={{ color: '#aaa', fontSize: isMobileScreen ? '0.72rem' : '0.95rem', marginTop: '1px' }}>
              每款換裝皆擁有真實戰力加成效果，選擇最適合您競選風格的戰服！
            </p>
          </div>

          {/* Scroll Hint Badge */}
          <div style={{
            background: 'rgba(255, 230, 0, 0.12)',
            border: '1.5px solid rgba(255, 230, 0, 0.4)',
            color: '#ffe600',
            borderRadius: '12px',
            padding: isMobileScreen ? '2px 8px' : '6px 14px',
            fontSize: isMobileScreen ? '0.68rem' : '0.85rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <ArrowDown size={isMobileScreen ? 11 : 16} /> ↕️ 滑動
          </div>
        </div>

        {/* Costume Cards 3-Column Parallel Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: isMobileScreen ? '0.5rem' : '1.2rem',
          marginBottom: '0.3rem'
        }}>
          {COSTUMES_DATA.map(costume => {
            const isSelected = selectedCostume === costume.id;
            const imgSrc = imagesMap[costume.id] || '/yoaka_main.jpg';

            return (
              <div
                key={costume.id}
                onClick={() => onSelectCostume(costume.id)}
                style={{
                  background: isSelected ? 'rgba(10, 20, 45, 0.95)' : 'rgba(15, 18, 38, 0.65)',
                  border: isSelected ? `2.5px solid ${costume.accentColor}` : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: isMobileScreen ? '0.45rem' : '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: isSelected ? `0 0 20px ${costume.accentColor}` : 'none',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Active Check Badge */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: isMobileScreen ? '6px' : '12px',
                    right: isMobileScreen ? '6px' : '12px',
                    background: costume.accentColor,
                    color: '#000',
                    borderRadius: '50%',
                    width: isMobileScreen ? '18px' : '26px',
                    height: isMobileScreen ? '18px' : '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 10px ${costume.accentColor}`,
                    zIndex: 2
                  }}>
                    <Check size={isMobileScreen ? 12 : 18} strokeWidth={3} />
                  </div>
                )}

                {/* Costume Character Standee Image */}
                <div style={{
                  width: '100%',
                  height: isMobileScreen ? '72px' : '165px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: isMobileScreen ? '0.3rem' : '0.8rem',
                  background: '#07091e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={imgSrc}
                    alt={costume.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <div>
                  <h3 style={{
                    fontSize: isMobileScreen ? '0.88rem' : '1.25rem',
                    fontWeight: 900,
                    color: costume.accentColor,
                    marginBottom: '0.1rem'
                  }}>
                    {costume.name}
                  </h3>

                  <p style={{
                    fontSize: isMobileScreen ? '0.65rem' : '0.82rem',
                    color: '#ccc',
                    lineHeight: 1.3,
                    marginBottom: isMobileScreen ? '0.3rem' : '0.8rem',
                    height: isMobileScreen ? '24px' : '40px',
                    overflow: 'hidden'
                  }}>
                    {costume.description}
                  </p>

                  {/* Skill Tag Badge */}
                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: isMobileScreen ? '2px 5px' : '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: `1px solid ${costume.accentColor}55`
                  }}>
                    <Shield size={isMobileScreen ? 10 : 15} color={costume.accentColor} />
                    <span style={{
                      fontSize: isMobileScreen ? '0.65rem' : '0.8rem',
                      fontWeight: 800,
                      color: costume.accentColor
                    }}>
                      技能: {costume.perk}
                    </span>
                  </div>
                </div>

                <button
                  className={isSelected ? 'muse-btn' : 'muse-btn muse-btn-cyan'}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectCostume(costume.id);
                  }}
                  style={{
                    marginTop: isMobileScreen ? '0.35rem' : '1rem',
                    width: '100%',
                    fontSize: isMobileScreen ? '0.72rem' : '0.9rem',
                    padding: isMobileScreen ? '0.3rem' : '0.65rem',
                    background: isSelected ? costume.accentColor : undefined,
                    color: isSelected ? '#000' : undefined
                  }}
                >
                  <span>{isSelected ? '✓ 當前裝備' : '裝備造型'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
