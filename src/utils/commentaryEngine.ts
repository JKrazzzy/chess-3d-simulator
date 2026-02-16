import type { Move } from 'chess.js';

const COMMENTARY = {
  check: [
    "Uh-oh, the king is in trouble!",
    'Check! Time to move that royal behind.',
    "The king's looking nervous now!",
  ],
  capture: ['Snack time! Piece down.', "Ouch, that's gonna leave a mark.", 'Clean capture!'],
  blunder: ["Oof, that's... not optimal.", 'Houston, we have a problem.', "I've seen better moves in checkers."],
  brilliant: ["Now THAT'S what I'm talking about!", "Chef's kiss! Magnifique!", 'Stockfish is taking notes!'],
  opening: ['Solid opening choice!', "Let's see where this goes...", 'Classic move, I like it.'],
};

function pickOne(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)];
}

export function generateCommentary(move: Move | undefined, evaluation: number, prevEvaluation: number): string {
  if (!move) {
    return "Let's analyze this game!";
  }

  const evalDrop = prevEvaluation - evaluation;

  if (move.flags.includes('c')) {
    return pickOne(COMMENTARY.capture);
  }

  if (move.san.includes('+')) {
    return pickOne(COMMENTARY.check);
  }

  if (evalDrop > 2) {
    return pickOne(COMMENTARY.blunder);
  }

  if (evalDrop < -1) {
    return pickOne(COMMENTARY.brilliant);
  }

  return pickOne(COMMENTARY.opening);
}
