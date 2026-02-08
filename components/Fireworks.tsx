
import React, { useEffect, useRef } from 'react';

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      gravity: number;
      friction: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.alpha = 1;
        this.color = color;
        this.gravity = 0.05;
        this.friction = 0.98;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
      }
    }

    const createExplosion = (x: number, y: number) => {
      const colors = ['#ec4899', '#f472b6', '#fbcfe8', '#fbbf24', '#ffffff'];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    };

    let lastSpawn = 0;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (time - lastSpawn > 400) {
        createExplosion(
          Math.random() * canvas.width,
          Math.random() * (canvas.height * 0.6) + canvas.height * 0.1
        );
        lastSpawn = time;
      }

      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default Fireworks;
