import React, { useState, useEffect, useRef } from 'react';
import { GameState, BeatmapData, CostumeId, GameStats } from './types/game';
import { DEFAULT_BEATMAPS } from './game/Beatmaps';
import { SONG_REGISTRY, SongData } from './game/SongRegistry';
import { RenderEngine } from './game/RenderEngine';
import { GameLoop } from './game/GameLoop';
import { audioEngine } from './game/AudioEngine';

import { StartScreen } from './components/StartScreen';
import { CostumeModal } from './components/CostumeModal';
import { BeatmapEditor } from './components/BeatmapEditor';
import { HUDOverlay } from './components/HUDOverlay';
import { PauseModal } from './components/PauseModal';
import { ResultScreen } from './components/ResultScreen';
import { LandscapePrompt } from './components/LandscapePrompt';
import { SongSelectModal } from './components/SongSelectModal';
import { TutorialOverlay } from './components/TutorialOverlay';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSongSelect, setShowSongSelect] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  const [currentSong, setCurrentSong] = useState<SongData>(SONG_REGISTRY[0]);
  const [currentDifficulty, setCurrentDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [currentNoteSpeed, setCurrentNoteSpeed] = useState<number>(1.0);
  const [selectedCostume, setSelectedCostume] = useState<CostumeId>('campaign_vest');

  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    supportRate: 100,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    greatCount: 0,
    missCount: 0,
    feverGauge: 0,
    isFeverActive: false,
    totalNotesCount: 0
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);

  useEffect(() => {
    audioEngine.loadDefaultBGM();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-Pause when switching apps, leaving tab, or locking screen (visibilitychange & blur)
  useEffect(() => {
    const triggerAutoPause = () => {
      if (gameState === 'playing' && !isPaused && gameLoopRef.current) {
        gameLoopRef.current.pause();
        setIsPaused(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerAutoPause();
      }
    };

    const handleBlur = () => {
      triggerAutoPause();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, isPaused]);

  const handleStartGame = (
    song: SongData,
    difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal',
    noteSpeed: number = 1.0
  ) => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      gameLoopRef.current = null;
    }

    // Force Reset Game Stats to Initial Fresh Values (Score = 0, SupportRate = 100%)
    const freshStats: GameStats = {
      score: 0,
      supportRate: 100,
      combo: 0,
      maxCombo: 0,
      perfectCount: 0,
      greatCount: 0,
      missCount: 0,
      feverGauge: 0,
      isFeverActive: false,
      totalNotesCount: 0
    };
    setGameStats(freshStats);

    setCurrentSong(song);
    setCurrentDifficulty(difficulty);
    setCurrentNoteSpeed(noteSpeed);
    setIsPaused(false);
    setShowSongSelect(false);
    setGameState('playing');

    const activeMap: BeatmapData = {
      ...DEFAULT_BEATMAPS[0],
      metadata: {
        ...DEFAULT_BEATMAPS[0].metadata,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm
      }
    };

    setTimeout(() => {
      if (canvasRef.current) {
        const renderEngine = new RenderEngine(canvasRef.current);
        renderEngine.resize(window.innerWidth, window.innerHeight);
        renderEngine.setSongBgImage(song.bg); // Dynamic MP4 Video or Image Background!

        const loop = new GameLoop(
          renderEngine,
          activeMap,
          selectedCostume,
          difficulty,
          noteSpeed,
          stats => setGameStats({ ...stats }),
          finalStats => {
            setGameStats({ ...finalStats });
            setGameState('result');
          }
        );
        gameLoopRef.current = loop;
        loop.start();
      }
    }, 100);
  };

  const handleTogglePause = () => {
    if (gameState !== 'playing' || !gameLoopRef.current) return;
    if (isPaused) {
      gameLoopRef.current.resume();
      setIsPaused(false);
    } else {
      gameLoopRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        handleTogglePause();
        return;
      }

      if (gameState !== 'playing' || isPaused || !gameLoopRef.current) return;

      const key = e.key.toLowerCase();
      if (key === 'd' || key === 'f') {
        gameLoopRef.current.triggerKeyInput('air');
      } else if (key === 'j' || key === 'k') {
        gameLoopRef.current.triggerKeyInput('ground');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Mobile Landscape Orientation Prompt */}
      <LandscapePrompt />

      {/* 1. START SCREEN */}
      {gameState === 'menu' && (
        <StartScreen
          currentSong={currentSong}
          selectedCostume={selectedCostume}
          onStartGame={(song, diff, speed) => handleStartGame(song, diff, speed)}
          onOpenSongSelect={() => setShowSongSelect(true)}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenCostumes={() => setGameState('costumes')}
          onOpenEditor={() => setGameState('editor')}
        />
      )}

      {/* 2. SONG SELECTION HALL MODAL */}
      {showSongSelect && (
        <SongSelectModal
          currentSongId={currentSong.id}
          currentDifficulty={currentDifficulty}
          currentSpeed={currentNoteSpeed}
          onSelectSong={(song, diff, speed) => {
            setCurrentSong(song);
            setCurrentDifficulty(diff);
            setCurrentNoteSpeed(speed);
            setShowSongSelect(false);
          }}
          onClose={() => setShowSongSelect(false)}
        />
      )}

      {/* 3. TUTORIAL OVERLAY MODAL */}
      {showTutorial && (
        <TutorialOverlay
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* 4. COSTUME MODAL */}
      {gameState === 'costumes' && (
        <CostumeModal
          selectedCostume={selectedCostume}
          onSelectCostume={id => setSelectedCostume(id)}
          onClose={() => setGameState('menu')}
        />
      )}

      {/* 5. BEATMAP EDITOR MODAL */}
      {gameState === 'editor' && (
        <BeatmapEditor
          onClose={() => setGameState('menu')}
          onPlayCustomMap={customMap => {
            const customSong: SongData = {
              id: 'custom',
              title: customMap.metadata.title,
              subtitle: '玩家自製 A+B 譜面',
              artist: customMap.metadata.artist,
              bpm: customMap.metadata.bpm,
              duration: 180,
              cover: '/assets/yoaka_kpop.png',
              bg: '/cyber_runway_bg.png',
              audio: '/assets/audio/street_campaign_vocal.mp3',
              storyStage: '合',
              isRhapsody: true,
              storyContext: '【A+B 自製譜面】玩家上傳音檔與 AI 自動抓拍譜面！',
              difficultyRating: { Easy: 3, Normal: 4, Hard: 5 }
            };
            handleStartGame(customSong, 'Normal', 1.0);
          }}
        />
      )}

      {/* 6. CANVAS RHYTHM GAMEPLAY */}
      <canvas
        ref={canvasRef}
        style={{
          display: gameState === 'playing' || gameState === 'result' ? 'block' : 'none',
          width: '100%',
          height: '100%'
        }}
      />

      {/* 7. HUD OVERLAY */}
      {gameState === 'playing' && (
        <HUDOverlay
          stats={gameStats}
          costume={selectedCostume}
          onAirPress={() => gameLoopRef.current?.triggerKeyInput('air')}
          onGroundPress={() => gameLoopRef.current?.triggerKeyInput('ground')}
          onPause={handleTogglePause}
        />
      )}

      {/* 8. PAUSE MODAL */}
      {isPaused && (
        <PauseModal
          stats={gameStats}
          beatmapTitle={`${currentSong.title} (${currentDifficulty})`}
          onResume={handleTogglePause}
          onRestart={() => handleStartGame(currentSong, currentDifficulty, currentNoteSpeed)}
          onHome={() => {
            if (gameLoopRef.current) gameLoopRef.current.stop();
            setIsPaused(false);
            setGameState('menu');
          }}
        />
      )}

      {/* 9. RESULT SCREEN */}
      {gameState === 'result' && (
        <ResultScreen
          stats={gameStats}
          beatmapTitle={`${currentSong.title} (${currentDifficulty})`}
          onReplay={() => handleStartGame(currentSong, currentDifficulty, currentNoteSpeed)}
          onHome={() => {
            if (gameLoopRef.current) gameLoopRef.current.stop();
            setGameState('menu');
          }}
        />
      )}
    </div>
  );
};
