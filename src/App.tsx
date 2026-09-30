/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';

// Screens
import TitleScreen from './components/screens/TitleScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import SetupScreen from './components/screens/SetupScreen';
import WorldMapScreen from './components/screens/WorldMapScreen';
import GameScreen from './components/screens/GameScreen';
import TransitionScreen from './components/screens/TransitionScreen';
import FailScreen from './components/screens/FailScreen';
import SummitScreen from './components/screens/SummitScreen';
import VictoryScreen from './components/screens/VictoryScreen';
import AboutScreen from './components/screens/AboutScreen';
import HowToPlayScreen from './components/screens/HowToPlayScreen';
import PsychologyScreen from './components/screens/PsychologyScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import Navigation from './components/ui/Navigation';

const SESSION_KEY = 'dream_climber_session_active';

export default function App() {
  const { gamePhase, playerName, setPhase } = useGameStore();
  const isInitialLoad = useRef(true);

  // Initial session check:
  // 1. If this is a page refresh in the same browser tab, sessionStorage is active:
  //    -> Keep user exactly where they are (answering question, climbing, worldmap, etc.)
  // 2. If this is a fresh visit (user clicked website link / new tab / new window):
  //    -> Always show the University Title Page first!
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      const hadSession = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true';

      if (!hadSession) {
        // Fresh visit / opening website link
        sessionStorage.setItem(SESSION_KEY, 'true');

        const hash = window.location.hash.toLowerCase();
        if (hash.includes('about')) {
          setPhase('about');
        } else if (hash.includes('how-to-play')) {
          setPhase('how-to-play');
        } else if (hash.includes('psychology')) {
          setPhase('psychology');
        } else if (hash.includes('dashboard') && playerName) {
          setPhase('dashboard');
        } else {
          // By default, every fresh visit opens the University Title Page!
          setPhase('title');
        }
      }
      // If hadSession === true, it's a page refresh! We preserve current gamePhase, question, and progress!
    }
  }, [playerName, setPhase]);

  // Sync URL hash with gamePhase so users have direct address links
  useEffect(() => {
    const phaseToHash: Record<string, string> = {
      title: '#/title',
      welcome: '#/welcome',
      setup: '#/setup',
      worldmap: '#/worldmap',
      climbing: '#/game',
      feedback: '#/game',
      transitioning: '#/game',
      failed: '#/game-over',
      summit: '#/summit',
      victory: '#/victory',
      about: '#/about',
      'how-to-play': '#/how-to-play',
      psychology: '#/psychology',
      dashboard: '#/dashboard',
    };

    const targetHash = phaseToHash[gamePhase];
    if (targetHash && window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [gamePhase]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('title')) setPhase('title');
      else if (hash.includes('welcome')) setPhase('welcome');
      else if (hash.includes('setup')) setPhase('setup');
      else if (hash.includes('worldmap') && playerName) setPhase('worldmap');
      else if (hash.includes('about')) setPhase('about');
      else if (hash.includes('how-to-play')) setPhase('how-to-play');
      else if (hash.includes('psychology')) setPhase('psychology');
      else if (hash.includes('dashboard') && playerName) setPhase('dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [playerName, setPhase]);

  const renderScreen = () => {
    switch (gamePhase) {
      case 'title':
        return <TitleScreen key="title" />;
      case 'welcome':
        return <WelcomeScreen key="welcome" />;
      case 'setup':
        return <SetupScreen key="setup" />;
      case 'worldmap':
        return <WorldMapScreen key="worldmap" />;
      case 'transitioning':
        return <TransitionScreen key="transitioning" />;
      case 'climbing':
      case 'feedback':
        return <GameScreen key="climbing" />;
      case 'failed':
        return <FailScreen key="failed" />;
      case 'summit':
        return <SummitScreen key="summit" />;
      case 'victory':
        return <VictoryScreen key="victory" />;
      case 'about':
        return <AboutScreen key="about" />;
      case 'how-to-play':
        return <HowToPlayScreen key="how-to-play" />;
      case 'psychology':
        return <PsychologyScreen key="psychology" />;
      case 'dashboard':
        return <DashboardScreen key="dashboard" />;
      default:
        return <WelcomeScreen key="default" />;
    }
  };

  const getScreenKey = () => {
    if (gamePhase === 'climbing' || gamePhase === 'feedback') {
      return 'game';
    }
    return gamePhase;
  };

  return (
    <main className="h-screen w-full bg-sky-night text-white antialiased selection:bg-gold/30 overflow-hidden relative flex flex-col">
      {gamePhase !== 'title' && <Navigation />}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={getScreenKey()}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
