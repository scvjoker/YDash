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
      padding: '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: '940px',
        maxWidth: '98vw',
        maxHeight: '96vh',
        overflowY: 'auto',
        padding: '1rem 1.4rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.6rem',
            right: '0.6rem',
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1.5px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255, 0, 127, 0.5)',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#00f0ff',
              textShadow: '0 0 12px rgba(0,240,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={20} color="#ffe600" /> 選民拜票換裝館 (COSTUME WARDROBE)
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '2px' }}>
              每款換裝皆擁有真實戰力加成效果，選擇最適合您競選風格的戰服！
            </p>
          </div>

          {/* Scroll Hint Badge for Small Screen Mobile */}
          <div style={{
            background: 'rgba(255, 230, 0, 0.12)',
            border: '1px solid rgba(255, 230, 0, 0.4)',
            color: '#ffe600',
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ArrowDown size={13} /> ↕️ 上下滑動檢視
          </div>
        </div>

        {/* Costume Cards 3-Column Parallel Layout (三欄並排) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.8rem',
          marginBottom: '0.5rem'
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
                  border: isSelected ? `2px solid ${costume.accentColor}` : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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
                    top: '8px',
                    right: '8px',
                    background: costume.accentColor,
                    color: '#000',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 8px ${costume.accentColor}`,
                    zIndex: 2
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}

                {/* Costume Character Standee Image (Compact 95px) */}
                <div style={{
                  width: '100%',
                  height: '95px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '0.4rem',
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
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: costume.accentColor,
                    marginBottom: '0.1rem'
                  }}>
                    {costume.name}
                  </h3>

                  <p style={{
                    fontSize: '0.72rem',
                    color: '#ccc',
                    lineHeight: 1.25,
                    marginBottom: '0.4rem',
                    height: '30px',
                    overflow: 'hidden'
                  }}>
                    {costume.description}
                  </p>

                  {/* Skill Tag Badge */}
                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '3px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: `1px solid ${costume.accentColor}55`
                  }}>
                    <Shield size={12} color={costume.accentColor} />
                    <span style={{
                      fontSize: '0.7rem',
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
                    marginTop: '0.5rem',
                    width: '100%',
                    fontSize: '0.78rem',
                    padding: '0.4rem',
                    background: isSelected ? costume.accentColor : undefined,
                    color: isSelected ? '#000' : undefined
                  }}
                >
                  <span>{isSelected ? '✓ 當前裝備中' : '裝備此造型'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
