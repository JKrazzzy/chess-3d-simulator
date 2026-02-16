import { useEffect, useRef } from 'react';
import Board from './components/Board3D/Board';
import Layout from './components/Layout';
import Commentator from './components/UI/Commentator';
import ControlPanel from './components/UI/ControlPanel';
import EvalBar from './components/UI/EvalBar';
import GameLoader from './components/UI/GameLoader';
import MoveList from './components/UI/MoveList';
import { useGameStore } from './stores/gameStore';
import { generateCommentary } from './utils/commentaryEngine';

function App() {
  const chess = useGameStore((state) => state.chess);
  const currentMoveIndex = useGameStore((state) => state.currentMoveIndex);
  const gameHistory = useGameStore((state) => state.gameHistory);
  const analysis = useGameStore((state) => state.analysis);
  const updateAnalysis = useGameStore((state) => state.updateAnalysis);
  const setCommentary = useGameStore((state) => state.setCommentary);
  const previousEvaluationRef = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL('./workers/stockfish.worker.ts', import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'analysis') {
        updateAnalysis(event.data);
      }
    };

    worker.postMessage({ fen: chess.fen() });

    return () => worker.terminate();
  }, [chess, updateAnalysis]);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    const move = currentMoveIndex > 0 ? gameHistory[currentMoveIndex - 1] : undefined;
    const message = generateCommentary(move, analysis.evaluation, previousEvaluationRef.current);
    setCommentary(message);
    previousEvaluationRef.current = analysis.evaluation;
  }, [analysis, currentMoveIndex, gameHistory, setCommentary]);

  return (
    <Layout>
      <EvalBar />
      <div className="flex-1 flex flex-col p-3 gap-3">
        <div className="flex-1 relative min-h-0 rounded overflow-hidden border border-gray-700">
          <Board />
          <Commentator />
        </div>
        <ControlPanel />
        <MoveList />
        <GameLoader />
      </div>
    </Layout>
  );
}

export default App;
