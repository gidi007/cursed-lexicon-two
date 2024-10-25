import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurseEffects = ({ isActive, type }) => {
  const effects = {
    shake: {
      animate: {
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5, repeat: 0 }
      }
    },
    blur: {
      animate: {
        filter: ['blur(0px)', 'blur(3px)', 'blur(0px)'],
        transition: { duration: 2, repeat: Infinity }
      }
    },
    darkVision: {
      initial: { backgroundColor: 'rgba(0,0,0,0)' },
      animate: { backgroundColor: 'rgba(0,0,0,0.5)' },
      exit: { backgroundColor: 'rgba(0,0,0,0)' },
      transition: { duration: 1 }
    },
    whispers: {
      animate: {
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.8],
        transition: { duration: 3, repeat: Infinity }
      }
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          {...effects[type]}
        >
          {type === 'whispers' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-purple-400/50 text-4xl font-cursive"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⊗ ⊕ ⊗
              </motion.span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurseEffects;