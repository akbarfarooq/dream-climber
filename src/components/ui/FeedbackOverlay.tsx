// src/components/ui/FeedbackOverlay.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import MountainSVG from '../game/MountainSVG';
import ClimberCharacter from '../game/ClimberCharacter';
import ProgressBar from '../game/ProgressBar';
import { getClimberPosition } from '../../utils/climber';
import { ArrowRight, Trophy, Sparkles, Clock } from 'lucide-react';

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
  const mobileClimbDuration = isSummitCelebration ? 3.5 : 2.5;

  const [phase, setPhase] = useState<'text' | 'mountain'>('text');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [animatedProgress, setAnimatedProgress] = useState(
    lastAnswerCorrect ? correctAnswersCount - 1 : correctAnswersCount
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (lastAnswerCorrect === null) return null;

  const targetPos = getClimberPosition(correctAnswersCount);
  const startPos = lastAnswerCorrect ? getClimberPosition(correctAnswersCount - 1) : targetPos;

  const handleNextClick = () => {
    if (isMobile && isSummitCelebration && phase === 'text') {
      setPhase('mountain');
      setAnimatedProgress(correctAnswersCount);
    } else {
      nextQuestion();
    }
  };

  const renderTextFeedback = () => (
    <motion.div
      key="text-feedback"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed inset-0 lg:left-[40%] z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl overflow-y-auto ${
        timedOut 
          ? 'bg-amber-950/90' 
          : isSummitCelebration 
            ? 'bg-indigo-950/90' 
            : (lastAnswerCorrect ? 'bg-green-950/90' : 'bg-red-950/90')
      }`}
    >
      <div className="max-w-xl w-full flex flex-col items-center text-center my-auto py-6">
        <motion.div
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: timedOut ? [-5, 5, -5, 5, 0] : (lastAnswerCorrect ? 0 : [-10, 10, -10, 10, 0])
          }}
          transition={{ duration: 0.5 }}
          className="text-7xl md:text-8xl mb-4 md:mb-6"
        >
          {timedOut ? '⏱️' : (lastAnswerCorrect ? '✅' : '💡')}
        </motion.div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl md:text-5xl font-display font-bold mb-3 ${
            timedOut 
              ? 'text-amber-300' 
              : (lastAnswerCorrect ? 'text-green-300' : 'text-orange-300')
          }`}
        >
          {timedOut 
            ? "Time's Up! (30s Limit)" 
            : (lastAnswerCorrect ? 'Excellent Choice!' : 'Not Quite Yet!')}
        </motion.h2>

        <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-widest mb-4">
          Challenge {currentQuestionIndex + 1} of 5 Completed
        </p>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.15 }}
           className="glass-dark bg-white/10 p-6 md:p-8 rounded-3xl md:rounded-[36px] border border-white/10 w-full shadow-2xl text-left"
        >
          <div className="mb-4">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50">Outcome</span>
            <p className="text-base md:text-xl text-white mt-1 leading-relaxed font-sans">
              {timedOut 
                ? "30 seconds expired before an option was chosen! You lost 1 life, but keep your focus."
                : (selectedOption?.explanation || (lastAnswerCorrect ? 'You made the right move!' : 'There is a better way to handle this.'))}
            </p>
          </div>

          {!lastAnswerCorrect && correctOption && (
            <div className="mb-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Move
              </span>
              <p className="text-xs md:text-sm text-white/90 font-medium">
                {correctOption.text}
              </p>
            </div>
          )}
          
          <div className="border-t border-white/15 pt-4 mt-4">
            <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-1.5 ${
              timedOut 
                ? 'text-amber-300' 
                : (lastAnswerCorrect ? 'text-green-300' : 'text-orange-300')
            }`}>
               🧠 Psychology Insight
            </p>
            <p className="text-white/85 italic text-sm md:text-base leading-relaxed font-sans">
              {question.psychConcept}
            </p>
          </div>
        </motion.div>

        {/* User-controlled Next Button - No Auto Rush! */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNextClick}
          className={`mt-6 md:mt-8 px-8 md:px-12 py-3.5 md:py-4 rounded-2xl font-bold font-display text-base md:text-lg flex items-center justify-center gap-3 shadow-2xl transition-all uppercase tracking-wider ${
            isSummitCelebration 
              ? 'btn-gold text-sky-night shadow-[0_0_30px_rgba(251,191,36,0.6)]' 
              : 'bg-white text-sky-night hover:bg-gold'
          }`}
        >
          <span>
            {isLastQuestion 
              ? (isSummitCelebration ? 'Conquer Summit' : 'Complete Mountain') 
              : 'Next Challenge'}
          </span>
          {isSummitCelebration ? <Trophy className="w-5 h-5 fill-current" /> : <ArrowRight className="w-5 h-5" />}
        </motion.button>
      </div>
    </motion.div>
  );

  const renderMobileMountain = () => (
    <motion.div
      key="mobile-mountain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[60] bg-sky-night flex flex-col items-center justify-between p-6 lg:hidden"
    >
      {/* Top HUD */}
      <div className="w-full pt-4 flex flex-col items-center gap-3">
        <h2 className="text-xl font-display text-gold uppercase tracking-widest">{mountain.name}</h2>
        <div className="w-64 max-w-full">
           <ProgressBar current={animatedProgress} total={5} color={mountain.color} />
        </div>
      </div>

      <div className="relative w-full h-[50vh] flex items-center justify-center auto-size">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none w-full h-full">
          <MountainSVG index={currentMountainIndex} />
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none w-full h-full">
           <motion.div 
             initial={{ top: `${startPos.y}%`, left: `${startPos.x}%` }}
             animate={isSummitCelebration ? { top: [`${startPos.y}%`, `${startPos.y - 10}%`, `${targetPos.y}%`], left: [`${startPos.x}%`, `${targetPos.x}%`, `${targetPos.x}%`] } : { top: `${targetPos.y}%`, left: `${targetPos.x}%` }}
             transition={isSummitCelebration ? { duration: mobileClimbDuration, ease: "easeOut" } : { duration: mobileClimbDuration, ease: [0.22, 1, 0.36, 1] }}
             className="absolute -translate-x-1/2 translate-y-[-75%]"
           >
              <ClimberCharacter 
                state={isSummitCelebration ? 'celebrate' : (lastAnswerCorrect ? 'celebrate' : 'stumble')} 
                face={isSummitCelebration ? 'victory' : (lastAnswerCorrect ? 'surprised' : 'sad')}
              />
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

           {/* Celebration Text */}
           <AnimatePresence>
             {isSummitCelebration && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.5, y: 50 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ delay: 1.5, type: "spring", bounce: 0.5, duration: 1 }}
                 className="absolute top-[25%] left-1/2 -translate-x-1/2 z-30"
               >
                 <h2 className="text-3xl md:text-5xl font-display font-bold text-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] whitespace-nowrap text-center">
                   SUMMIT<br/>CONQUERED!
                 </h2>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
      
      {/* Explicit Button on Mobile Mountain too */}
      <div className="w-full pb-6 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => nextQuestion()}
          className="btn-gold text-sky-night px-8 py-3.5 rounded-2xl font-bold font-display text-base flex items-center gap-2 shadow-2xl tracking-wider uppercase"
        >
          <span>{isLastQuestion ? 'Go To Summit' : 'Next Challenge'}</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {phase === 'text' && renderTextFeedback()}
      {phase === 'mountain' && isMobile && renderMobileMountain()}
    </AnimatePresence>
  );
}
