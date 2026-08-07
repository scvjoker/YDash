import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Play, Wand2, Trash2, ArrowDown, Maximize, Zap } from 'lucide-react';
import { BeatmapData, Note } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface BeatmapEditorProps {
  onClose: () => void;
  onPlayCustomMap: (beatmap: BeatmapData) => void;
}

export const BeatmapEditor: React.FC<BeatmapEditorProps> = ({
  onClose,
  onPlayCustomMap
}) => {
  const [songTitle, setSongTitle] = useState<string>('我的自訂創作曲');
  const [bpm, setBpm] = useState<number>(130);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [decodedBuffer, setDecodedBuffer] = useState<AudioBuffer | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const arrayBuffer = evt.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const tempCtx = new AudioCtx();
        if (tempCtx.state === 'suspended') {
          await tempCtx.resume();
        }

        try {
          const decoded = await tempCtx.decodeAudioData(arrayBuffer);
          setDecodedBuffer(decoded);
          audioEngine.setCustomAudioBuffer(decoded);

          const autoNotes = audioEngine.detectBeatsFromBuffer(decoded, 'Normal');
          setNotes(autoNotes);
          setIsAnalyzing(false);
        } catch {
          setIsAnalyzing(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleReDetectBeats = () => {
    const activeBuf = decodedBuffer || audioEngine['bgmBuffer'];
    if (!activeBuf) {
      alert('請先上傳 MP3 音樂檔！');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const autoNotes = audioEngine.detectBeatsFromBuffer(activeBuf, 'Normal');
      setNotes(autoNotes);
      setIsAnalyzing(false);
    }, 150);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTogglePreview = () => {
    if (isPlayingPreview) {
      audioEngine.stopBGM();
      setIsPlayingPreview(false);
    } else {
      audioEngine.playBGM(0);
      setIsPlayingPreview(true);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlayingPreview) {
      interval = setInterval(() => {
        setCurrentTime(audioEngine.getHardwareTime());
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  const handleAddNote = (track: 'air' | 'ground', type: 'voter' | 'obstacle') => {
    const timeSec = parseFloat(currentTime.toFixed(3));
    const newNote: Note = {
      id: `custom_${Date.now()}_${Math.random()}`,
      time: timeSec,
      track,
      type,
      entity: type === 'obstacle' ? 'hater_dog_board' : track === 'air' ? 'voter_student' : 'voter_office'
    };
    setNotes(prev => [...prev, newNote].sort((a, b) => a.time - b.time));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handlePlayMap = () => {
    if (isPlayingPreview) {
      audioEngine.stopBGM();
      setIsPlayingPreview(false);
    }

    const customMap: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: '自訂上傳創作者',
        bpm,
        offset: 0,
        difficulty: 'Normal',
        coverColor: '#ffe600'
      },
      notes
    };
    onPlayCustomMap(customMap);
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
      zIndex: 50,
      padding: '0.8rem'
    }}>
      <div className="cyber-panel" style={{
        width: '880px',
        maxWidth: '96vw',
        height: '92vh',
        maxHeight: '92vh',
        padding: '1.4rem 1.8rem',
        position: 'relative',
        border: '2px solid #ffe600',
        boxShadow: '0 0 35px rgba(255, 230, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 12px rgba(255,230,0,0.6)',
              margin: 0
            }}>
              Wand2 A+B 譜面創作者 (BEAT PRODUCER)
            </h2>

            <div style={{
              background: 'rgba(255, 230, 0, 0.12)',
              border: '1.5px solid rgba(255, 230, 0, 0.4)',
              color: '#ffe600',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowDown size={14} /> ↕️ 可上下滑動完整編輯
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreen}
              style={{
                background: 'rgba(255, 230, 0, 0.15)',
                border: '1.5px solid #ffe600',
                color: '#ffe600',
                borderRadius: '16px',
                padding: '4px 12px',
                fontFamily: 'Chakra Petch, sans-serif',
                fontWeight: 900,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(255,230,0,0.4)'
              }}
            >
              <Maximize size={14} /> 全螢幕
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
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
                boxShadow: '0 0 12px rgba(255, 0, 127, 0.5)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* File Upload Box & Re-Detect Button */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.8rem' }}>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '2px dashed #ffe600',
              borderRadius: '14px',
              padding: '0.9rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <Upload size={28} color="#ffe600" style={{ margin: '0 auto 4px auto' }} />

              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '2px' }}>
                {audioFile ? `🎵 ${audioFile.name}` : '點擊上傳 MP3 / WAV 樂曲檔'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#aaa', margin: 0 }}>
                {isAnalyzing ? '⚡ AI 波形節奏抓拍分析中...' : 'Web Audio API 即時波峰抓拍，自動生成節奏譜面！'}
              </p>
            </div>

            {/* Explicit AI Re-Detect Beats Button */}
            <button
              onClick={handleReDetectBeats}
              style={{
                background: 'rgba(255, 230, 0, 0.15)',
                border: '2px solid #ffe600',
                borderRadius: '14px',
                color: '#ffe600',
                fontWeight: 900,
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(255, 230, 0, 0.3)'
              }}
            >
              <Zap size={24} color="#ffe600" />
              ⚡ 點擊 AI 自動抓拍譜面
            </button>
          </div>

          {/* Song Info Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 700 }}>樂曲標題:</label>
              <input
                type="text"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffe600',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  marginTop: '2px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 700 }}>BPM 節奏:</label>
              <input
                type="number"
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#00f0ff',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  marginTop: '2px'
                }}
              />
            </div>
          </div>

          {/* Music Playback & Quick Add Note Bar */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid #00f0ff',
            borderRadius: '12px',
            padding: '0.8rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <button
              className={isPlayingPreview ? 'muse-btn muse-btn-yellow' : 'muse-btn'}
              onClick={handleTogglePreview}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <span>{isPlayingPreview ? '⏸ 暫停試聽' : '▶ 播放音樂'}</span>
            </button>

            <span style={{ fontSize: '1rem', fontFamily: 'Chakra Petch, sans-serif', color: '#ffe600', fontWeight: 900 }}>
              時間: {currentTime.toFixed(2)}s
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleAddNote('air', 'voter')}
                style={{
                  background: '#00f0ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                + 上軌音符
              </button>

              <button
                onClick={() => handleAddNote('ground', 'voter')}
                style={{
                  background: '#ff007f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                + 下軌音符
              </button>
            </div>
          </div>

          {/* Notes List & Timeline Preview */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '12px',
            padding: '0.8rem 1rem',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 800 }}>
                譜面音符點位 (已抓拍 {notes.length} 個音符):
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              minHeight: '60px',
              alignItems: 'center'
            }}>
              {notes.map(note => (
                <div
                  key={note.id}
                  style={{
                    flexShrink: 0,
                    background: note.type === 'obstacle' ? 'rgba(255,0,85,0.2)' : note.track === 'air' ? 'rgba(0,240,255,0.2)' : 'rgba(255,0,127,0.2)',
                    border: `1px solid ${note.type === 'obstacle' ? '#ff0055' : note.track === 'air' ? '#00f0ff' : '#ff007f'}`,
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <span style={{ fontWeight: 900, color: note.track === 'air' ? '#00f0ff' : '#ff007f' }}>
                    {note.track === 'air' ? '☁️ 上' : '🏃 下'}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{note.time.toFixed(2)}s</div>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff0055',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Play Map Action Footer */}
        <div style={{ paddingTop: '0.8rem', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            className="muse-btn"
            onClick={handlePlayMap}
            style={{ width: '100%', fontSize: '1.25rem', padding: '0.85rem' }}
          >
            <span>▶ 試玩自製譜面 (PLAY CUSTOM MAP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
