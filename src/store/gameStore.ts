// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GamePhase = 'title' | 'welcome' | 'setup' | 'worldmap' | 'transitioning' | 'climbing' | 'feedback' | 'failed' | 'summit' | 'victory' | 'about' | 'how-to-play' | 'psychology' | 'dashboard';

interface GameState {
  playerName: string;
  selectedDream: string;
  currentMountainIndex: number;
  currentQuestionIndex: number;
  correctAnswersCount: number; // For climber movement tracking
  lives: number;
  mountainScores: number[];
  totalScore: number;
  gamePhase: GamePhase;
  previousPhase: GamePhase | null;
  lastAnswerCorrect: boolean | null;
  completedMountains: number[];
  isMobileMenuOpen: boolean;
  inProgress: {
    mountainIndex: number;
    questionIndex: number;
    correctAnswersCount: number;
    lives: number;
  } | null;
  soundEnabled: boolean;
  
  // Actions
  setPlayerInfo: (name: string, dream: string) => void;
  setPhase: (phase: GamePhase) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleSound: () => void;
  goBack: () => void;
  startMountain: (index: number) => void;
  continueMountain: () => void;
  exitToMap: () => void;
  submitAnswer: (correct: boolean) => void;
  nextQuestion: () => void;
  retryMountain: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      selectedDream: '',
      currentMountainIndex: 0,
      currentQuestionIndex: 0,
      correctAnswersCount: 0,
      lives: 3,
      mountainScores: Array(7).fill(0),
      totalScore: 0,
      gamePhase: 'title',
      previousPhase: null,
      lastAnswerCorrect: null,
      completedMountains: [],
      isMobileMenuOpen: false,
      inProgress: null,
      soundEnabled: true,

      setPlayerInfo: (name, dream) => set({ playerName: name, selectedDream: dream, gamePhase: 'worldmap' }),
      
      setPhase: (phase) => set((state) => {
        const staticPages: GamePhase[] = ['about', 'how-to-play', 'psychology', 'dashboard', 'title'];
        const isCurrentStatic = staticPages.includes(state.gamePhase);
        
        const isGameActive = state.gamePhase === 'climbing' || state.gamePhase === 'feedback';
        let newInProgress = state.inProgress;
        
        if (isGameActive && phase !== 'climbing' && phase !== 'feedback' && phase !== 'failed' && phase !== 'summit' && phase !== 'victory') {
           newInProgress = {
              mountainIndex: state.currentMountainIndex,
              questionIndex: state.currentQuestionIndex,
              correctAnswersCount: state.correctAnswersCount,
              lives: state.lives
           };
        }

        return { 
          previousPhase: isCurrentStatic ? state.previousPhase : state.gamePhase,
          gamePhase: phase,
          inProgress: newInProgress
        };
      }),

      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      goBack: () => set((state) => ({
        gamePhase: state.previousPhase || 'worldmap',
        previousPhase: null
      })),

      startMountain: (index) => set((state) => {
        return {
          currentMountainIndex: index,
          currentQuestionIndex: 0,
          correctAnswersCount: 0,
          lives: 3,
          gamePhase: 'transitioning',
          lastAnswerCorrect: null,
          inProgress: null
        };
      }),

      continueMountain: () => set((state) => {
        if (!state.inProgress) return state;
        return {
          currentMountainIndex: state.inProgress.mountainIndex,
          currentQuestionIndex: state.inProgress.questionIndex,
          correctAnswersCount: state.inProgress.correctAnswersCount,
          lives: state.inProgress.lives,
          gamePhase: 'climbing',
          lastAnswerCorrect: null,
          inProgress: null
        };
      }),

      exitToMap: () => set((state) => ({
        inProgress: {
          mountainIndex: state.currentMountainIndex,
          questionIndex: state.currentQuestionIndex,
          correctAnswersCount: state.correctAnswersCount,
          lives: state.lives
        },
        gamePhase: 'worldmap'
      })),

      retryMountain: () => set((state) => ({
        currentQuestionIndex: 0,
        correctAnswersCount: 0,
        lives: 3,
        gamePhase: 'climbing',
        lastAnswerCorrect: null,
        inProgress: null
      })),

      submitAnswer: (correct) => set((state) => {
        const newLives = correct ? state.lives : state.lives - 1;
        const newMountainScores = [...state.mountainScores];
        const newCorrectCount = state.correctAnswersCount + (correct ? 1 : 0);
        
        if (correct) {
          newMountainScores[state.currentMountainIndex] = Math.max(state.mountainScores[state.currentMountainIndex], newCorrectCount);
        }
        
        const nextPhase = newLives === 0 ? 'failed' : 'feedback';
        
        return {
          lives: newLives,
          lastAnswerCorrect: correct,
          correctAnswersCount: newCorrectCount,
          mountainScores: newMountainScores,
          totalScore: state.totalScore + (correct ? 1 : 0),
          gamePhase: nextPhase
        };
      }),

      nextQuestion: () => set((state) => {
        const isMountainComplete = state.currentQuestionIndex >= 4; 
        
        if (isMountainComplete) {
          if (state.lives <= 0) return { gamePhase: 'failed', inProgress: null };
          
          const isLastMountain = state.currentMountainIndex === 6;
          if (isLastMountain) {
            return { gamePhase: 'victory', inProgress: null };
          }
          
          const newCompleted = state.completedMountains.includes(state.currentMountainIndex + 1) 
            ? state.completedMountains 
            : [...state.completedMountains, state.currentMountainIndex + 1];

          return { 
            gamePhase: 'summit',
            completedMountains: newCompleted,
            inProgress: null
          };
        }

        return {
          currentQuestionIndex: state.currentQuestionIndex + 1,
          gamePhase: 'climbing',
          lastAnswerCorrect: null
        };
      }),

      resetGame: () => set({
        playerName: '',
        selectedDream: '',
        currentMountainIndex: 0,
        currentQuestionIndex: 0,
        correctAnswersCount: 0,
        lives: 3,
        mountainScores: Array(7).fill(0),
        totalScore: 0,
        gamePhase: 'title',
        previousPhase: null,
        lastAnswerCorrect: null,
        completedMountains: [],
        isMobileMenuOpen: false,
        inProgress: null
      })
    }),
    {
      name: 'dream-climber-storage',
    }
  )
);
