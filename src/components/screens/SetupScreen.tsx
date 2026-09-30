// src/components/screens/SetupScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { DREAM_OPTIONS } from '../../data/levels';
import { User, Sparkles, ChevronRight } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';

import ClimberCharacter from '../game/ClimberCharacter';

export default function SetupScreen() {
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const setPlayerInfo = useGameStore((state) => state.setPlayerInfo);

  const selectedDream = DREAM_OPTIONS.find(d => d.id === selectedId);

  return (
    <div className="relative h-full w-full flex items-start lg:items-center justify-center bg-mt-dark px-4 md:px-6 py-6 md:py-8 overflow-y-auto">
      <ParticleBackground type="stars" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl glass p-6 md:p-8 lg:p-10 rounded-3xl m-auto my-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Inputs */}
          <div className="flex flex-col gap-6 md:gap-8 text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-display title-gold mb-2 flex items-center gap-2">
                <User className="text-gold" /> WHO IS THE CLIMBER?
              </h2>
              <div className="relative mt-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-lg md:text-xl focus:border-gold outline-none transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-display title-gold mb-2 flex items-center gap-2">
                <Sparkles className="text-gold" /> CHOOSE YOUR DREAM
              </h2>
              <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4">
                {DREAM_OPTIONS.map((dream) => (
                  <motion.button
                    key={dream.id}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedId(dream.id)}
                    className={`relative p-3 md:p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedId === dream.id
                        ? 'border-gold bg-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl md:text-3xl">{dream.icon}</span>
                    <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase">{dream.title}</span>
                    {selectedId === dream.id && (
                      <motion.div 
                        layoutId="selection" 
                        className="absolute inset-0 border-2 border-gold rounded-2xl" 
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="flex-1 flex items-center justify-center py-8">
              <AnimatePresence mode="wait">
                {selectedDream ? (
                  <motion.div
                    key={selectedDream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center flex flex-col items-center"
                  >
                    <div className="mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.3] md:scale-[1.5]">
                      <ClimberCharacter state="celebrate" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2 uppercase tracking-wide">The {selectedDream.title}</h3>
                    <p className="text-white/60 text-sm md:text-base italic">"{name || 'The Climber'}'s path to greatness starts here."</p>
                  </motion.div>
                ) : (
                  <div className="text-center text-white/20 flex flex-col items-center">
                    <div className="mb-6 opacity-30 grayscale scale-125 md:scale-150">
                        <ClimberCharacter state="idle" />
                    </div>
                    <p className="mt-8 text-sm md:text-base uppercase tracking-widest font-bold">Select your dream</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              disabled={!name || !selectedId}
              onClick={() => setPlayerInfo(name, selectedId)}
              whileHover={name && selectedId ? { scale: 1.05 } : {}}
              whileTap={name && selectedId ? { scale: 0.95 } : {}}
              className={`mt-4 w-full py-4 md:py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg ${
                name && selectedId
                  ? 'bg-gold text-sky-night shadow-xl'
                  : 'bg-white/10 text-white/20 cursor-not-allowed'
              }`}
            >
              START CLIMBING <ChevronRight />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
