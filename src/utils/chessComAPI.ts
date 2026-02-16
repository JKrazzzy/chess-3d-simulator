import axios from 'axios';

export async function fetchUserGames(username: string, year: number, month: number) {
  const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month.toString().padStart(2, '0')}`;
  const response = await axios.get(url);
  return response.data.games;
}

export function extractPGN(game: { pgn: string }): string {
  return game.pgn;
}
