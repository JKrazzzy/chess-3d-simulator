import { Canvas } from '@react-three/fiber';
import { Environment, Line } from '@react-three/drei';
import { useGameStore } from '../../stores/gameStore';
import { squareToBoardPosition } from '../../utils/chessHelpers';
import BoardControls from './BoardControls';
import Piece from './Piece';
import Square from './Square';

const BOARD_THEME = {
  classic: { light: '#f0d9b5', dark: '#b58863', env: 'apartment' as const },
  marble: { light: '#d7dce5', dark: '#78889a', env: 'city' as const },
  neon: { light: '#153243', dark: '#0b1d2a', env: 'night' as const },
};

export default function Board() {
  const chess = useGameStore((state) => state.chess);
  const currentMoveIndex = useGameStore((state) => state.currentMoveIndex);
  const gameHistory = useGameStore((state) => state.gameHistory);
  const bestMoveArrow = useGameStore((state) => state.bestMoveArrow);
  const boardTheme = useGameStore((state) => state.boardTheme);
  const board = chess.board();

  const lastMove = currentMoveIndex > 0 ? gameHistory[currentMoveIndex - 1] : undefined;
  const highlightedSquares = new Set<string>([lastMove?.from, lastMove?.to].filter(Boolean) as string[]);

  const arrowFrom = bestMoveArrow ? squareToBoardPosition(bestMoveArrow.from) : null;
  const arrowTo = bestMoveArrow ? squareToBoardPosition(bestMoveArrow.to) : null;
  const theme = BOARD_THEME[boardTheme];
  const pieceCounts: Record<string, number> = {};

  const getPieceKey = (pieceType: string, pieceColor: string) => {
    const identity = `${pieceColor}-${pieceType}`;
    pieceCounts[identity] = (pieceCounts[identity] ?? 0) + 1;
    return `${identity}-${pieceCounts[identity]}`;
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 9, 5], fov: 45 }}>
        <ambientLight intensity={0.35} />
        <spotLight
          position={[7, 14, 7]}
          angle={0.45}
          intensity={1.5}
          penumbra={0.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-7, 7, -7]} intensity={0.5} />
        <Environment preset={theme.env} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
          <planeGeometry args={[11, 11]} />
          <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.05} />
        </mesh>

        {board.flat().map((square, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const squareName = `${String.fromCharCode('a'.charCodeAt(0) + col)}${8 - row}`;
          const isLight = (row + col) % 2 !== 0;

          return (
            <group key={index}>
              <Square
                position={[col - 3.5, 0, row - 3.5]}
                color={isLight ? theme.light : theme.dark}
                highlighted={highlightedSquares.has(squareName)}
                theme={boardTheme}
              />
              {square && (
                <Piece
                  key={getPieceKey(square.type, square.color)}
                  type={square.type}
                  color={square.color}
                  position={[col - 3.5, 0.5, row - 3.5]}
                  theme={boardTheme}
                />
              )}
            </group>
          );
        })}

        {arrowFrom && arrowTo && (
          <Line
            points={[arrowFrom, arrowTo]}
            color={boardTheme === 'neon' ? '#22d3ee' : '#ef4444'}
            lineWidth={3}
            dashed
            dashScale={30}
            dashSize={0.45}
            gapSize={0.25}
          />
        )}

        <BoardControls />
      </Canvas>
    </div>
  );
}
