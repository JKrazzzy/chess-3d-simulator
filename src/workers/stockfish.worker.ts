type StockfishEngine = {
  onmessage: ((event: string) => void) | null;
  postMessage: (command: string) => void;
};

type WorkerScope = DedicatedWorkerGlobalScope & {
  importScripts: (...urls: string[]) => void;
  STOCKFISH?: () => StockfishEngine;
  onmessage: ((event: MessageEvent<{ fen: string }>) => void) | null;
};

const workerScope = globalThis as unknown as WorkerScope;

workerScope.importScripts('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');

const stockfishFactory = workerScope.STOCKFISH;

if (!stockfishFactory) {
  throw new Error('Stockfish failed to initialize in worker.');
}

const engine = stockfishFactory();
let analyzing = false;

engine.onmessage = (event: string) => {
  if (event.startsWith('info depth')) {
    const scoreMatch = event.match(/score cp (-?\d+)/);
    const depthMatch = event.match(/depth (\d+)/);
    const pvMatch = event.match(/pv (.+)/);

    if (scoreMatch && depthMatch && pvMatch) {
      workerScope.postMessage({
        type: 'analysis',
        evaluation: Number.parseInt(scoreMatch[1], 10) / 100,
        depth: Number.parseInt(depthMatch[1], 10),
        bestMove: pvMatch[1].split(' ')[0],
      });
    }
  }
};

workerScope.onmessage = (event: MessageEvent<{ fen: string }>) => {
  const { fen } = event.data;

  if (analyzing) {
    engine.postMessage('stop');
  }

  analyzing = true;
  engine.postMessage(`position fen ${fen}`);
  engine.postMessage('go depth 18');
};

export {};
