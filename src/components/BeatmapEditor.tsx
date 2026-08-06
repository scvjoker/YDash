import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, Disc, Download, Play } from 'lucide-react';
import { BeatmapData, Note } from '../types/game';
import { audioEngine } from '../game/AudioEngine';

interface BeatmapEditorProps {
  onClose: () => void;
  onPlayCustomMap: (beatmap: BeatmapData) => void;
}

export const BeatmapEditor: React.FC<BeatmapEditorProps> = ({ onClose, onPlayCustomMap }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [songTitle, setSongTitle] = useState<string>('自訂拜票戰歌');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step A: Web Audio FFT Beat Detection
  const handleAutoDetect = () => {
    if (!audioBuffer) return;
    const detected = audioEngine.detectBeatsFromBuffer(audioBuffer);
    const newNotes: Note[] = detected.map((item, index) => ({
      id: `custom_${index}`,
      time: item.time,
      track: item.track,
      type: 'voter',
      entity: item.track === 'air' ? 'voter_cloud' : 'voter_office'
    }));
    setNotes(newNotes);
  };

  // Step B: Live Tap Recording Mode (Press D for Air, F for Ground while playing BGM)
  const handleStartRecord = () => {
    if (!audioBuffer) return;
    setIsRecording(true);
    setNotes([]);
    audioEngine.playBGM(0);

    const timer = setInterval(() => {
      const t = audioEngine.getHardwareTime();
      setRecordingTime(t);
      if (t >= audioBuffer.duration) {
        clearInterval(timer);
        setIsRecording(false);
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording) return;
    const t = audioEngine.getHardwareTime();
    let track: 'air' | 'ground' | null = null;

    if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'f') track = 'air';
    if (e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'k') track = 'ground';

    if (track) {
      const newNote: Note = {
        id: `tap_${Date.now()}`,
        time: parseFloat(t.toFixed(2)),
        track,
        type: 'voter',
        entity: track === 'air' ? 'voter_cloud' : 'voter_office'
      };
      setNotes(prev => [...prev, newNote]);
      audioEngine.playSFX('perfect');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const customMap: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: 'Yoaka Custom Producer',
        bpm: 135,
        offset: 0,
        difficulty: 'Custom',
        coverColor: '#ffe600'
      },
      notes
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customMap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${songTitle}_beatmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePlayNow = () => {
    const customMap: BeatmapData = {
      metadata: {
        id: `custom_${Date.now()}`,
        title: songTitle,
        artist: 'Yoaka Custom',
        bpm: 135,
        offset: 0,
        difficulty: 'Custom',
        coverColor: '#00f0ff'
      },
      notes
    };
    onPlayCustomMap(customMap);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
    const buf = await audioEngine.loadAudioFile(file);
    setAudioBuffer(buf);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 6, 15, 0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '2rem'
      }}
    >
      <div className="cyber-panel" style={{ width: '900px', maxWidth: '95vw', padding: '2rem', position: 'relative' }}>
        <button
          onClick={() => {
            audioEngine.stopBGM();
            onClose();
          }}
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

        <h2 style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#ffe600', marginBottom: '0.4rem' }}>
          🎹 A + B 混合譜面創作者 (Beatmap Producer)
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          匯入自訂 MP3，使用 <b>A-Web Audio 自動拍點檢測</b> 或 <b>B-實時 Tap 按鍵錄製</b>，快速產出 Muse Dash 絕佳打擊譜面！
        </p>

        {/* Audio File Drag & Drop Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed rgba(0, 240, 255, 0.4)',
            background: 'rgba(0, 240, 255, 0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'all 0.2s'
          }}
        >
          <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          <Upload size={36} color="#00f0ff" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
            {audioFile ? `🎵 已載入音訊：${audioFile.name}` : '點擊或拖放上傳外部 MP3 / WAV 競選歌曲'}
          </p>
        </div>

        {/* Controls Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Step A Button */}
          <button
            className="muse-btn muse-btn-cyan"
            disabled={!audioBuffer}
            onClick={handleAutoDetect}
            style={{ opacity: audioBuffer ? 1 : 0.4, fontSize: '1rem' }}
          >
            <span><Wand2 size={20} /> Step A: 一鍵自動頻譜 Peak 檢測</span>
          </button>

          {/* Step B Button */}
          <button
            className="muse-btn"
            disabled={!audioBuffer}
            onClick={handleStartRecord}
            style={{ opacity: audioBuffer ? 1 : 0.4, fontSize: '1rem' }}
          >
            <span><Disc size={20} /> {isRecording ? `錄製中 (${recordingTime.toFixed(1)}s)...` : 'Step B: 按鍵 Tap 錄製'}</span>
          </button>
        </div>

        {/* Timeline Notes Waveform Box */}
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem', height: '140px', overflowY: 'auto', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.5rem' }}>
            📍 已生成音符數量：{notes.length} 個 Notes
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {notes.map((n, i) => (
              <span
                key={i}
                style={{
                  background: n.track === 'air' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 0, 127, 0.2)',
                  border: `1px solid ${n.track === 'air' ? '#00f0ff' : '#ff007f'}`,
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {n.time}s ({n.track})
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="muse-btn muse-btn-yellow" disabled={notes.length === 0} onClick={handleExportJSON}>
            <span><Download size={20} /> 匯出 JSON 譜面</span>
          </button>

          <button className="muse-btn" disabled={notes.length === 0} onClick={handlePlayNow}>
            <span><Play size={20} fill="#fff" /> 立即試玩自訂譜面</span>
          </button>
        </div>
      </div>
    </div>
  );
};
