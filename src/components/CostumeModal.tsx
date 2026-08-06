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
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 6, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '850px',
        maxWidth: '95vw',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'rgba(255, 0, 127, 0.2)',
            border: '1px solid #ff007f',
            color: '#fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{
          fontFamily: 'Chakra Petch, sans-serif',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#00f0ff',
          marginBottom: '0.5rem'
        }}>
          👗 YOAKA 競選換裝試衣間
        </h2>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          選擇不同拜票造型，獲得專屬得票與支持度技能加成！
        </p>

        {/* Costume Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {COSTUMES_DATA.map(costume => {
            const isSelected = selectedCostume === costume.id;

            return (
              <div
                key={costume.id}
                onClick={() => onSelectCostume(costume.id)}
                style={{
                  background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `2.5px solid ${costume.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Active Badge */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: costume.accentColor,
                    color: '#000',
                    borderRadius: '50%',
                    padding: '4px'
                  }}>
                    <Check size={18} />
                  </div>
                )}

                {/* Costume Visual Icon */}
                <div style={{
                  fontSize: '3.5rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  filter: `drop-shadow(0 0 15px ${costume.accentColor})`
                }}>
                  {costume.id === 'campaign_vest' && '🎽🧢'}
                  {costume.id === 'office_glasses' && '👔👓'}
                  {costume.id === 'kpop_idol' && '👗👑'}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem' }}>
                  {costume.name}
                </h3>
                <p style={{ color: costume.accentColor, fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                  {costume.subtitle}
                </p>

                <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.4, marginBottom: '1.2rem' }}>
                  {costume.description}
                </p>

                {/* Perk Tag */}
                <div style={{
                  background: 'rgba(255, 230, 0, 0.15)',
                  border: '1px solid rgba(255, 230, 0, 0.4)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#ffe600',
                  fontWeight: 800,
                  textAlign: 'center'
                }}>
                  ✨ 技能：{costume.perk}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
