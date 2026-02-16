import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../stores/gameStore';
import BoardControls from './BoardControls';
import Piece from './Piece';
import Square from './Square';

export default function Board() {
  const chess = useGameStore((state) => state.chess);
  const board = chess.board();

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [4, 8, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {board.flat().map((square, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const isLight = (row + col) % 2 === 0;

          return (
            <group key={index}>
              <Square position={[col - 3.5, 0, row - 3.5]} color={isLight ? '#f0d9b5' : '#b58863'} />
              {square && (
                <Piece
                  type={square.type}
                  color={square.color}
                  position={[col - 3.5, 0.5, row - 3.5]}
                />
              )}
            </group>
          );
        })}

        <BoardControls />
      </Canvas>
    </div>
  );
}
