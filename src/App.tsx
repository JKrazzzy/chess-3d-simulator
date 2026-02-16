import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import Board from './components/Board3D/Board';
import Layout from './components/Layout';
import AuthPanel from './components/UI/AuthPanel';
import Commentator from './components/UI/Commentator';
import ControlPanel from './components/UI/ControlPanel';
import EvalBar from './components/UI/EvalBar';
import GameLoader from './components/UI/GameLoader';
import MyGames from './components/UI/MyGames';
import MoveList from './components/UI/MoveList';
import { useGameStore } from './stores/gameStore';
import { generateCommentaryByGrade } from './utils/commentaryEngine';
import { estimateAccuracy } from './utils/chessHelpers';
import { signInWithGoogle, signOutUser, subscribeToAuth } from './utils/firebaseAuth';

function App() {
  const chess = useGameStore((state) => state.chess);
  const currentMoveIndex = useGameStore((state) => state.currentMoveIndex);
  const gameHistory = useGameStore((state) => state.gameHistory);
  const analysis = useGameStore((state) => state.analysis);
  const moveAnnotations = useGameStore((state) => state.moveAnnotations);
  const realTimeAnalysisEnabled = useGameStore((state) => state.realTimeAnalysisEnabled);
  const loadPGN = useGameStore((state) => state.loadPGN);
  const updateAnalysis = useGameStore((state) => state.updateAnalysis);
  const setCommentary = useGameStore((state) => state.setCommentary);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'review' | 'my-games'>('review');
  const [savedNonce, setSavedNonce] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const accuracy = useMemo(() => {
    return estimateAccuracy(moveAnnotations.map((annotation) => annotation?.loss ?? 0));
  }, [moveAnnotations]);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((nextUser) => setUser(nextUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL('./workers/stockfish.worker.ts', import.meta.url));
    workerRef.current = worker;
    worker.postMessage({ type: 'init' });

    worker.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'analysis') {
        updateAnalysis(event.data);
      }
    };

    return () => {
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      workerRef.current = null;
    };
  }, [updateAnalysis]);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    const move = currentMoveIndex > 0 ? gameHistory[currentMoveIndex - 1] : undefined;
    const grade = moveAnnotations[currentMoveIndex - 1]?.grade;
    const message = generateCommentaryByGrade(move, grade, Boolean(analysis.mate));
    setCommentary(message);
  }, [analysis, currentMoveIndex, gameHistory, moveAnnotations, setCommentary]);

  useEffect(() => {
    if (!workerRef.current) {
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (!realTimeAnalysisEnabled) {
      workerRef.current.postMessage({ type: 'stop' });
      return;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      workerRef.current?.postMessage({
        type: 'analyze',
        fen: chess.fen(),
        depth: 18,
        moveIndex: currentMoveIndex,
      });
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [chess, currentMoveIndex, realTimeAnalysisEnabled]);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <Layout>
      <EvalBar />
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded ${activeView === 'review' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveView('review')}
          >
            Review
          </button>
          <button
            className={`px-3 py-2 rounded ${activeView === 'my-games' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveView('my-games')}
          >
            My Games
          </button>
        </div>

        <AuthPanel user={user} onLogin={handleLogin} onLogout={handleLogout} />

        {activeView === 'review' ? (
          <>
            <div className="flex-1 relative min-h-0 rounded overflow-hidden border border-gray-700">
              <Board />
              <Commentator />
            </div>
            <ControlPanel />
            <MoveList />
            <GameLoader user={user} accuracy={accuracy} onSaved={() => setSavedNonce((prev) => prev + 1)} />
          </>
        ) : (
          <MyGames key={savedNonce} user={user} onLoadGame={(pgn) => loadPGN(pgn)} />
        )}
        </div>
    </Layout>
  );
}

export default App;
