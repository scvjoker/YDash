import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, Play, Music, AlertCircle, Maximize, ArrowDown } from 'lucide-react';
import { BeatmapData, Note } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface BeatmapEditorProps {
  onClose: () => void;
  onPlayCustomMap: (map: BeatmapData) => void;
}

export const BeatmapEditor: React.FC<BeatmapEditorProps> = ({
  onClose,
  onPlayCustomMap
}) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [songTitle, setSongTitle] = useState<string>('我的自創拜票神曲');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [generatedNotes, setGeneratedNotes] = useState<Note[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsAnalyzing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const tempCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const decodedBuf = await tempCtx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedBuf);

      audioEngine.setCustomAudioBuffer(decodedBuf);

      const notes = audioEngine.detectBeatsFromBuffer(decodedBuf, difficulty);
      setGeneratedNotes(notes);
    } catch (err) {
      console.error('Audio decode failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = () => {
    if (!audioBuffer) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      audioEngine.setCustomAudioBuffer(audioBuffer);
      const notes = audioEngine.detectBeatsFromBuffer(audioBuffer, difficulty);
      setGeneratedNotes(notes);
      setIsAnalyzing(false);
    }, 200);
  };

  const handleStartPlay = () => {
    if (generatedNotes.length === 0) return;

    if (audioBuffer) {
      audioEngine.setCustomAudioBuffer(audioBuffer);
    }

    const customMap: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: '自訂譜面創作者',
        bpm: 135,
        offset: 0,
        difficulty,
        coverColor: '#00f0ff'
      },
      notes: generatedNotes
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
        width: '820px',
        maxWidth: '96vw',
        maxHeight: '96vh',
        overflowY: 'auto',
        padding: '1rem 1.4rem',
        position: 'relative',
        border: '2px solid #ffe600',
        boxShadow: '0 0 35px rgba(255, 230, 0, 0.4)'
      }}>
        {/* Top Control Action Buttons (Fullscreen & Close) */}
        <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', display: 'flex', gap: '8px', zIndex: 10 }}>
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

          <button
            onClick={() => {
              audioEngine.clearCustomAudioBuffer();
              onClose();
            }}
            style={{
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
              boxShadow: '0 0 12px rgba(255, 0, 127, 0.5)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Title Header with Scroll Hint Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              color: '#ffe600',
              textShadow: '0 0 12px rgba(255,230,0,0.6)'
            }}>
              ⚡ A+B 智慧譜面創作者 (BEAT PRODUCER)
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '2px' }}>
              上傳您最喜愛的 MP3 歌曲，AI 演算法自動抓拍並生成專屬音遊譜面！
            </p>
          </div>

          {/* Scroll Hint Badge */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            color: '#00f0ff',
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: '120px'
          }}>
            <ArrowDown size={13} /> ↕️ 上下滑動檢視
          </div>
        </div>

        {/* Upload Audio File Area (Compact for Mobile) */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #00f0ff',
            borderRadius: '14px',
            padding: '1rem 1.2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            marginBottom: '1rem',
            transition: 'all 0.25s'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Upload size={28} color="#00f0ff" />
            <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>
              {audioFile ? `已選擇音樂: ${audioFile.name}` : '點擊或拖曳上傳 MP3 / WAV 歌曲檔'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888' }}>
              支援主流音訊格式，自動解析節奏並配對選民音符
            </p>
          </div>
        </div>

        {/* Song Info & Difficulty Settings (Mobile Adaptive Layout) */}
        {audioBuffer && (
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ color: '#ffe600', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Music size={15} /> 歌曲名稱 (TITLE):
              </span>
              <input
                type="text"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '3px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  width: '220px',
                  textAlign: 'right'
                }}
              />
            </div>

            {/* Difficulty Pills Switch */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: '#aaa', fontWeight: 800, fontSize: '0.8rem' }}>抓拍密度:</span>
              {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: difficulty === diff ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                    color: difficulty === diff ? '#000' : '#fff',
                    border: difficulty === diff ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {diff}
                </button>
              ))}

              <button
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                style={{
                  background: 'rgba(255, 0, 127, 0.3)',
                  border: '1px solid #ff007f',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0.4rem 0.8rem',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Wand2 size={14} /> 重新抓拍
              </button>
            </div>
          </div>
        )}

        {/* Note Statistics & Trial Start Button */}
        {generatedNotes.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '10px',
              padding: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#aaa' }}>抓拍音符: </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffe600' }}>{generatedNotes.length} 個 Note</span>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#aaa' }}>音訊時長: </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#00f0ff' }}>
                  {audioBuffer ? `${Math.floor(audioBuffer.duration)} 秒` : '--'}
                </span>
              </div>
            </div>

            <button
              className="muse-btn"
              onClick={handleStartPlay}
              style={{ width: '100%', fontSize: '1.2rem', padding: '0.8rem' }}
            >
              <span><Play fill="#fff" size={20} /> ▶ 試玩自製譜面 (PLAY MAP - 使用上傳曲目)</span>
            </button>
          </div>
        )}

        {/* Info Hint */}
        {!audioBuffer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', color: '#888', fontSize: '0.8rem', marginTop: '0.6rem' }}>
            <AlertCircle size={14} />
            <span>請上傳音樂檔案解鎖 ▶ 試玩自製譜面功能</span>
          </div>
        )}
      </div>
    </div>
  );
};
