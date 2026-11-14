import React, { useEffect, useRef } from 'react';

interface AnimatedVaultChamberProps {
  className?: string;
}

export const AnimatedVaultChamber: React.FC<AnimatedVaultChamberProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Handle high-DPI retina displays
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Ambient floating particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.0015 + 0.0006,
      speedX: (Math.random() - 0.5) * 0.0008,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      time += 0.02;

      // 1. Radiant Ambient Background Glow
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, 'rgba(236, 253, 245, 0.95)'); // soft mint
      bgGrad.addColorStop(0.5, 'rgba(240, 253, 250, 0.9)');
      bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const vpX = width * 0.5;
      const vpY = height * 0.42;

      // 2. Animated Infinite Floor Grid (Moving Forward into the Chamber)
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;

      // Perspective floor lines radiating from vanishing point
      const rayCount = 18;
      for (let i = -rayCount; i <= rayCount; i++) {
        const targetX = vpX + (i / rayCount) * width * 1.4;
        ctx.beginPath();
        ctx.moveTo(vpX, vpY + 20);
        ctx.lineTo(targetX, height + 40);
        ctx.stroke();
      }

      // Moving horizontal floor lines (continuous forward flow)
      const floorLineCount = 10;
      for (let i = 0; i < floorLineCount; i++) {
        const offset = ((i / floorLineCount) + (time * 0.08)) % 1;
        const lineY = vpY + Math.pow(offset, 2.2) * (height - vpY);
        const lineWidthFactor = Math.pow(offset, 1.8) * width * 0.8;

        ctx.beginPath();
        ctx.moveTo(vpX - lineWidthFactor, lineY);
        ctx.lineTo(vpX + lineWidthFactor, lineY);
        ctx.strokeStyle = `rgba(16, 185, 129, ${offset * 0.22})`;
        ctx.stroke();
      }
      ctx.restore();

      // 3. 3D Architectural Pillars / Columns (CRED-inspired geometric chamber)
      // Symmetrical columns receding towards the vanishing point on left and right
      const pillarCount = 5;

      const drawPillar = (side: 'left' | 'right', index: number) => {
        const tProgress = index / (pillarCount - 1); // 0 (front/outer) to 1 (back/inner)
        const scale = 1 - tProgress * 0.65; // columns shrink into distance

        // X coordinate based on side and perspective
        const outerMargin = 12;
        const innerMargin = width * 0.28;
        const xPos = side === 'left'
          ? outerMargin + (innerMargin - outerMargin) * tProgress
          : width - outerMargin - (innerMargin - outerMargin) * tProgress;

        const colWidth = (42 - tProgress * 24) * (width > 600 ? 1 : 0.7);
        const colHeight = (height * 0.85) * scale;
        const colY = (height * 0.5) - (colHeight * 0.45);

        // Pillar face gradient (Pure White, Mint & Emerald Fintech Palette)
        const colGrad = ctx.createLinearGradient(xPos, colY, xPos + colWidth, colY + colHeight);
        colGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        colGrad.addColorStop(0.5, 'rgba(240, 253, 244, 0.85)');
        colGrad.addColorStop(1, 'rgba(209, 250, 229, 0.7)');

        ctx.save();
        ctx.fillStyle = colGrad;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 1.5;

        // Draw pillar rounded rect
        const radius = 8 * scale;
        const drawX = side === 'left' ? xPos : xPos - colWidth;

        ctx.beginPath();
        ctx.roundRect(drawX, colY, colWidth, colHeight, [radius, radius, radius, radius]);
        ctx.fill();
        ctx.stroke();

        // 4. Moving Luminous Neon Energy Strip (The key moving feature from the CRED video!)
        // Light travels vertically along the inner architectural edge
        const edgeX = side === 'left' ? drawX + colWidth : drawX;
        const pulseCycle = (time * 0.75 + index * 0.45) % 1;
        const beamLength = colHeight * 0.35;
        const beamY = colY + pulseCycle * (colHeight - beamLength);

        // Glowing laser gradient
        const laserGrad = ctx.createLinearGradient(edgeX, beamY, edgeX, beamY + beamLength);
        laserGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        laserGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.95)'); // brilliant emerald mint
        laserGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.save();
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12 * scale;
        ctx.strokeStyle = laserGrad;
        ctx.lineWidth = 3.5 * scale;

        ctx.beginPath();
        ctx.moveTo(edgeX, beamY);
        ctx.lineTo(edgeX, beamY + beamLength);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      };

      // Draw pillars from back to front for proper depth layering
      for (let i = pillarCount - 1; i >= 0; i--) {
        drawPillar('left', i);
        drawPillar('right', i);
      }

      // 5. Central Pulsing Ambient Radar Ring (Symbolizing live devaluation radar)
      ctx.save();
      const ringPulse = (time * 0.6) % 1;
      const ringRadius = 40 + ringPulse * 160;
      const ringAlpha = (1 - ringPulse) * 0.35;

      ctx.beginPath();
      ctx.arc(vpX, vpY + 15, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${ringAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 6. Floating Ambient Dust / Sparkle Orbs
      ctx.save();
      particles.forEach((p, idx) => {
        p.y -= p.speedY;
        p.x += Math.sin(time + p.phase) * p.speedX;

        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }

        const px = p.x * width;
        const py = p.y * height;
        const pAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.phase));

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0
          ? `rgba(16, 185, 129, ${pAlpha})`
          : `rgba(245, 158, 11, ${pAlpha * 0.8})`; // subtle gold sparkle
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
