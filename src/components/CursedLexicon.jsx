import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Book, Skull, Heart, Timer, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageTurn from './animations/PageTurn';
import Background from './layout/Background';
import CurseEffects from './animations/CurseEffects';

const INITIAL_STATE = {
  currentLevel: 1,
  lives: 3,
  score: 0,
  time: 60,
  input: '',
  gameState: 'playing',
  showHint: false,
  isSoundOn: true,
  message: '',
  isShaking: false,
  curseActive: false,
  curseType: null
};

const CursedLexicon = () => {
  // State management with custom hook
  const [gameState, setGameState] = useState(INITIAL_STATE);
  
  // Memoized puzzles array
  const puzzles = useMemo(() => [
    {
      id: 1,
      riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
      hint: "Listen carefully to nature's reply...",
      curse: "Your voice becomes a whisper for the next round...",
      curseType: "whisper"
    },
    {
      id: 2,
      riddle: "Born in shadows, fed by fear, growing stronger as night draws near. What cursed emotion am I?",
      answer: "dread",
      hint: "The feeling that makes your heart race...",
      curse: "Darkness creeps into your peripheral vision...",
      curseType: "darkness"
    }
  ], []);

  const currentPuzzle = useMemo(() => 
    puzzles[gameState.currentLevel - 1],
    [puzzles, gameState.currentLevel]
  );

  // Timer effect with cleanup
  useEffect(() => {
    let timer;
    if (gameState.gameState === 'playing' && gameState.time > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time - 1
        }));
      }, 1000);
    } else if (gameState.time === 0 && gameState.lives > 0) {
      handleLoseLife();
    }
    return () => clearInterval(timer);
  }, [gameState.time, gameState.gameState]);

  // Memoized handlers
  const handleLoseLife = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      return {
        ...prev,
        lives: newLives,
        gameState: newLives <= 0 ? 'lost' : prev.gameState,
        curseActive: true,
        curseType: currentPuzzle?.curseType
      };
    });
  }, [currentPuzzle]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (gameState.input.toLowerCase() === currentPuzzle?.answer) {
      // Handle correct answer
      setGameState(prev => ({
        ...prev,
        score: prev.score + (prev.time * 10),
        showHint: false,
        message: '✨ Ancient knowledge flows through you...',
        gameState: prev.currentLevel === puzzles.length ? 'won' : prev.gameState,
        currentLevel: prev.currentLevel === puzzles.length ? prev.currentLevel : prev.currentLevel + 1,
        time: 60,
        input: '',
        curseActive: false
      }));
    } else {
      // Handle wrong answer
      setGameState(prev => ({
        ...prev,
        isShaking: true,
        message: currentPuzzle?.curse || '',
      }));
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isShaking: false
        }));
      }, 500);
      handleLoseLife();
    }
  }, [gameState.input, currentPuzzle, puzzles.length, handleLoseLife]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  // Memoized UI components
  const GameHeader = useMemo(() => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Book className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Cursed Lexicon
        </h1>
      </div>
      <button
        onClick={() => setGameState(prev => ({ ...prev, isSoundOn: !prev.isSoundOn }))}
        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
      >
        {gameState.isSoundOn ? <Volume2 /> : <VolumeX />}
      </button>
    </div>
  ), [gameState.isSoundOn]);

  const GameStats = useMemo(() => (
    <div className="flex justify-between mb-6 p-4 bg-slate-800 rounded-lg">
      <div className="flex items-center gap-2">
        <Heart className="text-red-500" />
        <span>{gameState.lives}</span>
      </div>
      <div className="flex items-center gap-2">
        <Timer className="text-yellow-500" />
        <span>{gameState.time}s</span>
      </div>
      <div className="flex items-center gap-2">
        <Skull className="text-purple-400" />
        <span>{gameState.score}</span>
      </div>
    </div>
  ), [gameState.lives, gameState.time, gameState.score]);

  return (
    <div className="relative min-h-screen">
      <Background difficulty={gameState.currentLevel} />
      <PageTurn isVisible={gameState.showPageTurn}>
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
          <div className="max-w-2xl mx-auto">
            {GameHeader}
            {GameStats}
            
            <div className={`relative p-6 bg-slate-800 rounded-lg mb-6 transition-transform ${gameState.isShaking ? 'animate-shake' : ''}`}>
              {gameState.gameState === 'playing' && (
                <>
                  <h2 className="text-xl mb-4 font-semibold text-purple-400">
                    Riddle {gameState.currentLevel}
                  </h2>
                  <p className="mb-6 text-lg">{currentPuzzle?.riddle}</p>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={gameState.input}
                      onChange={(e) => setGameState(prev => ({ ...prev, input: e.target.value }))}
                      className="w-full p-3 bg-slate-700 rounded-lg mb-4 text-slate-100 outline-none border-2 border-transparent focus:border-purple-400 transition-colors"
                      placeholder="Enter your answer..."
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Submit Answer
                      </button>
                      <button
                        type="button"
                        onClick={() => setGameState(prev => ({ ...prev, showHint: true }))}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        Hint
                      </button>
                    </div>
                  </form>
                </>
              )}

              {gameState.gameState === 'won' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">
                    🎉 Victory! The Lexicon's secrets are yours!
                  </h2>
                  <p className="mb-4">Final Score: {gameState.score}</p>
                  <button
                    onClick={resetGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              )}

              {gameState.gameState === 'lost' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">
                    💀 The curse claims another victim...
                  </h2>
                  <p className="mb-4">Score: {gameState.score}</p>
                  <button
                    onClick={resetGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {gameState.message && (
              <Alert className="mb-4 bg-slate-800 border-purple-400">
                <AlertDescription>{gameState.message}</AlertDescription>
              </Alert>
            )}

            {gameState.showHint && currentPuzzle?.hint && (
              <Alert className="mb-4 bg-slate-800 border-yellow-400">
                <AlertDescription>{currentPuzzle.hint}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </PageTurn>
      <CurseEffects isActive={gameState.curseActive} type={gameState.curseType} />
    </div>
  );
};

export default CursedLexicon;