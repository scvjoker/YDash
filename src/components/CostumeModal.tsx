import React from 'react';
import { X, Check } from 'lucide-react';
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
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(7, 8, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '900px',
        maxWidth: '95vw',
        padding: '2.2rem',
        position: 'relative',
        border: '2px solid #00f0ff',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1.5px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.5)'
          }}
        >
          <X size={22} />
        </button>

        <h2 style={{
          fontSize: '2.4rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#00f0ff',
          marginBottom: '0.4rem',
          textShadow: '0 0 15px rgba(0,240,255,0.6)'
        }}>
          👗 YOAKA 競選換裝試衣間
        </h2>
        <p style={{ color: '#aaa', fontSize: '1.05rem', marginBottom: '2rem' }}>
          選擇不同拜票造型，獲得專屬得票與選民支持度技能加成！
        </p>

        {/* Costume Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {COSTUMES_DATA.map(costume => {
            const isSelected = selectedCostume === costume.id;

            let iconSymbol = '🎽';
            if (costume.id === 'office_glasses') iconSymbol = '👔';
            if (costume.id === 'kpop_idol') iconSymbol = '✨';

            return (
              <div
                key={costume.id}
                onClick={() => onSelectCostume(costume.id)}
                style={{
                  background: isSelected ? costume.bgGradient : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `2.5px solid ${costume.accentColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '1.8rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s',
                  boxShadow: isSelected ? `0 0 25px ${costume.accentColor}` : 'none'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: costume.accentColor,
                    color: '#000',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px currentColor'
                  }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {iconSymbol}
                  </div>

                  <h3 style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#fff',
                    textAlign: 'center',
                    marginBottom: '0.3rem'
                  }}>
                    {costume.name}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: costume.accentColor,
                    fontWeight: 800,
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {costume.subtitle}
                  </p>

                  <p style={{
                    fontSize: '0.9rem',
                    color: '#ccc',
                    lineHeight: 1.5,
                    marginBottom: '1.2rem'
                  }}>
                    {costume.description}
                  </p>
                </div>

                {/* Perk Badge Tag */}
                <div style={{
                  background: isSelected ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
                  border: `1.5px solid ${costume.accentColor}`,
                  borderRadius: '12px',
                  padding: '0.65rem 0.8rem',
                  textAlign: 'center',
                  color: '#ffe600',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  boxShadow: isSelected ? '0 0 12px rgba(255,230,0,0.4)' : 'none'
                }}>
                  {costume.perk}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
