// Animation timing and easing functions
export const timings = {
    fast: 0.2,
    medium: 0.5,
    slow: 0.8,
    verySlow: 1.2
  };
  
  export const easings = {
    smooth: [0.4, 0, 0.2, 1],
    sharp: [0.4, 0, 0.6, 1],
    bouncy: [0.68, -0.55, 0.265, 1.55]
  };
  
  // Particle generation utilities
  export const generateParticles = (count, bounds) => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      size: Math.random() * (bounds.maxSize - bounds.minSize) + bounds.minSize,
      velocity: {
        x: (Math.random() - 0.5) * bounds.speed,
        y: (Math.random() - 0.5) * bounds.speed
      },
      opacity: Math.random(),
      hue: Math.random() * 60 - 30 // Purple hue variation
    }));
  };
  
  // Animation variants for different effects
  export const pageVariants = {
    initial: {
      opacity: 0,
      rotateY: -90,
      transition: { duration: timings.medium, ease: easings.smooth }
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: timings.medium, ease: easings.smooth }
    },
    exit: {
      opacity: 0,
      rotateY: 90,
      transition: { duration: timings.medium, ease: easings.smooth }
    }
  };
  
  export const curseVariants = {
    shake: {
      initial: { x: 0 },
      animate: {
        x: [0, -10, 10, -10, 0],
        transition: { duration: timings.fast, ease: easings.sharp }
      }
    },
    blur: {
      initial: { filter: 'blur(0px)' },
      animate: {
        filter: ['blur(0px)', 'blur(3px)', 'blur(0px)'],
        transition: { duration: timings.slow, ease: easings.smooth }
      }
    },
    float: {
      initial: { y: 0 },
      animate: {
        y: [0, -20, 0],
        transition: { duration: timings.verySlow, ease: easings.bouncy, repeat: Infinity }
      }
    }
  };
  
  // Utility function to chain animations
  export const chainAnimations = (animations, callback) => {
    let currentIndex = 0;
    
    const runNextAnimation = () => {
      if (currentIndex >= animations.length) {
        callback?.();
        return;
      }
      
      const currentAnimation = animations[currentIndex];
      currentAnimation(() => {
        currentIndex++;
        runNextAnimation();
      });
    };
    
    runNextAnimation();
  };
  
  // Custom animation sequences
  export const createCurseSequence = (intensity) => {
    return {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.7, 1],
        filter: [
          'hue-rotate(0deg)',
          `hue-rotate(${intensity * 30}deg)`,
          'hue-rotate(0deg)'
        ]
      },
      transition: {
        duration: timings.slow * intensity,
        ease: easings.smooth,
        repeat: intensity > 2 ? Infinity : 0
      }
    };
  };
  
  // Background pattern generation
  export const generatePatterns = (complexity) => {
    const patterns = [];
    const patternCount = Math.floor(complexity * 3);
    
    for (let i = 0; i < patternCount; i++) {
      patterns.push({
        type: Math.random() > 0.5 ? 'circle' : 'line',
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100
        },
        size: Math.random() * (50 - 10) + 10,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.3
      });
    }
    
    return patterns;
  };