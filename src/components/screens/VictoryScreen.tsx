// src/components/screens/VictoryScreen.tsx
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains, DREAM_OPTIONS } from '../../data/levels';
import { Trophy, Share2, RefreshCw, Crown } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';
import { useEffect } from 'react';
import { audioService } from '../../services/audioService';

export default function VictoryScreen() {
  const { playerName, selectedDream, totalScore, resetGame, soundEnabled } = useGameStore();

  useEffect(() => {
    if (soundEnabled) {
      audioService.playComplete();
    }
  }, [soundEnabled]);

  const dream = DREAM_OPTIONS.find(d => d.id === selectedDream);

  const getRank = (score: number) => {
    if (score >= 33) return { title: "DREAM LEGEND", emoji: "🏆" };
    if (score >= 28) return { title: "MASTER CLIMBER", emoji: "🥇" };
    if (score >= 21) return { title: "SKILLED CLIMBER", emoji: "🥈" };
    if (score >= 14) return { title: "RISING CLIMBER", emoji: "🥉" };
    return { title: "BRAVE BEGINNER", emoji: "💪" };
  };

  const rank = getRank(totalScore);

  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-y-auto overflow-x-hidden bg-sky-night p-4 md:p-6 py-6 md:py-8">
      <ParticleBackground type="confetti" />
      <div className="absolute inset-0"><ParticleBackground type="stars" /></div>
      
      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center m-auto py-2">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-8 md:mb-12"
        >
          <div className="relative mb-6 md:mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-linear-to-r from-gold via-sunrise to-gold rounded-full opacity-20 blur-3xl scale-150"
            />
            <div className="relative glass w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-gold shadow-[0_0_50px_rgba(255,215,0,0.3)]">
               <span className="text-5xl md:text-7xl">{dream?.icon || '🧗'}</span>
               <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gold rounded-full p-2 md:p-3 shadow-lg">
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-sky-night" />
               </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-7xl font-display title-gold mb-2 uppercase leading-none">Victory Achieved!</h1>
          <p className="text-xl md:text-3xl text-sky-blue uppercase tracking-[0.2em] font-light mt-2">{playerName}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12 w-full">
           <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-dark p-6 md:p-8 rounded-3xl md:rounded-[40px] flex flex-col items-center justify-center">
              <p className="text-white/40 uppercase font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-4">Final Rank</p>
              <div className="text-4xl md:text-5xl mb-2">{rank.emoji}</div>
              <h3 className="text-xl md:text-3xl font-display text-gold font-bold">{rank.title}</h3>
           </motion.div>

           <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-dark p-6 md:p-8 rounded-3xl md:rounded-[40px] flex flex-col items-center justify-center">
              <p className="text-white/40 uppercase font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-4">Total Score</p>
              <p className="text-5xl md:text-7xl font-bold flex items-baseline gap-2">
                {totalScore}<span className="text-xl md:text-2xl text-white/20">/35</span>
              </p>
              <p className="text-success font-bold mt-2 text-sm md:text-base">Legendary Climb</p>
           </motion.div>
        </div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 md:mb-12 w-full">
            <blockquote className="text-lg md:text-2xl font-light italic text-white/70 max-w-2xl mx-auto border-l-4 border-gold pl-6 md:pl-8 py-2 md:py-4 text-left md:text-center">
              "The only true limit to your potential is the height of your dreams and the strength of your climb."
            </blockquote>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-gold px-8 py-4 md:px-12 flex items-center justify-center gap-3 text-lg md:text-xl w-full sm:w-auto"
          >
            <RefreshCw /> PLAY AGAIN
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass bg-white/20 px-8 py-4 md:px-12 rounded-full font-bold flex items-center justify-center gap-3 text-lg md:text-xl hover:bg-white/30 transition-all w-full sm:w-auto"
          >
            <Share2 /> SHARE
          </motion.button>
        </div>
      </div>
    </div>
  );
}
