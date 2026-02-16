import { Chess, Move } from 'chess.js';

export interface AnalysisData {
  evaluation: number;
  bestMove: string;
  depth: number;
}

export interface GameState {
  chess: Chess;
  currentMoveIndex: number;
  moves: string[];
  gameHistory: Move[];
  analysis: AnalysisData | null;
  commentatorMessage: string;
  loadPGN: (pgn: string) => void;
  goToMove: (index: number) => void;
  nextMove: () => void;
  prevMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  updateAnalysis: (analysis: AnalysisData | null) => void;
  setCommentary: (message: string) => void;
}
