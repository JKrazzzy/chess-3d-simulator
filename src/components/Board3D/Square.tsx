import type { BoardTheme } from '../../types';

interface SquareProps {
  position: [number, number, number];
  color: string;
  highlighted?: boolean;
  theme: BoardTheme;
}

const HIGHLIGHT_COLORS: Record<BoardTheme, string> = {
  classic: '#fbbf24',
  marble: '#60a5fa',
  neon: '#22d3ee',
};

export default function Square({ position, color, highlighted = false, theme }: SquareProps) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={theme === 'marble' ? 0.25 : 0.75}
        metalness={theme === 'neon' ? 0.4 : 0.1}
        emissive={highlighted ? HIGHLIGHT_COLORS[theme] : '#000000'}
        emissiveIntensity={highlighted ? 0.4 : 0}
      />
    </mesh>
  );
}
