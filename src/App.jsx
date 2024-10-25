import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import CursedLexicon from './components/CursedLexicon';
import GameLayout from './components/layout/GameLayout';
import Background from './components/layout/Background';
import './styles/globals.css';
import './styles/animations.css';

// Sound effects configuration
const AUDIO_FILES = {
  pageTurn: new Audio('/assets/sounds/page-turn.mp3'),
  curse: new Audio('/assets/sounds/curse.mp3'),
  ambient: new Audio('/assets/sounds/ambient.mp3')
};

// Configure ambient sound
AUDIO_FILES.ambient.loop = true;
AUDIO_FILES.ambient.volume = 0.3;

const App = () => {
  // Initialize ambient sound on first user interaction
  const handleFirstInteraction = () => {
    AUDIO_FILES.ambient.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
    // Remove the event listener after first interaction
    document.removeEventListener('click', handleFirstInteraction);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      // Cleanup audio on unmount
      Object.values(AUDIO_FILES).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  return (
    <>
      <GameLayout>
        <CursedLexicon audioFiles={AUDIO_FILES} />
      </GameLayout>
      
      {/* Toast notifications for game events */}
      <Toaster />
    </>
  );
};

export default App;