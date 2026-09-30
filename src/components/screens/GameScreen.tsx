// src/components/screens/GameScreen.tsx
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { mountains } from '../../data/levels';
import { HelpCircle, ShieldAlert, X, Menu, Clock } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import ClimberCharacter from '../game/ClimberCharacter';
import LivesSystem from '../game/LivesSystem';
import ProgressBar from '../game/ProgressBar';
import MoodMeter from '../game/MoodMeter';
import AnswerButton from '../ui/AnswerButton';
import FloatingClouds from '../ui/FloatingClouds';
import MountainSVG from '../game/MountainSVG';
import FeedbackOverlay from '../ui/FeedbackOverlay';
import { getClimberPosition, getExpressionForCount } from '../../utils/climber';
import { audioService } from '../../services/audioService';

export default function GameScreen() {
  const { 
    currentMountainIndex, 
    currentQuestionIndex, 
    lives, 
    submitAnswer,
    mountainScores,
    correctAnswersCount,
    gamePhase,
    lastAnswerCorrect,
    exitToMap,
    toggleMobileMenu,
    soundEnabled
  } = useGameStore();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const mountain = mountains[currentMountainIndex];
  const question = mountain.questions[currentQuestionIndex];
  const currentMountainScore = mountainScores[currentMountainIndex];

  // Shuffle options so correct answer isn't always at A
  const shuffledOptions = useMemo(() => {
    return [...question.options].sort(() => Math.random() - 0.5);
  }, [currentMountainIndex, currentQuestionIndex]);

  // 30-second Countdown Timer
  useEffect(() => {
    if (gamePhase !== 'climbing') return;

    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (soundEnabled) {
            audioService.playWrong();
          }
          submitAnswer(false, true); // Timeout counts as incorrect and loses 1 life
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMountainIndex, currentQuestionIndex, gamePhase, soundEnabled, submitAnswer]);

  // Use the shared utility for climber position
  const climberPos = getClimberPosition(correctAnswersCount);
  const startPos = lastAnswerCorrect ? getClimberPosition(correctAnswersCount - 1) : climberPos;
  
  const isSummitCelebration = gamePhase === 'feedback' && lastAnswerCorrect && correctAnswersCount === 5;

  useEffect(() => {
    if (isSummitCelebration && soundEnabled) {
      audioService.playSummit();
    }
  }, [isSummitCelebration, soundEnabled]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      setShowExitConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col bg-sky-night overflow-hidden isolate">
      
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <FloatingClouds />

        {/* Exit Button - Desktop Only (Mobile uses top bar) */}
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="hidden lg:block absolute lg:top-6 lg:left-[calc(40%+1.5rem)] lg:right-auto z-50 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Exit Confirmation Modal */}
        <AnimatePresence>
        {showExitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-mt-dark border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-2xl font-bold mb-4 font-display text-gold">Exit to World Map?</h3>
              <p className="text-white/70 mb-8 leading-relaxed">Your progress in this level will be saved and you can continue later.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-bold tracking-widest"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    setShowExitConfirm(false);
                    exitToMap();
                  }}
                  className="flex-1 py-3 rounded-xl bg-gold text-sky-night font-bold hover:bg-yellow-400 transition-colors tracking-widest"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Left Side: Mountain Visualization (Hidden on Mobile, 40% Width on Desktop) */}
      <section className="hidden lg:flex lg:basis-auto lg:w-[40%] lg:h-full relative border-r border-white/10 overflow-hidden bg-mt-dark/40 flex-shrink-0 z-10 transition-all">
        {/* Peak info card - Desktop only, top left of mountain */}
        <div className="absolute top-6 left-6 z-30 hidden lg:block w-48">
           <div className="glass px-4 py-3 rounded-2xl border-l-[3px] border-gold bg-mt-dark/40 backdrop-blur-sm pointer-events-none">
              <p className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">Peak {currentMountainIndex + 1}</p>
              <h2 className="text-base font-display text-gold leading-tight truncate">{mountain.name}</h2>
              <div className="mt-2 w-full">
                 <ProgressBar current={correctAnswersCount} total={5} color={mountain.color} />
              </div>
           </div>
        </div>

        <div className="absolute inset-0">
          <MountainSVG index={currentMountainIndex} />
        </div>
        
        {/* Climber on the mountain face */}
        <div className="absolute inset-0 z-20 pointer-events-none">
           <motion.div 
             key={`climber-${currentMountainIndex}`}
             initial={{ top: `${startPos.y}%`, left: `${startPos.x}%` }}
             animate={isSummitCelebration ? { top: [`${startPos.y}%`, `${startPos.y - 10}%`, `${climberPos.y}%`], left: [`${startPos.x}%`, `${climberPos.x}%`, `${climberPos.x}%`] } : { top: `${climberPos.y}%`, left: `${climberPos.x}%` }}
             transition={correctAnswersCount === 0 ? { duration: 0 } : (isSummitCelebration ? { duration: 1.5, ease: "easeOut" } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] })}
             className="absolute -translate-x-1/2 -translate-y-[75%]"
           >
              <ClimberCharacter 
                state={
                  gamePhase === 'feedback' 
                    ? (isSummitCelebration ? 'celebrate' : (lastAnswerCorrect ? 'celebrate' : 'stumble'))
                    : 'think'
                } 
                face={
                  gamePhase === 'feedback'
                    ? (isSummitCelebration ? 'victory' : (lastAnswerCorrect ? 'surprised' : 'sad'))
                    : getExpressionForCount(correctAnswersCount)
                }
              />

              {/* Floating Text Animations */}
              <AnimatePresence>
                {gamePhase === 'feedback' && !isSummitCelebration && (
                  <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -60, opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-xl drop-shadow-md ${
                      lastAnswerCorrect ? 'text-success' : 'text-sunrise'
                    }`}
                  >
                    {lastAnswerCorrect ? '+1 Step!' : 'Stay Strong!'}
                  </motion.div>
                )}
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
                 <h2 className="text-4xl md:text-5xl font-display font-bold text-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] whitespace-nowrap text-center">
                   SUMMIT<br/>CONQUERED!
                 </h2>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </section>

      {/* Right Side: Quiz UI (Full Width on Mobile) */}
      <section className="flex-1 lg:basis-auto lg:w-[60%] h-full bg-mt-dark/20 backdrop-blur-sm relative z-20 overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Mobile Top Bar (Hidden on Desktop) */}
        <div className="lg:hidden w-full px-4 py-2.5 flex flex-row items-center justify-between border-b border-white/10 shrink-0 sticky top-0 z-30 bg-sky-night/95 backdrop-blur-xl">
          {/* LEFT SECTION */}
          <div className="flex items-center flex-1 min-w-0 pr-2">
             <div className="min-w-0 flex-1">
               <h2 className="text-[10px] sm:text-xs font-display text-gold leading-tight uppercase tracking-widest">{mountain.name}</h2>
               <div className="mt-1 w-full max-w-[120px]">
                  <ProgressBar current={correctAnswersCount} total={5} color={mountain.color} />
               </div>
             </div>
          </div>

          {/* MIDDLE SECTION: LIVES */}
          <div className="shrink-0 flex justify-center items-center px-3 border-l border-white/10">
            <div className="scale-75 origin-center">
               <LivesSystem lives={lives} />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="shrink-0 pl-2 border-l border-white/10 flex justify-end">
            <button
               onClick={toggleMobileMenu}
               className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-gold transition-colors"
            >
               <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full p-4 md:p-8 lg:p-10 py-4 lg:py-6 lg:m-auto">
           <header className="mb-4 lg:mb-8 flex justify-between items-end border-b border-white/10 pb-4 lg:pb-6 gap-4">
              <div>
                 <p className="text-sky-blue font-bold text-[10px] lg:text-xs mb-1 uppercase tracking-widest">{mountain.maslowStage}</p>
                 <h3 className="text-2xl lg:text-4xl font-display font-medium tracking-tight shrink-0">Challenge {currentQuestionIndex + 1} <span className="text-white/20 text-xl lg:text-2xl">/ 5</span></h3>
              </div>
              
              <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                 {/* Desktop Timer Badge */}
                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                   timeLeft <= 5 
                     ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse scale-105' 
                     : timeLeft <= 10 
                       ? 'bg-amber-500/15 border-amber-500/50 text-amber-400' 
                       : 'bg-white/5 border-white/15 text-sky-light'
                 }`}>
                   <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-400' : 'text-gold'}`} />
                   <span className="font-mono font-bold text-sm lg:text-base tracking-wider">{timeLeft}s</span>
                 </div>

                 <div className="hidden lg:flex items-center gap-6 shrink-0">
                    <LivesSystem lives={lives} />
                    <MoodMeter score={correctAnswersCount} />
                 </div>
              </div>
              
              <div className="lg:hidden text-white/10 font-display text-3xl md:text-4xl shrink-0">Q.{currentQuestionIndex + 1}</div>
           </header>

           {/* 30-Second Animated Progress Bar */}
           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
             <div 
               className={`h-full transition-all duration-1000 ease-linear ${
                 timeLeft <= 5 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : timeLeft <= 10 ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-gold shadow-[0_0_8px_#fbbf24]'
               }`}
               style={{ width: `${(timeLeft / 30) * 100}%` }}
             />
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={currentQuestionIndex+mountain.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="glass-dark p-6 lg:p-10 rounded-2xl lg:rounded-[40px] mb-6 lg:mb-8 relative border border-white/10 shadow-2xl"
             >
                <p className="text-lg lg:text-2xl md:text-3xl font-medium leading-relaxed font-sans">{question.scenario}</p>
                
                <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-10 h-10 lg:w-14 lg:h-14 bg-linear-to-br from-gold to-sunrise rounded-xl lg:rounded-2xl flex items-center justify-center text-sky-night shadow-xl rotate-[-10deg]">
                   <HelpCircle className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
             </motion.div>
           </AnimatePresence>

           <div className="flex flex-col gap-3 lg:gap-4">
              {shuffledOptions.map((option, idx) => (
                <AnswerButton
                  key={idx}
                  label={String.fromCharCode(65 + idx)}
                  text={option.text}
                  onClick={() => {
                     if (gamePhase === 'climbing') {
                        if (soundEnabled) {
                           if (option.correct) {
                              audioService.playCorrect();
                              setTimeout(() => audioService.playStep(), 500);
                           } else {
                              audioService.playWrong();
                           }
                        }
                        submitAnswer(option.correct, false);
                     }
                  }}
                  className={gamePhase !== 'climbing' ? 'opacity-50 cursor-not-allowed' : ''}
                />
              ))}
           </div>

           <div className="hidden lg:flex mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 items-center gap-4 text-white/40 text-sm">
              <div className="p-2 bg-sky-blue/20 rounded-lg text-sky-blue shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <p className="font-medium italic leading-snug">Psychology Focus: {mountain.questions[currentQuestionIndex].psychConcept}</p>
           </div>
        </div>
      </section>
      </div>

      <AnimatePresence>
        {gamePhase === 'feedback' && <FeedbackOverlay />}
      </AnimatePresence>
    </div>
  );
}
