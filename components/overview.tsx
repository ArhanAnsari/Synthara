import { motion } from 'framer-motion';

import { LogoAuroraAI, MessageIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <LogoAuroraAI size={40} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <h2 className="text-2xl font-bold">Hi, I am AuroraAI! 🚀</h2>
        <p>
          AuroraAI is your intelligent AI assistant, designed to help with
          coding, answering queries, and enhancing your workflow seamlessly.
          Whether you're a developer, student, or tech enthusiast, AuroraAI
          provides real-time assistance and valuable insights.
        </p>
        <p>
          Powered by cutting-edge AI technology, AuroraAI ensures a
          fast, responsive, and interactive experience. It's built with modern
          web technologies to provide you with a smooth and efficient chat
          experience.
        </p>
      </div>
    </motion.div>
  );
};
