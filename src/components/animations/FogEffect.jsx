import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FogEffect = ({ intensity = 1, color = 'rgba(147, 51, 234, 0.1)' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      const particleCount = Math.floor(50 * intensity);
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (30 - 5) + 5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3
      }));
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `rgba(147, 51, 234, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, color]);
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default FogEffect;