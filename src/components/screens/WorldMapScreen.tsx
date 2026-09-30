// src/components/screens/WorldMapScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import { Lock, CheckCircle2, Play, Trophy, Clock, RotateCcw } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';

export default function WorldMapScreen() {
  const { mountainScores, totalScore, startMountain, continueMountain, inProgress, resetGame, completedMountains } = useGameStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isMountainLocked = (index: number) => {
    if (index === 0) return false;
    // Unlock if previous mountain has at least 3 correct answers (Summit requirement)
    return mountainScores[index - 1] < 3;
  };

  const allCompleted = mountainScores[6] >= 3;

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className="relative h-full w-full bg-mt-dark p-4 md:p-8 overflow-y-auto pt-6 lg:pt-8 pb-16 lg:pb-24">
      <ParticleBackground type="stars" />
      
      <div className="relative z-10 max-w-7xl mx-auto py-6">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display title-gold tracking-widest uppercase">WORLD MAP</h1>
            <p className="text-sky-blue/60 tracking-wider font-bold">CHOOSE YOUR NEXT SUMMIT</p>
          </div>
          <div className="glass px-8 py-4 rounded-3xl flex items-center gap-4 border border-white/10 bg-white/5">
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Total Summit Score</p>
              <p className="text-2xl font-bold">{totalScore} <span className="text-white/20 text-sm">EXP</span></p>
            </div>
            <Trophy className="text-gold w-10 h-10" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mountains.map((mountain, i) => {
            const locked = isMountainLocked(i);
            const score = mountainScores[i];
            const completed = score >= 3;
            const mastered = score === 5;
            const isCurrentlyInProgress = inProgress?.mountainIndex === i;

            return (
              <motion.div
                key={mountain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={!locked ? { y: -10 } : {}}
                className={`relative group rounded-[40px] p-8 h-80 flex flex-col justify-between transition-all overflow-hidden border-2 shadow-2xl ${
                  locked ? 'bg-black/40 border-white/5 opacity-60' : 
                  completed ? 'bg-gold/5 border-gold/40' :
                  'glass border-white/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl font-display text-white/10">0{i + 1}</span>
                    {locked ? <Lock className="w-5 h-5 text-white/20" /> : 
                     isCurrentlyInProgress ? <Clock className="w-6 h-6 text-sky-blue" /> :
                     mastered ? <Trophy className="w-6 h-6 text-gold" /> :
                     completed ? <CheckCircle2 className="w-6 h-6 text-success" /> : 
                     <div className="w-3 h-3 rounded-full bg-sky-blue animate-ping" />}
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mb-1">{mountain.name}</h3>
                  <p className="text-xs text-sky-light font-bold uppercase tracking-widest">{mountain.maslowStage}</p>
                </div>

                {!locked ? (
                  <button
                    onClick={() => isCurrentlyInProgress ? continueMountain() : startMountain(i)}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                      isCurrentlyInProgress ? 'bg-sky-blue text-white hover:bg-sky-blue/80' :
                      completed ? 'bg-white/10 text-white hover:bg-gold hover:text-sky-night' : 'btn-gold text-sky-night'
                    }`}
                  >
                    {isCurrentlyInProgress ? `CONTINUE FROM Q${inProgress.questionIndex + 1}` : (score > 0 ? 'RECLIMB' : 'SUMMIT')} <Play className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <div className="text-center py-4 text-white/20 text-sm font-bold tracking-[0.3em]">LOCKED</div>
                )}
                
                {/* Score dots */}
                {!locked && score > 0 && !isCurrentlyInProgress && (
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: 5 }).map((_, dotIdx) => (
                      <div 
                        key={dotIdx}
                        className={`h-1.5 flex-1 rounded-full ${dotIdx < score ? 'bg-gold' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Progress text and dots if in progress */}
                {!locked && isCurrentlyInProgress && (
                  <div className="mt-4 text-center">
                    <p className="text-xs font-bold text-sky-blue uppercase tracking-widest mb-2">Question {inProgress.questionIndex + 1} of 5</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, dotIdx) => (
                        <div 
                          key={dotIdx}
                          className={`h-1.5 flex-1 rounded-full ${dotIdx < inProgress.questionIndex ? 'bg-sky-blue/50' : dotIdx === inProgress.questionIndex ? 'bg-sky-blue animate-pulse' : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* PLAY AGAIN BUTTON (Only shows when all 7 mountains are completed) */}
        {allCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex justify-center pb-8"
          >
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-3 px-8 py-5 rounded-full font-display font-bold tracking-widest text-lg transition-all bg-white/5 border-2 border-white/20 text-white hover:bg-gold hover:text-sky-night hover:border-gold shadow-2xl"
            >
              <RotateCcw className="w-6 h-6" />
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sky-night/95 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass max-w-sm w-full p-8 rounded-3xl border-2 border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <RotateCcw className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Are you sure?</h2>
              <p className="text-sky-blue/80 mb-8 leading-relaxed">
                This will reset all your progress and start the game from the beginning.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleReset}
                  className="w-full py-4 rounded-xl font-bold bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all tracking-widest font-display"
                >
                  YES, RESET
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 rounded-xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all tracking-widest font-display border border-white/10"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
