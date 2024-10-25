import React, { useState, useEffect } from 'react';
import { Book, Skull, Heart, Timer, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageTurn from './animations/PageTurn';
import Background from './layout/Background';
import CurseEffects from './animations/CurseEffects';

const CursedLexicon = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [input, setInput] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [showHint, setShowHint] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [message, setMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Sample puzzles - in a real app, you'd have many more
  const puzzles = [
    {
      id: 1,
      riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
      hint: "Listen carefully to nature's reply...",
      curse: "Your voice becomes a whisper for the next round..."
    },
    {
      id: 2,
      riddle: "Born in shadows, fed by fear, growing stronger as night draws near. What cursed emotion am I?",
      answer: "dread",
      hint: "The feeling that makes your heart race...",
      curse: "Darkness creeps into your peripheral vision..."
    }
  ];

  const currentPuzzle = puzzles[currentLevel - 1];

  useEffect(() => {
    if (gameState === 'playing' && time > 0) {
      const timer = setInterval(() => setTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (time === 0 && lives > 0) {
      loseLife();
    }
  }, [time, gameState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === currentPuzzle.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    setScore(score + (time * 10));
    setShowHint(false);
    setMessage('✨ Ancient knowledge flows through you...');
    
    if (currentLevel === puzzles.length) {
      setGameState('won');
    } else {
      setCurrentLevel(prev => prev + 1);
      setTime(60);
    }
    setInput('');
  };

  const handleWrongAnswer = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    loseLife();
    setMessage(currentPuzzle.curse);
  };

  const loseLife = () => {
    setLives(prev => prev - 1);
    if (lives <= 1) {
      setGameState('lost');
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setLives(3);
    setScore(0);
    setTime(60);
    setGameState('playing');
    setInput('');
    setShowHint(false);
    setMessage('');
  };

  return (
  <div className="relative min-h-screen">
    <Background difficulty={currentLevel} />
        <PageTurn isVisible={showPageTurn}>
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Cursed Lexicon
            </h1>
          </div>
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            {isSoundOn ? <Volume2 /> : <VolumeX />}
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between mb-6 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" />
            <span>{lives}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="text-yellow-500" />
            <span>{time}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Skull className="text-purple-400" />
            <span>{score}</span>
          </div>
        </div>

        {/* Game Content */}
        <div className={`relative p-6 bg-slate-800 rounded-lg mb-6 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
          {gameState === 'playing' && (
            <>
              <h2 className="text-xl mb-4 font-semibold text-purple-400">
                Riddle {currentLevel}
              </h2>
              <p className="mb-6 text-lg">{currentPuzzle.riddle}</p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
                    onClick={() => setShowHint(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Hint
                  </button>
                </div>
              </form>
            </>
          )}

          {gameState === 'won' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                🎉 Victory! The Lexicon's secrets are yours!
              </h2>
              <p className="mb-4">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                💀 The curse claims another victim...
              </h2>
              <p className="mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
                
          

        {/* Messages */}
        {message && (
          <Alert className="mb-4 bg-slate-800 border-purple-400">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {showHint && (
          <Alert className="mb-4 bg-slate-800 border-yellow-400">
            <AlertDescription>{currentPuzzle.hint}</AlertDescription>
          </Alert>
        )}
      </div>  
        </PageTurn>
        <CurseEffects isActive={curseActive} type={curseType} />
    </div>
</div>   
  );
};

export default CursedLexicon;