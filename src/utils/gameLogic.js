export const calculateScore = (timeLeft, level, hintsUsed) => {
    const baseScore = timeLeft * 10;
    const levelMultiplier = Math.pow(1.2, level - 1);
    const hintPenalty = hintsUsed * 50;
    return Math.max(0, Math.floor((baseScore * levelMultiplier) - hintPenalty));
  };
  
  export const getDifficulty = (level) => {
    if (level <= 5) return 'Novice';
    if (level <= 10) return 'Apprentice';
    if (level <= 15) return 'Adept';
    if (level <= 20) return 'Master';
    return 'Grandmaster';
  };
  
  export const getTimeLimit = (level) => {
    // Base time of 60 seconds, decreases with level but never below 30 seconds
    return Math.max(30, Math.floor(60 - (level * 1.5)));
  };
  
  export const checkAnswer = (userAnswer, correctAnswer, level) => {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();
    
    // For higher levels, require exact matches
    if (level > 15) {
      return normalizedUserAnswer === normalizedCorrectAnswer;
    }
    
    // For medium levels, allow minor typos
    if (level > 8) {
      return levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer) <= 1;
    }
    
    // For early levels, be more lenient
    return levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer) <= 2;
  };
  
  export const generateCurse = (level) => {
    const curses = [
      "Your vision blurs slightly...",
      "Whispers echo in your mind...",
      "The text seems to shift and move...",
      "A chill runs down your spine...",
      "The room grows darker...",
      "Time seems to speed up...",
      "Your hands begin to tremble...",
      "Shadows dance at the edge of your vision...",
      "The air grows thick with dread...",
      "Ancient symbols flash before your eyes..."
    ];
    
    // Combine multiple curses for higher levels
    if (level > 15) {
      const curse1 = curses[Math.floor(Math.random() * curses.length)];
      const curse2 = curses[Math.floor(Math.random() * curses.length)];
      return `${curse1} ${curse2}`;
    }
    
    return curses[Math.floor(Math.random() * curses.length)];
  };
  
  // Helper function for answer checking
  function levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    
    return track[str2.length][str1.length];
  }