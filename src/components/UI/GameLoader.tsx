import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { extractPGN, fetchUserGames } from '../../utils/chessComAPI';

export default function GameLoader() {
  const [username, setUsername] = useState('');
  const [pgnText, setPgnText] = useState('');
  const [error, setError] = useState('');
  const loadPGN = useGameStore((state) => state.loadPGN);

  const handleLoadChessCom = async () => {
    if (!username.trim()) {
      setError('Enter a chess.com username.');
      return;
    }

    try {
      const now = new Date();
      const games = await fetchUserGames(username.trim(), now.getFullYear(), now.getMonth() + 1);
      if (games.length > 0) {
        const pgn = extractPGN(games[0]);
        loadPGN(pgn);
        setError('');
      } else {
        setError('No games found this month.');
      }
    } catch {
      setError('Failed to fetch games from chess.com API.');
    }
  };

  const handleLoadPgn = () => {
    if (!pgnText.trim()) {
      setError('Paste a PGN first.');
      return;
    }

    loadPGN(pgnText);
    setError('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded space-y-4">
      <div>
        <input
          type="text"
          placeholder="Chess.com username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="px-4 py-2 rounded mr-2 text-gray-900"
        />
        <button onClick={handleLoadChessCom} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
          Load Latest Game
        </button>
      </div>

      <div>
        <textarea
          placeholder="Or paste PGN here..."
          value={pgnText}
          onChange={(event) => setPgnText(event.target.value)}
          className="w-full h-32 p-2 rounded text-gray-900"
        />
        <button onClick={handleLoadPgn} className="px-4 py-2 bg-blue-600 rounded mt-2 hover:bg-blue-700">
          Load PGN
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
