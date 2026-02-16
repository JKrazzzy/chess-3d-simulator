import { useGameStore } from '../../stores/gameStore';

export default function MoveList() {
  const { moves, currentMoveIndex, goToMove } = useGameStore();

  return (
    <div className="p-4 bg-gray-800 rounded h-56 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-2">Move List</h2>
      <div className="grid grid-cols-2 gap-1 text-sm">
        {moves.map((move, index) => {
          const moveNumber = Math.floor(index / 2) + 1;
          const isCurrent = currentMoveIndex === index + 1;

          return (
            <button
              key={`${move}-${index}`}
              onClick={() => goToMove(index + 1)}
              className={`text-left px-2 py-1 rounded ${isCurrent ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {index % 2 === 0 ? `${moveNumber}. ` : ''}
              {move}
            </button>
          );
        })}
      </div>
    </div>
  );
}
