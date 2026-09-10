// src/components/screens/TitleScreen.tsx
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import ParticleBackground from '../ui/ParticleBackground';
import Mountain3D from '../game/Mountain3D';
import { GraduationCap, UserCheck, Users, Play, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function TitleScreen() {
  const { setPhase, soundEnabled, toggleSound, playerName, resetGame } = useGameStore();

  const designers = [
    'Syeda Aymal Hassan',
    'Rabia Azmat',
    'Mishkat Shoukat',
    'Sadia Batool',
    'Tooba Ahmed',
  ];

  const handleStart = () => {
    if (soundEnabled) {
      audioService.playStep();
    }
    if (playerName) {
      setPhase('worldmap');
    } else {
      setPhase('welcome');
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between bg-sky-night overflow-y-auto px-4 sm:px-6 py-8 md:py-12 select-none">
      {/* Background Starfield and Mountain */}
      <ParticleBackground type="stars" />
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Mountain3D color="#1a1a3e" />
      </div>

      {/* Floating Sound Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          onClick={toggleSound}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 hover:text-gold transition-all border border-white/10 shadow-lg cursor-pointer"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Top Academic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center mt-2 sm:mt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold/30 text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
          <GraduationCap className="w-4 h-4 text-gold" />
          <span>Academic Project</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display title-gold tracking-widest uppercase mb-2">
          University of Karachi
        </h1>
        <h2 className="text-base sm:text-xl md:text-2xl text-sky-blue/90 font-light tracking-[0.25em] uppercase mb-3">
          Department of Education
        </h2>
        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/15 text-white/80 text-xs sm:text-sm font-medium tracking-wider">
          Class: B.S 3rd year (morning)
        </div>
      </motion.div>

      {/* Middle Cards Section: Project Head & Designers */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 my-6 md:my-8"
      >
        {/* Project Head Card */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/15 flex flex-col items-center text-center justify-center hover:border-gold/40 transition-all shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <UserCheck className="w-7 h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-gold/90 mb-1">
            Project Head
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wide mb-2">
            Sir Maroof Bin Rouf
          </h3>
          <p className="text-xs sm:text-sm text-sky-blue/70">
            Department of Education • University of Karachi
          </p>
        </div>

        {/* Project Designers Card */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/15 flex flex-col items-center hover:border-gold/40 transition-all shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-gold/90 mb-3">
            Project Designers
          </span>
          <div className="w-full flex flex-col gap-2">
            {designers.map((designer, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm sm:text-base font-medium text-white/90"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold/80" />
                  {designer}
                </span>
                <span className="text-xs font-mono text-gold/70">0{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Action: Start Game / Continue Journey CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center mb-2 sm:mb-4"
      >
        {playerName && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-semibold tracking-wider mb-3 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <span>🧗 Welcome back, <strong className="text-white font-bold">{playerName}</strong>!</span>
          </div>
        )}

        <button
          onClick={handleStart}
          className="btn-gold flex items-center gap-3 text-base sm:text-lg md:text-xl px-10 sm:px-14 py-4 md:py-5 uppercase tracking-widest font-bold cursor-pointer"
        >
          <span>{playerName ? 'CONTINUE JOURNEY' : 'START GAME'}</span>
          <Play className="w-5 h-5 fill-current" />
        </button>

        {playerName && (
          <button
            onClick={() => {
              if (soundEnabled) audioService.playStep();
              resetGame();
              setPhase('welcome');
            }}
            className="mt-3 text-xs sm:text-sm text-white/50 hover:text-gold transition-colors underline underline-offset-4 tracking-wider cursor-pointer"
          >
            Start as New Climber
          </button>
        )}

        <p className="text-xs sm:text-sm text-sky-blue/70 mt-3 font-light tracking-wider">
          The Dream Climber • Educational Web Game
        </p>
      </motion.div>
    </div>
  );
}
