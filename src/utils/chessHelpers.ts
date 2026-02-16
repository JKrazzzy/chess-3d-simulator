import { Chess, Move } from 'chess.js';
import type { MoveGrade } from '../types';

export function buildPositionFromHistory(history: Move[], index: number): Chess {
  const chess = new Chess();
  const boundedIndex = Math.max(0, Math.min(index, history.length));

  for (let moveIndex = 0; moveIndex < boundedIndex; moveIndex += 1) {
    chess.move(history[moveIndex]);
  }

  return chess;
}

export function safeLoadPgn(pgn: string): { chess: Chess; history: Move[] } | null {
  const chess = new Chess();

  try {
    chess.loadPgn(pgn);
    const history = chess.history({ verbose: true }) as Move[];
    chess.reset();
    return { chess, history };
  } catch {
    return null;
  }
}

export function squareToBoardPosition(square: string): [number, number, number] {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = Number.parseInt(square[1], 10);
  return [file - 3.5, 0.32, (8 - rank) - 3.5];
}

export function uciToSquares(uci: string): { from: string; to: string } | null {
  if (!uci || uci.length < 4) {
    return null;
  }

  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  return { from, to };
}

export function classifyMoveLoss(loss: number): MoveGrade {
  if (loss >= 3) {
    return 'blunder';
  }
  if (loss >= 1.5) {
    return 'mistake';
  }
  if (loss >= 0.7) {
    return 'inaccuracy';
  }
  if (loss <= 0.1) {
    return 'best';
  }
  return 'excellent';
}

export function estimateAccuracy(losses: number[]): number {
  if (losses.length === 0) {
    return 100;
  }

  const avgLoss = losses.reduce((sum, value) => sum + value, 0) / losses.length;
  const score = 100 - avgLoss * 12;
  return Math.max(0, Math.min(100, Number(score.toFixed(1))));
}
