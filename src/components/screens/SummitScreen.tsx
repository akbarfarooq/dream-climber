// src/components/screens/SummitScreen.tsx
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import { Star, ArrowRight, Play, Medal } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';
import Mountain3D from '../game/Mountain3D';

export default function SummitScreen() {
  const { currentMountainIndex, correctAnswersCount, setPhase } = useGameStore();
  const mountain = mountains[currentMountainIndex];
  const score = correctAnswersCount;

  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-x-hidden overflow-y-auto bg-sky-night p-6 py-6 md:py-8">
      <ParticleBackground type="confetti" />
      
      <div className="absolute inset-0 z-0 opacity-40">
        <Mountain3D color={mountain.color} weather="sunrise" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl m-auto py-2">
        <motion.div
           initial={{ scale: 0, rotate: -200 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: "spring", duration: 1 }}
           className="bg-gold p-3.5 md:p-5 rounded-full shadow-[0_0_50px_rgba(255,215,0,0.5)] mb-4 md:mb-6"
        >
           <Medal className="w-10 h-10 md:w-16 md:h-16 text-sky-night" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-display title-gold mb-2 md:mb-3 uppercase"
        >
          Summit Reached!
        </motion.h1>
        
        <p className="text-base md:text-xl text-sky-blue font-light mb-6 md:mb-8 tracking-[0.2em] uppercase">
          {mountain.name} CONQUERED
        </p>

        <div className="glass w-full p-5 md:p-7 rounded-[24px] md:rounded-[36px] border-2 border-gold/30 mb-6 md:mb-8">
            <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star className={`w-8 h-8 md:w-12 md:h-12 ${i < score ? 'text-gold fill-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'text-white/10'}`} />
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-around items-center border-t border-white/10 pt-4 md:pt-6 mt-4 md:mt-6">
              <div>
                <p className="text-white/40 text-[10px] md:text-xs uppercase font-bold tracking-widest">Score</p>
                <p className="text-2xl md:text-4xl font-bold">{score} / 5</p>
              </div>
              <div className="w-px h-10 md:h-12 bg-white/10" />
              <div>
                <p className="text-white/40 text-[10px] md:text-xs uppercase font-bold tracking-widest">Progress</p>
                <p className="text-2xl md:text-4xl font-bold text-success">+{score * 20}%</p>
              </div>
            </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase('worldmap')}
          className="btn-gold text-lg md:text-2xl px-12 md:px-16 py-4 md:py-5 flex items-center gap-4 transition-all"
        >
          CONTINUE MAP <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
        </motion.button>
      </div>
    </div>
  );
}
