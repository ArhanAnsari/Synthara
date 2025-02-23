// components/Waveform.tsx
"use client";

import { motion } from "framer-motion";

const Waveform = () => {
  const bars = Array.from({ length: 15 }).map((_, i) => (
    <motion.div
      key={i}
      className="wave-bar"
      style={{
        height: 0, // Initial height is 0
        width: '8px',       // Adjusted width
        margin: '0 2px',   // Added margin for spacing
        backgroundColor: '#3B82F6', // Consistent bar color
        borderRadius: '2px',// Rounded corners
      }}
      animate={{ height: ['10px', '25px', '10px'] }} // Improved height animation
      transition={{
        repeat: Infinity,
        duration: 0.8,
        delay: i * 0.05,
        ease: 'easeInOut', // Smoother transition
        type: "spring", // Spring animation for a bouncy effect
        stiffness: 100,
      }}
    />
  ));

  return <div className="waveform flex mt-4">{bars}</div>;
};

export default Waveform;