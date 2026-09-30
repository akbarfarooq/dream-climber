// src/components/screens/WelcomeScreen.tsx
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import ParticleBackground from '../ui/ParticleBackground';
import Mountain3D from '../game/Mountain3D';

export default function WelcomeScreen() {
  const setPhase = useGameStore((state) => state.setPhase);

  const titleWords = "THE DREAM CLIMBER".split(" ");

  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-x-hidden overflow-y-auto bg-sky-night p-6 py-6 md:py-8">
      <ParticleBackground type="stars" />
      
      <div className="absolute inset-0 z-0">
        <Mountain3D color="#1a1a3e" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 m-auto py-2">
        <motion.div className="mb-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-8xl title-gold"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg md:text-2xl text-sky-blue/80 font-light mb-12 tracking-[0.2em] uppercase"
        >
          7 Mountains. 35 Challenges. 1 Dream.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase('setup')}
          className="btn-gold text-lg md:text-xl px-10 md:px-12 py-4 md:py-5"
        >
          BEGIN YOUR JOURNEY
        </motion.button>
      </div>
      
      {/* Tiny climber silhouette */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-30"
      >
        <div className="text-4xl">🧗</div>
      </motion.div>
    </div>
  );
}
