// src/components/screens/TransitionScreen.tsx
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import MountainSVG from '../game/MountainSVG';
import { audioService } from '../../services/audioService';
import { Play, ArrowLeft, Mountain as MountainIcon } from 'lucide-react';

export default function TransitionScreen() {
  const { currentMountainIndex, setPhase, soundEnabled } = useGameStore();
  const mountain = mountains[currentMountainIndex];

  useEffect(() => {
    if (soundEnabled) {
      audioService.playTransition();
    }
  }, [soundEnabled]);

  const handleStart = () => {
    if (soundEnabled) {
      audioService.playStep();
    }
    setPhase('climbing');
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-mt-dark overflow-y-auto p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center flex flex-col items-center max-w-xl w-full my-auto"
      >
        <span className="text-gold tracking-[0.35em] text-xs md:text-sm font-bold mb-3 uppercase flex items-center gap-2">
          <MountainIcon className="w-4 h-4 text-gold" /> Ready For Next Peak
        </span>
        
        <h1 className="text-4xl md:text-6xl font-display title-gold mb-2 uppercase">
          PEAK 0{currentMountainIndex + 1}
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
          {mountain.name}
        </h2>

        <div className="glass px-6 py-2 rounded-full mb-6 border border-white/10">
           <p className="text-sky-blue text-sm font-bold tracking-widest uppercase">{mountain.maslowStage}</p>
        </div>
        
        <div className="w-48 h-48 md:w-56 md:h-56 relative my-2">
           <MountainSVG index={currentMountainIndex} />
        </div>

        <p className="text-white/60 text-sm md:text-base my-4 max-w-md">
          5 Challenges to reach the summit. You have 30 seconds for each challenge to make your decision.
        </p>

        {/* Start Button & Back Option */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full max-w-sm justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full sm:flex-1 py-4 px-8 rounded-2xl btn-gold text-sky-night font-bold font-display text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all uppercase tracking-wider"
          >
            <span>START LEVEL</span>
            <Play className="w-5 h-5 fill-current" />
          </motion.button>

          <button
            onClick={() => setPhase('worldmap')}
            className="py-3 px-5 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Map
          </button>
        </div>
      </motion.div>
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <MountainSVG index={currentMountainIndex} />
      </div>
    </div>
  );
}
