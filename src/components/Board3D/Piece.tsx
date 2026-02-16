interface PieceProps {
  type: string;
  color: string;
  position: [number, number, number];
}

export default function Piece({ type, color, position }: PieceProps) {
  const pieceColor = color === 'w' ? '#ffffff' : '#000000';
  const geometry = type === 'k' ? 'cone' : type === 'q' ? 'sphere' : 'cylinder';

  return (
    <mesh position={position}>
      {geometry === 'cone' && <coneGeometry args={[0.3, 0.8, 8]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.4, 16, 16]} />}
      {geometry === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />}
      <meshStandardMaterial color={pieceColor} />
    </mesh>
  );
}
