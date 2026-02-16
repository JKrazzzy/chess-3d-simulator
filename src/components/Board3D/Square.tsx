interface SquareProps {
  position: [number, number, number];
  color: string;
}

export default function Square({ position, color }: SquareProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
