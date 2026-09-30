// src/components/ui/FeedbackOverlay.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import MountainSVG from '../game/MountainSVG';
import ClimberCharacter from '../game/ClimberCharacter';
import ProgressBar from '../game/ProgressBar';
import { getClimberPosition } from '../../utils/climber';
import { ArrowRight, Trophy, Sparkles, BookOpen } from 'lucide-react';

export default function FeedbackOverlay() {
  const { 
    currentMountainIndex, 
    currentQuestionIndex, 
    lastAnswerCorrect, 
    timedOut,
    correctAnswersCount,
    nextQuestion 
  } = useGameStore();

  const mountain = mountains[currentMountainIndex];
  const question = mountain.questions[currentQuestionIndex];
  
  // Find the selected option / correct option
  const correctOption = question.options.find(o => o.correct);
  const selectedOption = question.options.find(o => o.correct === lastAnswerCorrect);

  const isLastQuestion = currentQuestionIndex >= 4;
  const isSummitCelebration = lastAnswerCorrect && correctAnswersCount === 5;
  const mobileClimbDuration = isSummitCelebration ? 2.5 : 1.4;

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  
  // On mobile: start by showing the mountain climb, then transition to insight
  const [phase, setPhase] = useState<'mountain' | 'text'>(
    typeof window !== 'undefined' && window.innerWidth < 1024 ? 'mountain' : 'text'
  );

  const [animatedProgress, setAnimatedProgress] = useState(
    lastAnswerCorrect ? Math.max(0, correctAnswersCount - 1) : correctAnswersCount
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth automatic transition from mountain climb to insight
  useEffect(() => {
    if (isMobile && phase === 'mountain') {
      const progressTimer = setTimeout(() => {
        setAnimatedProgress(correctAnswersCount);
      }, 250);

      // Once the climber animation completes smoothly, slide up the insight
      const autoMoveTimer = setTimeout(() => {
        setPhase('text');
      }, isSummitCelebration ? 2900 : 2000);

      return () => {
        clearTimeout(progressTimer);
        clearTimeout(autoMoveTimer);
      };
    }
  }, [isMobile, phase, correctAnswersCount, isSummitCelebration]);

  if (lastAnswerCorrect === null) return null;

  const targetPos = getClimberPosition(correctAnswersCount);
  const startPos = lastAnswerCorrect ? getClimberPosition(Math.max(0, correctAnswersCount - 1)) : targetPos;

  // The Psychology Insight Card (used for both Mobile and Desktop)
  const renderInsightContent = () => (
    <motion.div
      initial={{ y: 25, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 25, opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", damping: 25, stiffness: 260 }}
      className="max-w-lg w-full flex flex-col items-center text-center m-auto py-2 px-3"
    >
      <motion.div
        animate={{ 
          scale: [0, 1.15, 1],
          rotate: timedOut ? [-5, 5, -5, 5, 0] : (lastAnswerCorrect ? 0 : [-8, 8, -8, 8, 0])
        }}
        transition={{ duration: 0.35 }}
        className="text-5xl md:text-6xl mb-1.5 md:mb-2"
      >
        {timedOut ? '⏱️' : (lastAnswerCorrect ? '✅' : '💡')}
      </motion.div>

      <motion.h2 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-2xl md:text-3xl font-display font-bold mb-1 ${
          timedOut 
            ? 'text-amber-300' 
            : (lastAnswerCorrect ? 'text-green-300' : 'text-orange-300')
        }`}
      >
        {timedOut 
          ? "Time's Up! (30s Limit)" 
          : (lastAnswerCorrect ? 'Excellent Choice!' : 'Not Quite Yet!')}
      </motion.h2>

      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2.5">
        Challenge {currentQuestionIndex + 1} of 5 Completed
      </p>

      <div className="glass-dark bg-mt-dark/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/15 w-full shadow-2xl text-left">
        <div className="mb-3">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50">Outcome</span>
          <p className="text-xs md:text-sm text-white mt-0.5 leading-relaxed font-sans">
            {timedOut 
              ? "30 seconds expired before an option was chosen! 1 life was lost, but keep your focus."
              : (selectedOption?.explanation || (lastAnswerCorrect ? 'You made the right move!' : 'There is a better way to handle this.'))}
          </p>
        </div>

        {!lastAnswerCorrect && correctOption && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3 h-3" /> Recommended Move
            </span>
            <p className="text-xs text-white/90 font-medium leading-snug">
              {correctOption.text}
            </p>
          </div>
        )}
        
        <div className="border-t border-white/15 pt-2.5 mt-2.5">
          <p className={`text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] mb-1 ${
            timedOut 
              ? 'text-amber-300' 
              : (lastAnswerCorrect ? 'text-green-300' : 'text-orange-300')
          }`}>
             🧠 Psychology Insight
          </p>
          <p className="text-white/85 italic text-xs md:text-sm leading-relaxed font-sans">
            {question.psychConcept}
          </p>
        </div>
      </div>

      {/* Manual Action Button - User drives to next question */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => nextQuestion()}
        className={`mt-3.5 md:mt-5 px-8 md:px-10 py-3 rounded-xl font-bold font-display text-xs md:text-sm flex items-center justify-center gap-2.5 shadow-2xl transition-all uppercase tracking-wider ${
          isSummitCelebration 
            ? 'btn-gold text-sky-night shadow-[0_0_25px_rgba(251,191,36,0.6)]' 
            : 'bg-white text-sky-night hover:bg-gold'
        }`}
      >
        <span>
          {isLastQuestion 
            ? (isSummitCelebration ? 'Conquer Summit' : 'Complete Mountain') 
            : 'Next Challenge'}
        </span>
        {isSummitCelebration ? <Trophy className="w-4 h-4 fill-current" /> : <ArrowRight className="w-4 h-4" />}
      </motion.button>
    </motion.div>
  );

  // If on Mobile:
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-sky-night flex flex-col items-center justify-between overflow-hidden"
      >
        {/* Persistent Mountain Backdrop */}
        <div className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-500 ${
          phase === 'text' ? 'blur-sm scale-95 opacity-35' : 'opacity-100 scale-100'
        }`}>
          {/* Top HUD */}
          <div className="w-full pt-2 flex flex-col items-center gap-2 z-10">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              Challenge {currentQuestionIndex + 1} Result
            </span>
            <h2 className="text-xl font-display text-gold uppercase tracking-widest">{mountain.name}</h2>
            <div className="w-64 max-w-full">
               <ProgressBar current={animatedProgress} total={5} color={mountain.color} />
            </div>
          </div>

          {/* Mountain & Climber Face */}
          <div className="relative w-full h-[52vh] flex items-center justify-center auto-size">
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none w-full h-full">
              <MountainSVG index={currentMountainIndex} />
            </div>
            
            <div className="absolute inset-0 z-10 pointer-events-none w-full h-full">
               <motion.div 
                 initial={{ top: `${startPos.y}%`, left: `${startPos.x}%` }}
                 animate={isSummitCelebration 
                   ? { top: [`${startPos.y}%`, `${startPos.y - 10}%`, `${targetPos.y}%`], left: [`${startPos.x}%`, `${targetPos.x}%`, `${targetPos.x}%`] } 
                   : { top: `${targetPos.y}%`, left: `${targetPos.x}%` }
                 }
                 transition={isSummitCelebration ? { duration: mobileClimbDuration, ease: "easeOut" } : { duration: mobileClimbDuration, ease: [0.22, 1, 0.36, 1] }}
                 className="absolute -translate-x-1/2 translate-y-[-75%]"
               >
                  <ClimberCharacter 
                    state={isSummitCelebration ? 'celebrate' : (lastAnswerCorrect ? 'celebrate' : 'stumble')} 
                    face={isSummitCelebration ? 'victory' : (lastAnswerCorrect ? 'surprised' : 'sad')}
                  />

                  {/* Floating Result Badge */}
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -45, opacity: [0, 1, 1, 0.9] }}
                      transition={{ duration: 1.4 }}
                      className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-xs drop-shadow-md px-3 py-1 rounded-full ${
                        lastAnswerCorrect 
                          ? 'text-green-300 bg-green-950/80 border border-green-500/50' 
                          : (timedOut 
                              ? 'text-amber-300 bg-amber-950/80 border border-amber-500/50' 
                              : 'text-orange-300 bg-orange-950/80 border border-orange-500/50')
                      }`}
                    >
                      {lastAnswerCorrect ? '+1 Step Forward!' : (timedOut ? "Time's Up!" : 'Stay Strong!')}
                    </motion.div>
                  </AnimatePresence>
               </motion.div>
               
               {/* Particles */}
               {isSummitCelebration && (
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute top-[10%] left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none"
                 >
                   {[...Array(12)].map((_, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                       animate={{ 
                         opacity: [0, 1, 0], 
                         scale: [0.5, 1.5, 0.5], 
                         x: Math.cos((i * 30 * Math.PI) / 180) * 100, 
                         y: Math.sin((i * 30 * Math.PI) / 180) * 100 
                       }}
                       transition={{ duration: 2, delay: 1.2, repeat: Infinity }}
                       className="absolute top-1/2 left-1/2 w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_#fbbf24]"
                     />
                   ))}
                 </motion.div>
               )}

               {/* Celebration Summit Text */}
               <AnimatePresence>
                 {isSummitCelebration && (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.5, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ delay: 1.2, type: "spring", bounce: 0.5, duration: 1 }}
                     className="absolute top-[20%] left-1/2 -translate-x-1/2 z-30"
                   >
                     <h2 className="text-3xl md:text-5xl font-display font-bold text-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] whitespace-nowrap text-center">
                       SUMMIT<br/>CONQUERED!
                     </h2>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
          
          {/* Quick Transition button (during climb) */}
          <div className="w-full pb-4 flex flex-col items-center gap-1.5 z-10">
            <button
              onClick={() => setPhase('text')}
              className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 py-2 px-4 rounded-full bg-white/5 border border-white/10 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Psychology Insight</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Smooth Glassmorphic Insight Overlay on Mobile */}
        <AnimatePresence>
          {phase === 'text' && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.35 }}
              className={`absolute inset-0 z-20 flex items-center justify-center p-4 overflow-y-auto ${
                timedOut 
                  ? 'bg-amber-950/80' 
                  : isSummitCelebration 
                    ? 'bg-indigo-950/85' 
                    : (lastAnswerCorrect ? 'bg-green-950/85' : 'bg-red-950/85')
              }`}
            >
              {renderInsightContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Desktop Flow: positioned below the 80px (top-20) navbar on the right 60% side
  return (
    <motion.div
      key="text-feedback-desktop"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed top-20 bottom-0 right-0 left-0 lg:left-[40%] z-40 flex items-center justify-center p-4 md:p-6 backdrop-blur-xl overflow-y-auto ${
        timedOut 
          ? 'bg-amber-950/90' 
          : isSummitCelebration 
            ? 'bg-indigo-950/90' 
            : (lastAnswerCorrect ? 'bg-green-950/90' : 'bg-red-950/90')
      }`}
    >
      {renderInsightContent()}
    </motion.div>
  );
}
