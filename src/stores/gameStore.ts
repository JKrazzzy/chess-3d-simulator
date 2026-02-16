import { Chess, Move } from 'chess.js';
import { create } from 'zustand';
import type { AnalysisData, GameState } from '../types';

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  currentMoveIndex: 0,
  moves: [],
  gameHistory: [],
  analysis: null,
  commentatorMessage: "Let's analyze this game!",

  loadPGN: (pgn: string) => {
    const parsedChess = new Chess();
    try {
      parsedChess.loadPgn(pgn);
    } catch {
      return;
    }

    const history = parsedChess.history({ verbose: true }) as Move[];
    parsedChess.reset();

    set({
      chess: parsedChess,
      moves: history.map((move) => move.san),
      gameHistory: history,
      currentMoveIndex: 0,
      analysis: null,
      commentatorMessage: "Game loaded. Let's dive in!",
    });
  },

  goToMove: (index: number) => {
    const { gameHistory } = get();
    const boundedIndex = Math.max(0, Math.min(index, gameHistory.length));
    const chess = new Chess();

    for (let moveIndex = 0; moveIndex < boundedIndex; moveIndex += 1) {
      chess.move(gameHistory[moveIndex]);
    }

    set({ chess, currentMoveIndex: boundedIndex });
  },

  nextMove: () => {
    const { currentMoveIndex, moves } = get();
    if (currentMoveIndex < moves.length) {
      get().goToMove(currentMoveIndex + 1);
    }
  },

  prevMove: () => {
    const { currentMoveIndex } = get();
    if (currentMoveIndex > 0) {
      get().goToMove(currentMoveIndex - 1);
    }
  },

  firstMove: () => get().goToMove(0),

  lastMove: () => {
    const { moves } = get();
    get().goToMove(moves.length);
  },

  updateAnalysis: (analysis: AnalysisData | null) => set({ analysis }),

  setCommentary: (message: string) => set({ commentatorMessage: message }),
}));
