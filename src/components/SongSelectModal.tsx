import React, { useState } from 'react';
import { X, Play, Music, Sparkles, Wand2, Disc } from 'lucide-react';
import { SongTrackData, BUILTIN_SONGS } from '../game/SongRegistry';

interface SongSelectModalProps {
  onSelectSong: (song: SongTrackData) => void;
  onClose: () => void;
  onOpenEditor: () => void;
}

export const SongSelectModal: React.FC<SongSelectModalProps> = ({
  onSelectSong,
  onClose,
  onOpenEditor
}) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(BUILTIN_SONGS[1].id);

  const activeSong = BUILTIN_SONGS.find(s => s.id === selectedSongId) || BUILTIN_SONGS[1];

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
      padding: '1rem'
    }}>
      <div className="cyber-panel" style={{
        width: '980px',
        maxWidth: '96vw',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '1.6rem 2.2rem',
        position: 'relative',
        border: '2px solid #ffe600',
        boxShadow: '0 0 35px rgba(255, 230, 0, 0.4)'
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
            width: '40px',
            height: '40px',
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

        {/* Modal Title */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            color: '#ffe600',
            textShadow: '0 0 12px rgba(255,230,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Music size={28} color="#00f0ff" /> 競選拜票戰歌選單 (SONG SELECT CAROUSEL)
          </h2>
          <p style={{ color: '#aaa', fontSize: '0.92rem', marginTop: '2px' }}>
            挑選最激昂熱血的競選曲目，或上傳 MP3 誕生專屬獨立譜面！
          </p>
        </div>

        {/* Song Cards Grid Carousel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.2rem',
          marginBottom: '1.5rem'
        }}>
          {BUILTIN_SONGS.map(song => {
            const isSelected = song.id === selectedSongId;

            return (
              <div
                key={song.id}
                onClick={() => setSelectedSongId(song.id)}
                style={{
                  background: isSelected ? 'rgba(20, 25, 55, 0.95)' : 'rgba(12, 15, 32, 0.65)',
                  border: isSelected ? '2.5px solid #ffe600' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '18px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: isSelected ? '0 0 25px rgba(255,230,0,0.45)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Song Cover Header */}
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '0.8rem',
                    background: '#07091e',
                    position: 'relative'
                  }}>
                    <img
                      src={song.coverImg}
                      alt={song.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {song.isTutorial && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: '#ffe600',
                        color: '#000',
                        fontWeight: 900,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem'
                      }}>
                        🎓 新手培訓
                      </span>
                    )}
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.75)',
                      color: '#00f0ff',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}>
                      BPM: {song.bpm}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: isSelected ? '#ffe600' : '#fff', marginBottom: '2px' }}>
                    {song.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {song.subtitle}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.4, height: '40px', overflow: 'hidden' }}>
                    {song.description}
                  </p>
                </div>

                <button
                  className={isSelected ? 'muse-btn' : 'muse-btn muse-btn-cyan'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSong(song);
                  }}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    fontSize: '0.9rem',
                    padding: '0.65rem',
                    background: isSelected ? '#ffe600' : undefined,
                    color: isSelected ? '#000' : undefined
                  }}
                >
                  <span><Play size={16} fill={isSelected ? '#000' : '#fff'} /> {isSelected ? '▶ 立即出戰拜票' : '選擇此曲'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Upload Shortcut Entry */}
        <div className="cyber-panel" style={{
          padding: '1.1rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,0,127,0.1)',
          border: '1.5px solid #ff007f'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ff007f', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wand2 size={18} /> 想挑戰您自己的音樂庫嗎？
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '2px' }}>
              點擊前往【A+B 譜面創作者】，上傳您的 MP3/WAV，Web Audio AI 即時抓拍獨家譜面！
            </p>
          </div>

          <button
            className="muse-btn muse-btn-yellow"
            onClick={onOpenEditor}
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
          >
            <span><Sparkles size={16} /> 前往上傳 MP3</span>
          </button>
        </div>
      </div>
    </div>
  );
};
