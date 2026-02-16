import { Chess, Move } from 'chess.js';

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
