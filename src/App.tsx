import React, { useState, useEffect, useRef } from 'react';
import { GameState, BeatmapData, CostumeId, GameStats } from './types/game';
import { DEFAULT_BEATMAPS } from './game/Beatmaps';
import { SongTrackData, BUILTIN_SONGS } from './game/SongRegistry';
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
import { TutorialOverlay, TutorialPhaseInfo, TUTORIAL_PHASES_DATA } from './components/TutorialOverlay';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentBeatmap, setCurrentBeatmap] = useState<BeatmapData>(DEFAULT_BEATMAPS[0]);
  const [currentDifficulty, setCurrentDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [currentNoteSpeed, setCurrentNoteSpeed] = useState<number>(1.0);
  const [selectedCostume, setSelectedCostume] = useState<CostumeId>('campaign_vest');

  // Song Selector & Tutorial State
  const [selectedSongTrack, setSelectedSongTrack] = useState<SongTrackData>(BUILTIN_SONGS[1]);
  const [isSongSelectOpen, setIsSongSelectOpen] = useState<boolean>(false);

  const [isTutorialMode, setIsTutorialMode] = useState<boolean>(false);
  const [tutorialInfo, setTutorialInfo] = useState<TutorialPhaseInfo>({
    phase: 1,
    title: TUTORIAL_PHASES_DATA[0].title,
    instruction: TUTORIAL_PHASES_DATA[0].instruction,
    keyHint: TUTORIAL_PHASES_DATA[0].keyHint,
    targetCount: TUTORIAL_PHASES_DATA[0].targetCount,
    currentCount: 0
  });
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean>(false);

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

  // Auto-Pause when switching apps, leaving tab, or locking screen
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
    beatmap: BeatmapData,
    difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal',
    noteSpeed: number = 1.0,
    songTrack?: SongTrackData
  ) => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      gameLoopRef.current = null;
    }

    if (songTrack) {
      setSelectedSongTrack(songTrack);
    }

    setIsTutorialMode(false);
    setIsTutorialCompleted(false);

    // Force Reset Game Stats to Initial Values
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

    setCurrentBeatmap(beatmap);
    setCurrentDifficulty(difficulty);
    setCurrentNoteSpeed(noteSpeed);
    setIsPaused(false);
    setGameState('playing');

    setTimeout(() => {
      if (canvasRef.current) {
        const renderEngine = new RenderEngine(canvasRef.current);
        renderEngine.resize(window.innerWidth, window.innerHeight);

        const loop = new GameLoop(
          renderEngine,
          beatmap,
          selectedCostume,
          difficulty,
          noteSpeed,
          stats => setGameStats({ ...stats }),
          finalStats => {
            setGameStats({ ...finalStats });
            setGameState('result');
          },
          false
        );
        gameLoopRef.current = loop;
        loop.start();
      }
    }, 100);
  };

  // Start Tutorial Stage Mode (5-Phase Interactive Guide with Phase Repeat Audio)
  const handleStartTutorial = () => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      gameLoopRef.current = null;
    }

    setIsTutorialMode(true);
    setIsTutorialCompleted(false);
    setIsPaused(false);

    setGameStats({
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

    setGameState('playing');

    setTimeout(() => {
      if (canvasRef.current) {
        const renderEngine = new RenderEngine(canvasRef.current);
        renderEngine.resize(window.innerWidth, window.innerHeight);

        const loop = new GameLoop(
          renderEngine,
          DEFAULT_BEATMAPS[0],
          selectedCostume,
          'Normal',
          1.0,
          stats => setGameStats({ ...stats }),
          () => {},
          true, // isTutorialMode = true
          info => {
            setTutorialInfo(info);
            if (gameLoopRef.current?.isTutorialCompleted) {
              setIsTutorialCompleted(true);
            }
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
          onStartGame={(map, diff, speed, song) => handleStartGame(map, diff, speed, song)}
          onOpenCostumes={() => setGameState('costumes')}
          onOpenEditor={() => setGameState('editor')}
          onOpenSongSelect={() => setIsSongSelectOpen(true)}
          onStartTutorial={handleStartTutorial}
          selectedCostume={selectedCostume}
          selectedSongTrack={selectedSongTrack}
        />
      )}

      {/* 2. SONG SELECT MODAL */}
      {isSongSelectOpen && (
        <SongSelectModal
          onSelectSong={song => {
            setIsSongSelectOpen(false);
            if (song.isTutorial) {
              handleStartTutorial();
            } else {
              setSelectedSongTrack(song);
            }
          }}
          onClose={() => setIsSongSelectOpen(false)}
          onOpenEditor={() => {
            setIsSongSelectOpen(false);
            setGameState('editor');
          }}
        />
      )}

      {/* 3. COSTUME MODAL */}
      {gameState === 'costumes' && (
        <CostumeModal
          selectedCostume={selectedCostume}
          onSelectCostume={id => setSelectedCostume(id)}
          onClose={() => setGameState('menu')}
        />
      )}

      {/* 4. BEATMAP EDITOR MODAL */}
      {gameState === 'editor' && (
        <BeatmapEditor
          onClose={() => setGameState('menu')}
          onPlayCustomMap={customMap => handleStartGame(customMap, 'Normal', 1.0)}
        />
      )}

      {/* 5. CANVAS RHYTHM GAMEPLAY */}
      <canvas
        ref={canvasRef}
        style={{
          display: gameState === 'playing' || gameState === 'result' ? 'block' : 'none',
          width: '100%',
          height: '100%'
        }}
      />

      {/* 6. TUTORIAL OVERLAY (When in Tutorial Mode) */}
      {gameState === 'playing' && isTutorialMode && (
        <TutorialOverlay
          phaseInfo={tutorialInfo}
          onNextStep={() => gameLoopRef.current?.nextTutorialPhase()}
          isCompleted={isTutorialCompleted}
          onCompleteTutorial={() => {
            if (gameLoopRef.current) gameLoopRef.current.stop();
            setIsTutorialMode(false);
            setIsTutorialCompleted(false);
            setGameState('menu');
          }}
        />
      )}

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
          beatmapTitle={`${selectedSongTrack.title} (${currentDifficulty})`}
          onResume={handleTogglePause}
          onRestart={() => {
            if (isTutorialMode) handleStartTutorial();
            else handleStartGame(currentBeatmap, currentDifficulty, currentNoteSpeed, selectedSongTrack);
          }}
          onHome={() => {
            if (gameLoopRef.current) gameLoopRef.current.stop();
            setIsPaused(false);
            setIsTutorialMode(false);
            setGameState('menu');
          }}
        />
      )}

      {/* 9. RESULT SCREEN */}
      {gameState === 'result' && (
        <ResultScreen
          stats={gameStats}
          beatmapTitle={`${selectedSongTrack.title} (${currentDifficulty})`}
          onReplay={() => handleStartGame(currentBeatmap, currentDifficulty, currentNoteSpeed, selectedSongTrack)}
          onHome={() => {
            if (gameLoopRef.current) gameLoopRef.current.stop();
            setGameState('menu');
          }}
        />
      )}
    </div>
  );
};
