import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Zap, Sparkles } from 'lucide-react';
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
      backgroundColor: 'rgba(7, 8, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '900px',
        maxWidth: '96vw',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '1.2rem 1.6rem',
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
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1.5px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
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

        <h2 style={{
          fontSize: '1.8rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#00f0ff',
          marginBottom: '0.2rem',
          textShadow: '0 0 15px rgba(0,240,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={24} color="#ffe600" /> 選民拜票換裝館 (COSTUME WARDROBE)
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1rem' }}>
          每款換裝皆擁有真實戰力加成效果，選擇最適合您競選風格的戰服！
        </p>

        {/* Costume Cards Grid (Responsive Grid for Mobile Landscape) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
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
                  borderRadius: '16px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: isSelected ? `0 0 25px ${costume.accentColor}` : 'none',
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
                    top: '10px',
                    right: '10px',
                    background: costume.accentColor,
                    color: '#000',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 10px ${costume.accentColor}`
                  }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}

                {/* Costume Character Standee Image */}
                <div style={{
                  width: '100%',
                  height: '135px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '0.6rem',
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
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: costume.accentColor,
                    marginBottom: '0.2rem'
                  }}>
                    {costume.name}
                  </h3>

                  <p style={{
                    fontSize: '0.78rem',
                    color: '#ccc',
                    lineHeight: 1.35,
                    marginBottom: '0.6rem',
                    height: '36px',
                    overflow: 'hidden'
                  }}>
                    {costume.description}
                  </p>

                  {/* Skill Tag Badge */}
                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '5px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: `1px solid ${costume.accentColor}55`
                  }}>
                    <Shield size={14} color={costume.accentColor} />
                    <span style={{
                      fontSize: '0.75rem',
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
                    marginTop: '0.8rem',
                    width: '100%',
                    fontSize: '0.85rem',
                    padding: '0.5rem',
                    background: isSelected ? costume.accentColor : undefined,
                    color: isSelected ? '#000' : undefined
                  }}
                >
                  <span>{isSelected ? '✓ 當前穿著中' : '選擇此造型裝備'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
