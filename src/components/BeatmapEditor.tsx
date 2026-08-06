import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, Play, Music, Sparkles, AlertCircle } from 'lucide-react';
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

      // Pass the uploaded audio buffer to AudioEngine so trial gameplay plays user's exact song!
      audioEngine.setCustomAudioBuffer(decodedBuf);

      // Auto capture notes
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
      // Re-set custom audio buffer to be 100% sure
      audioEngine.setCustomAudioBuffer(audioBuffer);
      const notes = audioEngine.detectBeatsFromBuffer(audioBuffer, difficulty);
      setGeneratedNotes(notes);
      setIsAnalyzing(false);
    }, 200);
  };

  const handleStartPlay = () => {
    if (generatedNotes.length === 0) return;

    // Ensure AudioEngine holds user's custom song buffer!
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
      backgroundColor: 'rgba(7, 8, 20, 0.9)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '2rem'
    }}>
      <div className="cyber-panel" style={{
        width: '820px',
        maxWidth: '95vw',
        padding: '2.2rem',
        position: 'relative',
        border: '2px solid #ffe600',
        boxShadow: '0 0 35px rgba(255, 230, 0, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            // Clear custom audio on close if user returns to main
            audioEngine.clearCustomAudioBuffer();
            onClose();
          }}
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
          fontSize: '2.2rem',
          fontFamily: 'Chakra Petch, sans-serif',
          fontWeight: 900,
          color: '#ffe600',
          marginBottom: '0.4rem',
          textShadow: '0 0 15px rgba(255,230,0,0.6)'
        }}>
          ⚡ A+B 智慧譜面創作者 (BEAT PRODUCER)
        </h2>
        <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '1.8rem' }}>
          上傳您最喜愛的 MP3 歌曲，AI 演算法自動抓拍並生成專屬音遊譜面！
        </p>

        {/* Upload Audio File Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #00f0ff',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            marginBottom: '1.5rem',
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Upload size={38} color="#00f0ff" />
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
              {audioFile ? `已選擇音樂: ${audioFile.name}` : '點擊或拖曳上傳 MP3 / WAV 歌曲檔'}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>
              支援所有主流音訊格式，系統將自動解析節奏並配對選民音符
            </p>
          </div>
        </div>

        {/* Song Info & Difficulty Settings */}
        {audioBuffer && (
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#ffe600', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music size={18} /> 歌曲名稱 (TITLE):
              </span>
              <input
                type="text"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '4px 12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  width: '280px',
                  textAlign: 'right'
                }}
              />
            </div>

            {/* Difficulty Pills Switch */}
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <span style={{ color: '#aaa', fontWeight: 800, fontSize: '0.9rem' }}>抓拍密度 (DIFFICULTY):</span>
              {(['Easy', 'Normal', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    background: difficulty === diff ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                    color: difficulty === diff ? '#000' : '#fff',
                    border: difficulty === diff ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {diff} Mode
                </button>
              ))}

              <button
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                style={{
                  background: 'rgba(255, 0, 127, 0.3)',
                  border: '1px solid #ff007f',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.55rem 1rem',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Wand2 size={16} /> 重新抓拍
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
              borderRadius: '12px',
              padding: '0.8rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>抓拍音符總數: </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffe600' }}>{generatedNotes.length} 個 Note</span>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>音訊時長: </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00f0ff' }}>
                  {audioBuffer ? `${Math.floor(audioBuffer.duration)} 秒` : '--'}
                </span>
              </div>
            </div>

            <button
              className="muse-btn"
              onClick={handleStartPlay}
              style={{ width: '100%', fontSize: '1.5rem', padding: '1.1rem' }}
            >
              <span><Play fill="#fff" size={26} /> ▶ 試玩自製譜面 (PLAY MAP - 使用上傳曲目)</span>
            </button>
          </div>
        )}

        {/* Info Hint */}
        {!audioBuffer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
            <AlertCircle size={16} />
            <span>請上傳音樂檔案解鎖 ▶ 試玩自製譜面功能</span>
          </div>
        )}
      </div>
    </div>
  );
};
