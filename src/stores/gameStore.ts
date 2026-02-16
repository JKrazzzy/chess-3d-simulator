import { Chess, Move } from 'chess.js';
import { create } from 'zustand';
import type { AnalysisData, GameState } from '../types';
import { classifyMoveLoss, uciToSquares } from '../utils/chessHelpers';

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  currentMoveIndex: 0,
  currentPgn: '',
  moves: [],
  gameHistory: [],
  analysis: null,
  moveAnnotations: [],
  bestMoveArrow: null,
  realTimeAnalysisEnabled: true,
  boardTheme: 'classic',
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
      currentPgn: pgn,
      moves: history.map((move) => move.san),
      gameHistory: history,
      currentMoveIndex: 0,
      analysis: null,
      moveAnnotations: [],
      bestMoveArrow: null,
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

  setRealtimeAnalysisEnabled: (enabled: boolean) => set({ realTimeAnalysisEnabled: enabled }),

  setBoardTheme: (theme) => set({ boardTheme: theme }),

  updateAnalysis: (analysis: AnalysisData | null) => {
    if (!analysis) {
      set({ analysis: null, bestMoveArrow: null });
      return;
    }

    const arrow = uciToSquares(analysis.bestMove);
    const { moveAnnotations, gameHistory } = get();

    if (analysis.moveIndex > 0 && analysis.moveIndex <= gameHistory.length) {
      const currentEval = analysis.evaluation;
      const prevEval = moveAnnotations[analysis.moveIndex - 2]?.evaluation ?? 0;
      const moverColor = analysis.moveIndex % 2 === 1 ? 'w' : 'b';
      const rawLoss = moverColor === 'w' ? prevEval - currentEval : currentEval - prevEval;
      const loss = Math.max(0, Number(rawLoss.toFixed(2)));

      get().setMoveAnnotation({
        index: analysis.moveIndex,
        san: gameHistory[analysis.moveIndex - 1]?.san ?? '',
        evaluation: currentEval,
        loss,
        grade: classifyMoveLoss(loss),
      });
    }

    set({
      analysis,
      bestMoveArrow: arrow,
    });
  },

  setMoveAnnotation: (annotation) => {
    set((state) => {
      const next = [...state.moveAnnotations];
      next[annotation.index - 1] = annotation;
      return { moveAnnotations: next };
    });
  },

  setCommentary: (message: string) => set({ commentatorMessage: message }),
}));
