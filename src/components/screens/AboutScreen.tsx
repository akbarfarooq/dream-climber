import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Mountain, Users, Lightbulb, User, GraduationCap } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';

export default function AboutScreen() {
  const { goBack, setPhase } = useGameStore();

  return (
    <div className="relative h-full w-full bg-mt-dark p-6 md:p-12 overflow-y-auto pt-10 lg:pt-16 pb-24 lg:pb-32">
      <ParticleBackground type="stars" />
      
      <div className="relative z-10 max-w-4xl mx-auto py-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-display title-gold tracking-widest uppercase">About The Dream Climber</h1>
        </header>

        <div className="space-y-8">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 md:p-10 rounded-[40px] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6 text-gold">
              <Mountain className="w-8 h-8" />
              <h2 className="text-2xl font-bold uppercase tracking-widest">What is this game?</h2>
            </div>
            <p className="text-white/80 leading-relaxed text-lg">
              The Dream Climber is an educational web game designed for students aged 10 to 15. It combines interactive gameplay with real psychological concepts to teach students how their daily decisions affect their journey toward achieving their dreams.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 md:p-10 rounded-[40px] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6 text-gold">
              <User className="w-8 h-8" />
              <h2 className="text-2xl font-bold uppercase tracking-widest">Who made this?</h2>
            </div>
            <p className="text-white/80 leading-relaxed text-lg mb-4">
              Created as part of an educational psychology project at the <strong className="text-gold">University of Karachi, Department of Education</strong> (Class: B.S 3rd year morning).
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <p className="text-white/90 text-base">
                <span className="text-gold font-semibold uppercase tracking-wider">Project Head:</span> Sir Maroof Bin Rouf
              </p>
              <div>
                <p className="text-gold font-semibold uppercase tracking-wider text-base mb-2">Project Designers:</p>
                <div className="flex flex-wrap gap-2">
                  {['Syeda Aymal Hassan', 'Rabia Azmat', 'Mishkat Shoukat', 'Sadia Batool', 'Tooba Ahmed'].map((name, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/15 rounded-xl text-sm font-medium text-white/90">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setPhase('title')}
                  className="inline-flex items-center gap-2 text-sm text-gold hover:text-white underline underline-offset-4 tracking-wider uppercase font-semibold cursor-pointer transition-colors"
                >
                  <GraduationCap className="w-4 h-4" /> View Full University Title Page
                </button>
              </div>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 md:p-10 rounded-[40px] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6 text-gold">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold uppercase tracking-widest">What will you learn?</h2>
            </div>
            <p className="text-white/80 leading-relaxed text-lg">
              Players learn about Maslow's Hierarchy of Needs, Growth Mindset, Self-Efficacy, and Intrinsic Motivation through 7 mountains and 35 real life scenarios.
            </p>
          </motion.section>
        </div>

        <div className="mt-12 text-center pb-24">
          <button 
            onClick={goBack}
            className="inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl btn-gold text-sky-night font-bold transition-all text-lg tracking-widest uppercase"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}
