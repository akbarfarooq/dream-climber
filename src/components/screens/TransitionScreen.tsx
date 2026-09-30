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
    <div className="relative h-full w-full flex flex-col items-center overflow-y-auto overflow-x-hidden bg-mt-dark p-4 md:p-6 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center flex flex-col items-center max-w-lg w-full m-auto py-2"
      >
        <span className="text-gold tracking-[0.3em] text-xs font-bold mb-2 uppercase flex items-center gap-2">
          <MountainIcon className="w-3.5 h-3.5 text-gold" /> Ready For Next Peak
        </span>
        
        <h1 className="text-3xl md:text-5xl font-display title-gold mb-1 uppercase tracking-wide">
          PEAK 0{currentMountainIndex + 1}
        </h1>
        
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">
          {mountain.name}
        </h2>

        <div className="glass px-4 py-1.5 rounded-full mb-3 border border-white/10">
           <p className="text-sky-blue text-xs font-bold tracking-widest uppercase">{mountain.maslowStage}</p>
        </div>
        
        <div className="w-32 h-32 md:w-40 md:h-40 relative my-2">
           <MountainSVG index={currentMountainIndex} />
        </div>

        <p className="text-white/60 text-xs md:text-sm my-2 md:my-3 max-w-md leading-relaxed">
          5 Challenges to reach the summit. You have 30 seconds for each challenge to make your decision.
        </p>

        {/* Start Button & Back Option */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full max-w-sm justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            className="w-full sm:flex-1 py-3 px-6 rounded-2xl btn-gold text-sky-night font-bold font-display text-base flex items-center justify-center gap-2.5 shadow-xl hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all uppercase tracking-wider"
          >
            <span>START LEVEL</span>
            <Play className="w-4 h-4 fill-current" />
          </motion.button>

          <button
            onClick={() => setPhase('worldmap')}
            className="py-2.5 px-4 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Map
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
