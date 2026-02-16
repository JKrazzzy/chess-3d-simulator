import { useGameStore } from '../../stores/gameStore';
import { estimateAccuracy } from '../../utils/chessHelpers';

const GRADE_STYLE = {
  best: 'text-emerald-300',
  excellent: 'text-green-300',
  inaccuracy: 'text-yellow-300',
  mistake: 'text-orange-300',
  blunder: 'text-red-300',
};

export default function MoveList() {
  const { moves, currentMoveIndex, goToMove, moveAnnotations } = useGameStore();
  const accuracy = estimateAccuracy(moveAnnotations.map((annotation) => annotation?.loss ?? 0));

  return (
    <div className="p-4 bg-gray-800 rounded h-56 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Move List</h2>
        <span className="text-xs text-blue-300">Accuracy {accuracy.toFixed(1)}%</span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-sm">
        {moves.map((move, index) => {
          const moveNumber = Math.floor(index / 2) + 1;
          const isCurrent = currentMoveIndex === index + 1;
          const annotation = moveAnnotations[index];

          return (
            <button
              key={`${move}-${index}`}
              onClick={() => goToMove(index + 1)}
              className={`text-left px-2 py-1 rounded ${isCurrent ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              title={annotation ? `${annotation.grade.toUpperCase()} · Eval ${annotation.evaluation.toFixed(2)}` : undefined}
            >
              <div className="flex items-center justify-between gap-2">
                <span>
                  {index % 2 === 0 ? `${moveNumber}. ` : ''}
                  {move}
                </span>
                {annotation && (
                  <span className={`text-[11px] uppercase ${GRADE_STYLE[annotation.grade]}`}>
                    {annotation.grade}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
