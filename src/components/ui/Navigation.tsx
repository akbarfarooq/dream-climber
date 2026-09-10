import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Mountain, Info, BookOpen, Brain, Home, LayoutDashboard, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export default function Navigation() {
  const { gamePhase, setPhase, lastAnswerCorrect, isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu, soundEnabled, toggleSound, playerName } = useGameStore();

  const links = [
    { id: 'worldmap', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
    { id: 'how-to-play', label: 'How to Play', icon: BookOpen },
    { id: 'psychology', label: 'Psychology', icon: Brain },
  ];

  const handleNav = (id: any) => {
    setPhase(id);
    setMobileMenuOpen(false);
  };

  const isGameActive = gamePhase === 'climbing' || gamePhase === 'feedback';

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="z-50 hidden lg:flex items-center justify-between px-8 h-20 bg-sky-night border-b border-white/10 shadow-lg shrink-0">
        <div className="flex items-center gap-3 text-gold pointer-events-auto cursor-pointer" onClick={() => handleNav(playerName ? 'worldmap' : 'welcome')}>
          <Mountain className="w-8 h-8" />
          <span className="font-display font-bold text-xl tracking-widest uppercase">The Dream Climber</span>
        </div>
        
        <div className="flex items-center gap-8 pointer-events-auto">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`font-bold tracking-widest uppercase text-sm transition-colors hover:text-gold ${
                gamePhase === link.id ? 'text-gold' : 'text-white/70'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={toggleSound}
            className="text-white/70 hover:text-gold transition-colors ml-4"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Toggle (Hamburger) - Hidden inside GameScreen to avoid overlap */}
      {!isGameActive && !isMobileMenuOpen && (
        <div className="fixed top-4 right-4 z-40 lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-gold transition-colors border border-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-64 bg-mt-dark/95 backdrop-blur-xl z-50 border-l border-white/10 p-6 flex flex-col shadow-2xl lg:hidden"
            >
              {/* Close Button Inside Sidebar */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors z-10"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Sidebar Logo */}
              <div className="pt-2 pb-6 pr-10">
                <div 
                  className="flex items-center gap-3 text-gold pointer-events-auto cursor-pointer" 
                  onClick={() => handleNav(playerName ? 'worldmap' : 'welcome')}
                >
                  <Mountain className="w-8 h-8 shrink-0" />
                  <span className="font-display font-bold text-xl tracking-widest uppercase leading-tight text-left">The Dream Climber</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 w-full mb-8 shrink-0" />

              <div className="flex flex-col gap-8 text-center overflow-y-auto pb-4">
              {links.map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`flex items-center gap-4 text-left font-bold tracking-widest uppercase text-sm transition-colors hover:text-gold ${
                      gamePhase === link.id ? 'text-gold' : 'text-white/70'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={toggleSound}
                className="flex items-center gap-4 text-left font-bold tracking-widest uppercase text-sm transition-colors hover:text-gold text-white/70 mt-2"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
