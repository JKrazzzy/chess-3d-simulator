type StockfishEngine = {
  onmessage: ((event: string) => void) | null;
  postMessage: (command: string) => void;
};

interface AnalyzeMessage {
  type: 'analyze';
  fen: string;
  depth?: number;
  moveIndex: number;
}

interface WorkerControlMessage {
  type: 'init' | 'stop';
}

type WorkerMessage = AnalyzeMessage | WorkerControlMessage;

type WorkerScope = DedicatedWorkerGlobalScope & {
  importScripts: (...urls: string[]) => void;
  STOCKFISH?: () => StockfishEngine;
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
};

const workerScope = globalThis as unknown as WorkerScope;

workerScope.importScripts('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');

const stockfishFactory = workerScope.STOCKFISH;

if (!stockfishFactory) {
  throw new Error('Stockfish failed to initialize in worker.');
}

const engine = stockfishFactory();
let analyzing = false;
let currentMoveIndex = 0;

engine.onmessage = (event: string) => {
  if (event.startsWith('info depth')) {
    const scoreMatch = event.match(/score cp (-?\d+)/);
    const mateMatch = event.match(/score mate (-?\d+)/);
    const depthMatch = event.match(/depth (\d+)/);
    const pvMatch = event.match(/pv (.+)/);

    if ((scoreMatch || mateMatch) && depthMatch && pvMatch) {
      const cp = scoreMatch ? Number.parseInt(scoreMatch[1], 10) / 100 : 0;
      const mate = mateMatch ? Number.parseInt(mateMatch[1], 10) : undefined;
      workerScope.postMessage({
        type: 'analysis',
        evaluation: mate ? Math.sign(mate) * 10 : cp,
        mate,
        depth: Number.parseInt(depthMatch[1], 10),
        bestMove: pvMatch[1].split(' ')[0],
        pv: pvMatch[1].split(' '),
        moveIndex: currentMoveIndex,
      });
    }
  }
};

workerScope.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const payload = event.data;

  if (payload.type === 'init') {
    engine.postMessage('uci');
    engine.postMessage('isready');
    return;
  }

  if (payload.type === 'stop') {
    engine.postMessage('stop');
    analyzing = false;
    return;
  }

  if (payload.type !== 'analyze') {
    return;
  }

  const { fen, depth = 18, moveIndex } = payload;
  currentMoveIndex = moveIndex;

  if (analyzing) {
    engine.postMessage('stop');
  }

  analyzing = true;
  engine.postMessage(`position fen ${fen}`);
  engine.postMessage(`go depth ${depth}`);
};

export {};
