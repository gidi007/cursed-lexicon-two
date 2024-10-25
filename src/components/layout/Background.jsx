import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Background = ({ difficulty }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate particles based on difficulty
    const particleCount = Math.min(50 + (difficulty * 10), 200);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, [difficulty]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial"
        animate={{
          background: [
            'radial-gradient(circle, rgba(88,28,135,0.2) 0%, rgba(15,23,42,1) 100%)',
            'radial-gradient(circle, rgba(126,34,206,0.2) 0%, rgba(15,23,42,1) 100%)',
            'radial-gradient(circle, rgba(88,28,135,0.2) 0%, rgba(15,23,42,1) 100%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Fog effect */}
      <motion.div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" /%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"%3E%3C/rect%3E%3C/svg%3E")'
        }}
        animate={{
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default Background;