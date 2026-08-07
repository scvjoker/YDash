import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Play, Wand2, Trash2, ArrowDown, Maximize, Zap, Disc, Download, Music, AlertCircle } from 'lucide-react';
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
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [decodedBuffer, setDecodedBuffer] = useState<AudioBuffer | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Playback & Live Tap Recording State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isTapRecording, setIsTapRecording] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Handler
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

          const autoNotes = audioEngine.detectBeatsFromBuffer(decoded, difficulty);
          setNotes(autoNotes);
          setIsAnalyzing(false);
        } catch {
          setIsAnalyzing(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Step A: Auto AI Beat Detection with Selected Density Difficulty
  const handleReDetectBeats = (targetDiff: 'Easy' | 'Normal' | 'Hard' = difficulty) => {
    const activeBuf = decodedBuffer || audioEngine['bgmBuffer'];
    if (!activeBuf) {
      alert('請先點擊上傳 MP3 / WAV 音樂檔！');
      return;
    }
    setIsAnalyzing(true);
    setDifficulty(targetDiff);
    setTimeout(() => {
      const autoNotes = audioEngine.detectBeatsFromBuffer(activeBuf, targetDiff);
      setNotes(autoNotes);
      setIsAnalyzing(false);
    }, 150);
  };

  // Step B: Live Tap Recording Mode Toggle
  const handleToggleTapRecord = () => {
    if (isTapRecording) {
      setIsTapRecording(false);
      setIsPlayingPreview(false);
      audioEngine.stopBGM();
    } else {
      const activeBuf = decodedBuffer || audioEngine['bgmBuffer'];
      if (!activeBuf) {
        alert('請先點擊上傳 MP3 / WAV 音樂檔以進行打拍錄製！');
        return;
      }
      setIsTapRecording(true);
      setIsPlayingPreview(true);
      audioEngine.playBGM(0);
    }
  };

  // Keyboard Tap Listener for Live Recording Mode (D/F for Air, J/K for Ground)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTapRecording || !isPlayingPreview) return;

      const key = e.key.toLowerCase();
      const timeSec = parseFloat(audioEngine.getHardwareTime().toFixed(3));

      if (key === 'd' || key === 'f') {
        // Air Note
        const newNote: Note = {
          id: `tap_air_${Date.now()}_${Math.random()}`,
          time: timeSec,
          track: 'air',
          type: 'voter',
          entity: 'voter_student'
        };
        setNotes(prev => [...prev, newNote].sort((a, b) => a.time - b.time));
        audioEngine.playSFX('perfect');
      } else if (key === 'j' || key === 'k') {
        // Ground Note
        const newNote: Note = {
          id: `tap_ground_${Date.now()}_${Math.random()}`,
          time: timeSec,
          track: 'ground',
          type: 'voter',
          entity: 'voter_office'
        };
        setNotes(prev => [...prev, newNote].sort((a, b) => a.time - b.time));
        audioEngine.playSFX('great');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTapRecording, isPlayingPreview]);

  // Export JSON Beatmap File
  const handleExportJSON = () => {
    if (notes.length === 0) {
      alert('尚無音符資料可供匯出！');
      return;
    }

    const exportData: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: 'Yoaka Community Beatmaker',
        bpm,
        offset: 0,
        difficulty,
        coverColor: '#ffe600'
      },
      notes
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${songTitle}_beatmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
      setIsTapRecording(false);
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
      setIsTapRecording(false);
    }

    const customMap: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: '自訂上傳創作者',
        bpm,
        offset: 0,
        difficulty,
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
        width: '900px',
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
              fontSize: '1.75rem',
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
            {/* Export JSON Button */}
            <button
              onClick={handleExportJSON}
              disabled={notes.length === 0}
              style={{
                background: notes.length > 0 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                border: notes.length > 0 ? '1.5px solid #00f0ff' : '1px solid rgba(255,255,255,0.2)',
                color: notes.length > 0 ? '#00f0ff' : '#888',
                borderRadius: '16px',
                padding: '4px 12px',
                fontWeight: 900,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: notes.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              <Download size={14} /> 📥 匯出 JSON 譜面
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreen}
              style={{
                background: 'rgba(255, 230, 0, 0.15)',
                border: '1.5px solid #ffe600',
                color: '#ffe600',
                borderRadius: '16px',
                padding: '4px 12px',
                fontWeight: 900,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
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
                cursor: 'pointer'
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
          gap: '0.9rem'
        }}>
          {/* File Upload Box */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '2px dashed #ffe600',
            borderRadius: '14px',
            padding: '0.8rem',
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

          {/* STEP A & STEP B Creation Control Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            {/* Step A: AI Auto Beat Detection with Difficulty Density Pills */}
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#00f0ff', fontWeight: 900 }}>
                  Step A: AI 自動波峰抓拍 (抓拍密度)
                </span>
                <button
                  onClick={() => handleReDetectBeats(difficulty)}
                  style={{
                    background: '#00f0ff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ 一鍵抓拍
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => handleReDetectBeats(diff)}
                    style={{
                      flex: 1,
                      padding: '4px',
                      background: difficulty === diff ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                      color: difficulty === diff ? '#000' : '#fff',
                      border: difficulty === diff ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      fontWeight: 900,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Step B: Live Keyboard Tap Recording */}
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #ff007f', borderRadius: '12px', padding: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#ff007f', fontWeight: 900 }}>
                  Step B: 手動 Tap 鍵盤錄製 (D/F/J/K)
                </span>
              </div>

              <button
                onClick={handleToggleTapRecord}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: isTapRecording ? '#ff007f' : 'rgba(255, 0, 127, 0.15)',
                  color: '#fff',
                  border: '1.5px solid #ff007f',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: isTapRecording ? '0 0 16px rgba(255, 0, 127, 0.6)' : 'none'
                }}
              >
                <Disc size={16} className={isTapRecording ? 'spin-anim' : ''} />
                {isTapRecording ? '🔴 Tap 錄製中！請按 D/F/J/K 鍵打拍' : '🎙️ 開啟手動 Tap 鍵盤即時錄製'}
              </button>
            </div>
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
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
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
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  marginTop: '2px'
                }}
              />
            </div>
          </div>

          {/* Music Playback & Manual Add Note Bar */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid #00f0ff',
            borderRadius: '12px',
            padding: '0.7rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <button
              className={isPlayingPreview ? 'muse-btn muse-btn-yellow' : 'muse-btn'}
              onClick={handleTogglePreview}
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
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
                📍 已生成譜面點位 (共 {notes.length} 個音符 Note):
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              minHeight: '55px',
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
