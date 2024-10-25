import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const ParticleShape = {
  CIRCLE: 'circle',
  PENTAGON: 'pentagon',
  STAR: 'star',
  RUNE: 'rune',
  SMOKE: 'smoke'
};

const BlendModes = {
  SCREEN: 'screen',
  OVERLAY: 'overlay',
  MULTIPLY: 'multiply',
  COLOR_DODGE: 'color-dodge',
  HARD_LIGHT: 'hard-light'
};

const CurseEffects = ({ 
  isActive, 
  type,
  mouseInteraction = true,
  blendMode = BlendModes.SCREEN,
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const controls = useAnimation();
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Enhanced effect configurations
  const effectConfigs = {
    shake: {
      motion: {
        animate: {
          x: [0, -10, 10, -10, 0],
          transition: { duration: 0.5, repeat: 0 }
        }
      },
      particles: {
        colors: ['#7c3aed', '#9333ea', '#581c87'],
        shapes: [ParticleShape.RUNE, ParticleShape.PENTAGON],
        density: 30,
        blendMode: BlendModes.OVERLAY,
        speed: 2,
        turbulence: 0.2
      }
    },
    blur: {
      motion: {
        animate: {
          filter: ['blur(0px)', 'blur(3px)', 'blur(0px)'],
          transition: { duration: 2, repeat: Infinity }
        }
      },
      particles: {
        colors: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
        shapes: [ParticleShape.SMOKE],
        density: 50,
        blendMode: BlendModes.SCREEN,
        speed: 1,
        turbulence: 0.1
      }
    },
    darkVision: {
      motion: {
        initial: { backgroundColor: 'rgba(0,0,0,0)' },
        animate: { backgroundColor: 'rgba(0,0,0,0.5)' },
        exit: { backgroundColor: 'rgba(0,0,0,0)' },
        transition: { duration: 1 }
      },
      particles: {
        colors: ['#1e293b', '#334155', '#475569'],
        shapes: [ParticleShape.CIRCLE, ParticleShape.SMOKE],
        density: 70,
        blendMode: BlendModes.MULTIPLY,
        speed: 0.5,
        turbulence: 0.05
      }
    },
    whispers: {
      motion: {
        animate: {
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8],
          transition: { duration: 3, repeat: Infinity }
        }
      },
      particles: {
        colors: ['#c084fc', '#a855f7', '#9333ea'],
        shapes: [ParticleShape.STAR, ParticleShape.RUNE],
        density: 40,
        blendMode: BlendModes.COLOR_DODGE,
        speed: 1.5,
        turbulence: 0.15
      }
    },
    blood: {
      motion: {
        animate: {
          opacity: [1, 0.8, 1],
          transition: { duration: 2, repeat: Infinity }
        }
      },
      particles: {
        colors: ['#dc2626', '#991b1b', '#7f1d1d'],
        shapes: [ParticleShape.CIRCLE],
        density: 60,
        blendMode: BlendModes.HARD_LIGHT,
        speed: 2,
        turbulence: 0.1
      }
    }
  };

  // Particle class with enhanced shape rendering
  class Particle {
    constructor(canvas, options) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (options.size?.max || 8 - options.size?.min || 2) + (options.size?.min || 2);
      this.speedX = (Math.random() - 0.5) * options.speed;
      this.speedY = (Math.random() - 0.5) * options.speed;
      this.color = options.colors[Math.floor(Math.random() * options.colors.length)];
      this.shape = options.shapes[Math.floor(Math.random() * options.shapes.length)];
      this.turbulence = options.turbulence;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.02;
    }

    draw() {
      this.ctx.save();
      this.ctx.globalAlpha = this.life;
      this.ctx.fillStyle = this.color;

      switch (this.shape) {
        case ParticleShape.PENTAGON:
          this.drawPentagon();
          break;
        case ParticleShape.STAR:
          this.drawStar();
          break;
        case ParticleShape.RUNE:
          this.drawRune();
          break;
        case ParticleShape.SMOKE:
          this.drawSmoke();
          break;
        default:
          this.drawCircle();
      }

      this.ctx.restore();
    }

    drawCircle() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    drawPentagon() {
      this.ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = this.x + this.size * Math.cos(angle);
        const y = this.y + this.size * Math.sin(angle);
        i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.fill();
    }

    drawStar() {
      this.ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? this.size : this.size / 2;
        const x = this.x + radius * Math.cos(angle);
        const y = this.y + radius * Math.sin(angle);
        i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.fill();
    }

    drawRune() {
      const runes = ['ᚠ', 'ᚡ', 'ᚢ', 'ᚣ', 'ᚤ', 'ᚥ', 'ᚦ', 'ᚧ', 'ᚨ', 'ᚩ'];
      this.ctx.font = `${this.size * 2}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(runes[Math.floor(Math.random() * runes.length)], this.x, this.y);
    }

    drawSmoke() {
      const gradient = this.ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    update() {
      // Mouse interaction
      if (mouseInteraction && mouseRef.current) {
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.speedX -= (dx / distance) * force * 0.5;
          this.speedY -= (dy / distance) * force * 0.5;
        }
      }

      // Apply turbulence
      this.speedX += (Math.random() - 0.5) * this.turbulence;
      this.speedY += (Math.random() - 0.5) * this.turbulence;

      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;

      // Boundary checking
      if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -0.5;
      if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -0.5;

      return this.life > 0;
    }
  }

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseInteraction]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const config = effectConfigs[type]?.particles;

    const animate = () => {
      ctx.globalCompositeOperation = config?.blendMode || blendMode;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const isAlive = particle.update();
        if (isAlive) particle.draw();
        return isAlive;
      });

      // Add new particles
      while (particlesRef.current.length < config?.density) {
        particlesRef.current.push(new Particle(canvas, config));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current = [];
    };
  }, [isActive, type, blendMode]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          {...effectConfigs[type]?.motion}
        >
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0"
            style={{ mixBlendMode: blendMode }}
          />
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