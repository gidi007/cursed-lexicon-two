import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageTurn = ({ children, isVisible, onAnimationComplete }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="relative w-full h-full"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.6
          }}
          onAnimationComplete={onAnimationComplete}
          style={{ 
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-sweep" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTurn;