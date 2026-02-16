import { useGameStore } from '../../stores/gameStore';

export default function ControlPanel() {
  const {
    firstMove,
    prevMove,
    nextMove,
    lastMove,
    currentMoveIndex,
    moves,
    realTimeAnalysisEnabled,
    setRealtimeAnalysisEnabled,
    boardTheme,
    setBoardTheme,
  } = useGameStore();

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded items-center">
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
      <label className="ml-auto text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={realTimeAnalysisEnabled}
          onChange={(event) => setRealtimeAnalysisEnabled(event.target.checked)}
        />
        Real-time analysis
      </label>
      <select
        value={boardTheme}
        onChange={(event) => setBoardTheme(event.target.value as 'classic' | 'marble' | 'neon')}
        className="px-3 py-2 rounded bg-gray-700 border border-gray-600"
      >
        <option value="classic">Classic</option>
        <option value="marble">Marble</option>
        <option value="neon">Neon</option>
      </select>
    </div>
  );
}
