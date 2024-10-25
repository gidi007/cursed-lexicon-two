import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';
import FogEffect from '../animations/FogEffect';
import { generatePatterns } from '../../utils/animationHelpers';

const GameLayout = ({ children, difficulty, curseActive, onTransitionComplete }) => {
  const [patterns, setPatterns] = useState([]);
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  
  useEffect(() => {
    setPatterns(generatePatterns(difficulty));
    setAmbientIntensity(Math.min(1 + (difficulty * 0.1), 2));
  }, [difficulty]);

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background layers */}
      <Background difficulty={difficulty} patterns={patterns} />
      <FogEffect intensity={ambientIntensity} />
      
      {/* Ambient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"
        animate={{
          opacity: curseActive ? [0.3, 0.6, 0.3] : 0.3
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen"
        animate={{
          scale: curseActive ? [1, 1.02, 1] : 1,
          filter: curseActive ? ['blur(0px)', 'blur(1px)', 'blur(0px)'] : 'blur(0px)'
        }}
        transition={{
          duration: 2,
          repeat: curseActive ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <AnimatePresence mode="wait" onExitComplete={onTransitionComplete}>
          {children}
        </AnimatePresence>
      </motion.div>
      
      {/* Vignette effect */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-transparent to-slate-900/30" />
    </motion.div>
  );
};

export default GameLayout;