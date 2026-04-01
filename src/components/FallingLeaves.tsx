import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// High-fidelity realistic leaf SVGs on a 0 0 100 100 canvas
const LeafPaths = [
  // 1. Organic Teardrop Leaf (Ficus/Basic) with short stem
  "M 50 5 C 65 15, 85 40, 85 70 C 85 85, 75 95, 52 98 L 51 108 L 49 108 L 48 98 C 25 95, 15 85, 15 70 C 15 40, 35 15, 50 5 Z",
  // 2. Lobed Oak Leaf with stem
  "M 50 5 C 40 10, 25 15, 25 30 C 25 40, 40 45, 40 50 C 40 55, 15 55, 15 70 C 15 85, 35 90, 48 95 L 48 108 L 52 108 L 52 95 C 65 90, 85 85, 85 70 C 85 55, 60 55, 60 50 C 60 45, 75 40, 75 30 C 75 15, 60 10, 50 5 Z",
  // 3. Spiky Maple Leaf with stem
  "M 50 5 L 42 25 L 15 20 L 25 45 L 5 60 L 30 70 L 25 95 L 48 85 L 48 108 L 52 108 L 52 85 L 75 95 L 70 70 L 95 60 L 75 45 L 85 20 L 58 25 Z"
];

// Rich Premium 3D Leaf Palettes
const LeafGradients = [
  { from: '#84cc16', to: '#3f6212' }, // Bright Lime/Olive
  { from: '#4ade80', to: '#14532d' }, // Emerald/Dark green
  { from: '#a3e635', to: '#4d7c0f' }, // Lime/Forest
  { from: '#facc15', to: '#a16207' }, // Golden Amber (Autumn highlight)
];

const RealLeaf = ({ className, pathIndex, gradientId, gradientConfig }: { className?: string, pathIndex: number, gradientId: string, gradientConfig: { from: string, to: string } }) => (
  <svg viewBox="0 0 100 110" className={className} xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4)) drop-shadow(0px -2px 6px rgba(255,255,255,0.15))' }}>
    <defs>
      <linearGradient id={gradientId} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" style={{ stopColor: gradientConfig.from, stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: gradientConfig.to, stopOpacity: 1 }} />
      </linearGradient>
      
      {/* 3D Inner Light / Highlight Effect via Radial Gradient mapping */}
      <radialGradient id={`${gradientId}-highlight`} cx="30%" cy="30%" r="50%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
        <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    
    {/* Base 3D Gradient Color */}
    <path d={LeafPaths[pathIndex]} fill={`url(#${gradientId})`} />
    
    {/* Inner Highlight for Plump / Premium 3D feel */}
    <path d={LeafPaths[pathIndex]} fill={`url(#${gradientId}-highlight)`} />
    
    {/* Subtle Dark Vein Outline for realism */}
    <path d={LeafPaths[pathIndex]} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
  </svg>
);

export const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Array<any>>([]);

  useEffect(() => {
    // Generate 45 realistic leaves for a dense, visually rich illusion effect
    const newLeaves = Array.from({ length: 45 }).map((_, i) => {
      // Create depth of field effect
      const zIndex = Math.random(); // 0 to 1 distance representation
      const isBlurred = zIndex > 0.6; 
      const blurAmount = isBlurred ? `${(zIndex - 0.5) * 12}px` : '0px';
      
      // Farther leaves are smaller, slower, and have less opacity
      const scale = 0.3 + (1 - zIndex) * 1.5; 
      const duration = 12 + zIndex * 25; // 12s to 37s fall duration
      const maxOpacity = 0.4 + (1 - zIndex) * 0.6; // 40% to 100% true opacity
      
      return {
        id: `leaf-${i}`,
        x: -10 + Math.random() * 120, // start X (-10% to 110vw)
        scale,
        duration,
        blurAmount,
        maxOpacity,
        delay: Math.random() * -20, // Negative delay to pre-fill the screen immediately!
        shape: Math.floor(Math.random() * 3),
        rotateBase: Math.random() * 360,
        gradientIdx: Math.floor(Math.random() * LeafGradients.length)
      };
    });
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ 
              y: '-20vh', 
              x: `${leaf.x}vw`, 
              opacity: 0, 
              rotateZ: leaf.rotateBase,
              rotateX: Math.random() * 180,
              rotateY: Math.random() * 180
            }}
            animate={{ 
              y: ['-20vh', '120vh'], // Fall beyond screen
              x: [`${leaf.x}vw`, `${leaf.x + (Math.random() > 0.5 ? 40 : -40)}vw`], // Sway violently or smoothly
              opacity: [0, leaf.maxOpacity, leaf.maxOpacity, 0], // Crossfade in and out
              rotateZ: [leaf.rotateBase, leaf.rotateBase + (Math.random() > 0.5 ? 720 : -720)], // Continuous spin
              rotateX: [0, 720], // Deep 3D tumble
              rotateY: [0, 720]  // Deep 3D tumble
            }}
            transition={{ 
              duration: leaf.duration, 
              delay: leaf.delay, 
              ease: "linear", 
              repeat: Infinity 
            }}
            className="absolute"
            style={{ 
              left: `${leaf.x}%`, 
              transform: `scale(${leaf.scale})`,
              filter: `blur(${leaf.blurAmount})`
            }}
          >
             <RealLeaf 
               className="w-12 h-12 md:w-24 md:h-24" 
               pathIndex={leaf.shape} 
               gradientId={`grad-${leaf.id}`}
               gradientConfig={LeafGradients[leaf.gradientIdx]}
             />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
