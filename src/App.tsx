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

export default function App() {
  const { gamePhase, playerName, exitToMap, setPhase } = useGameStore();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      // If the player has a saved name (meaning they are returning),
      // we must land them directly on the World Map on refresh.
      if (playerName) {
        if (['climbing', 'transitioning', 'feedback', 'failed', 'summit', 'victory'].includes(gamePhase)) {
           // If they were in the middle of a game, use exitToMap so state is cleaned up/paused
           exitToMap();
        } else if (gamePhase === 'title' || gamePhase === 'welcome' || gamePhase === 'setup') {
           setPhase('worldmap');
        }
      }
    }
  }, [playerName, gamePhase, exitToMap, setPhase]);

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

  return (
    <main className="h-screen w-full bg-sky-night text-white antialiased selection:bg-gold/30 overflow-hidden relative flex flex-col">
      {gamePhase !== 'title' && <Navigation />}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={gamePhase}
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
