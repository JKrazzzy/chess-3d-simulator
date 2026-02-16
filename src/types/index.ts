import { Chess, Move } from 'chess.js';

export type BoardTheme = 'classic' | 'marble' | 'neon';

export type MoveGrade = 'best' | 'excellent' | 'inaccuracy' | 'mistake' | 'blunder';

export interface AnalysisData {
  evaluation: number;
  bestMove: string;
  depth: number;
  pv: string[];
  mate?: number;
  moveIndex: number;
}

export interface MoveAnnotation {
  index: number;
  san: string;
  evaluation: number;
  loss: number;
  grade: MoveGrade;
}

export interface BestMoveArrow {
  from: string;
  to: string;
}

export interface SavedGameRecord {
  id: string;
  userId: string;
  pgn: string;
  createdAt?: number;
  white?: string;
  black?: string;
  result?: string;
  accuracy?: number;
}

export interface GameState {
  chess: Chess;
  currentMoveIndex: number;
  currentPgn: string;
  moves: string[];
  gameHistory: Move[];
  analysis: AnalysisData | null;
  moveAnnotations: MoveAnnotation[];
  bestMoveArrow: BestMoveArrow | null;
  realTimeAnalysisEnabled: boolean;
  boardTheme: BoardTheme;
  commentatorMessage: string;
  loadPGN: (pgn: string) => void;
  goToMove: (index: number) => void;
  nextMove: () => void;
  prevMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  setRealtimeAnalysisEnabled: (enabled: boolean) => void;
  setBoardTheme: (theme: BoardTheme) => void;
  updateAnalysis: (analysis: AnalysisData | null) => void;
  setMoveAnnotation: (annotation: MoveAnnotation) => void;
  setCommentary: (message: string) => void;
}
