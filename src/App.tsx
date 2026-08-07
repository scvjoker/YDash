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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  
  // Dynamic Aspect-Ratio Responsive Size (Solution 4)
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });

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
  const innerShellRef = useRef<HTMLDivElement | null>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);

  useEffect(() => {
    audioEngine.loadDefaultBGM();

    // Solution 3: Nudge Trick (window.scrollTo(0,1)) on first TouchStart to collapse Safari address bar
    const handleTouchNudge = () => {
      window.scrollTo(0, 1);
    };
    window.addEventListener('touchstart', handleTouchNudge, { once: true });
    return () => window.removeEventListener('touchstart', handleTouchNudge);
  }, []);

  // Solution 1 & Solution 4: 100svh + 16:9 Aspect Ratio Dynamic Calculator
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const calculateResponsiveLayout = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const targetRatio = 16 / 9;

      let calcWidth = windowWidth;
      let calcHeight = windowWidth / targetRatio;

      if (calcHeight > windowHeight) {
        calcHeight = windowHeight;
        calcWidth = windowHeight * targetRatio;
      }

      setContainerDimensions({
        width: Math.floor(calcWidth),
        height: Math.floor(calcHeight)
      });

      if (canvasRef.current) {
        canvasRef.current.width = Math.floor(calcWidth);
        canvasRef.current.height = Math.floor(calcHeight);
      }
    };

    calculateResponsiveLayout();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', calculateResponsiveLayout);
    
    // Additional delay timer for mobile orientation & Safari bar collapse transitions
    const timerId = setTimeout(calculateResponsiveLayout, 250);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', calculateResponsiveLayout);
    };
  }, [isFullscreen]);

  // Auto-Pause when switching apps or leaving tab
  useEffect(() => {
    const triggerAutoPause = () => {
      if (gameState === 'playing' && !isPaused && gameLoopRef.current) {
        gameLoopRef.current.pause();
        setIsPaused(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) triggerAutoPause();
    };

    const handleBlur = () => triggerAutoPause();

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
      if (canvasRef.current && innerShellRef.current) {
        const w = containerDimensions.width;
        const h = containerDimensions.height;

        canvasRef.current.width = w;
        canvasRef.current.height = h;

        const renderEngine = new RenderEngine(canvasRef.current);
        renderEngine.resize(w, h);
        renderEngine.setSongBgImage(song.bg);

        const loop = new GameLoop(
          renderEngine,
          activeMap,
          selectedCostume,
          difficulty,
          noteSpeed,
          song,
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
    <div style={{
      width: '100vw',
      height: '100svh', // Solution 1: 100svh (Small Viewport Height) to prevent Safari toolbar jump
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#050712',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Safe Area Protection
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
      boxSizing: 'border-box'
    }}>
      {/* Solution 4: Dynamic 16:9 Aspect Ratio Safe Zone Canvas Shell */}
      <div
        ref={innerShellRef}
        style={{
          width: isFullscreen ? '100%' : `${containerDimensions.width}px`,
          height: isFullscreen ? '100%' : `${containerDimensions.height}px`,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#070814',
          boxShadow: isFullscreen ? 'none' : '0 0 35px rgba(0, 240, 255, 0.4)',
          borderRadius: isFullscreen ? '0px' : '14px',
          border: isFullscreen ? 'none' : '2px solid #00f0ff',
          transition: 'all 0.25s ease-out'
        }}
      >
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
    </div>
  );
};
