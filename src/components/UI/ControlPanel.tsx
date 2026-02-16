import { useGameStore } from '../../stores/gameStore';

export default function ControlPanel() {
  const { firstMove, prevMove, nextMove, lastMove, currentMoveIndex, moves } = useGameStore();

  return (
    <div className="flex gap-2 p-4 bg-gray-800 rounded">
      <button onClick={firstMove} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        ⏮
      </button>
      <button onClick={prevMove} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        ◀
      </button>
      <button onClick={nextMove} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        ▶
      </button>
      <button onClick={lastMove} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        ⏭
      </button>
      <span className="px-4 py-2 text-white">
        Move {currentMoveIndex} / {moves.length}
      </span>
    </div>
  );
}
