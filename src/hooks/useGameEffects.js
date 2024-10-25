import { useState, useEffect, useCallback } from 'react';
import { timings, easings, createCurseSequence } from '../utils/animationHelpers';

export const useGameEffects = (difficulty = 1) => {
  const [curseActive, setCurseActive] = useState(false);
  const [curseType, setCurseType] = useState(null);
  const [ambientLevel, setAmbientLevel] = useState(1);
  const [screenEffects, setScreenEffects] = useState([]);
  
  // Handle ambient effects based on difficulty
  useEffect(() => {
    setAmbientLevel(Math.min(1 + (difficulty * 0.1), 2));
  }, [difficulty]);
  
  // Apply curse effect
  const applyCurse = useCallback((type, duration = 5000) => {
    setCurseType(type);
    setCurseActive(true);
    
    // Add screen effect
    setScreenEffects(prev => [...prev, {
      id: Date.now(),
      type,
      sequence: createCurseSequence(difficulty)
    }]);
    
    // Clear curse after duration
    const timer = setTimeout(() => {
      setCurseActive(false);
      setCurseType(null);
      setScreenEffects(prev => prev.filter(effect => effect.type !== type));
    }, duration);
    
    return () => clearTimeout(timer);
  }, [difficulty]);
  
  // Clear all effects
  const clearEffects = useCallback(() => {
    setCurseActive(false);
    setCurseType(null);
    setScreenEffects([]);
  }, []);
  
  // Generate current visual state
  const visualState = {
    ambientIntensity: ambientLevel,
    screenShake: curseActive && curseType === 'shake',
    blurEffect: curseActive && curseType === 'blur',
    activeEffects: screenEffects,
    curseSequence: curseActive ? createCurseSequence(difficulty) : null
  };
  
  return {
    curseActive,
    curseType,
    visualState,
    applyCurse,
    clearEffects,
    screenEffects
  };
};