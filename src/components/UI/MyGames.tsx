import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { fetchSavedGames } from '../../utils/firebaseGames';
import type { SavedGameRecord } from '../../types';

interface MyGamesProps {
  user: User | null;
  onLoadGame: (pgn: string) => void;
}

export default function MyGames({ user, onLoadGame }: MyGamesProps) {
  const [games, setGames] = useState<SavedGameRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setGames([]);
        return;
      }

      setLoading(true);
      try {
        const saved = await fetchSavedGames(user.uid);
        setGames(saved);
        setError('');
      } catch {
        setError('Failed to load your games. Check Firebase rules/indexes.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user) {
    return <div className="p-4 bg-gray-800 rounded text-sm text-gray-300">Sign in to view your saved games.</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded space-y-3 max-h-[70vh] overflow-y-auto">
      <h2 className="font-semibold">My Games</h2>
      {loading && <p className="text-sm text-gray-300">Loading games...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && games.length === 0 && <p className="text-sm text-gray-400">No saved games yet.</p>}

      <div className="space-y-2">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onLoadGame(game.pgn)}
            className="w-full text-left p-3 rounded bg-gray-700 hover:bg-gray-600"
          >
            <div className="text-sm font-medium">
              {game.white ?? 'White'} vs {game.black ?? 'Black'} {game.result ? `(${game.result})` : ''}
            </div>
            <div className="text-xs text-gray-300">
              Accuracy: {typeof game.accuracy === 'number' ? `${game.accuracy.toFixed(1)}%` : 'N/A'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
