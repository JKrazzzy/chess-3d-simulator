import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import type { BoardTheme } from '../../types';

interface PieceProps {
  type: string;
  color: string;
  position: [number, number, number];
  theme: BoardTheme;
}

const THEME_COLORS: Record<BoardTheme, { white: string; black: string; emissive: string }> = {
  classic: { white: '#f8f8f6', black: '#1c1c1c', emissive: '#000000' },
  marble: { white: '#fcfcff', black: '#101117', emissive: '#090909' },
  neon: { white: '#baf7ff', black: '#2b1a3b', emissive: '#0f1022' },
};

export default function Piece({ type, color, position, theme }: PieceProps) {
  const meshRef = useRef<Mesh>(null);
  const targetRef = useRef(new Vector3(position[0], position[1], position[2]));
  const target = targetRef.current;

  target.set(position[0], position[1], position[2]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.lerp(target, Math.min(1, delta * 8));
    }
  });

  const palette = THEME_COLORS[theme];
  const pieceColor = color === 'w' ? palette.white : palette.black;
  const geometry = type;

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      {(geometry === 'p' || geometry === 'r') && <cylinderGeometry args={[0.24, 0.3, 0.7, 20]} />}
      {geometry === 'n' && <coneGeometry args={[0.28, 0.78, 20]} />}
      {geometry === 'b' && <octahedronGeometry args={[0.38, 0]} />}
      {geometry === 'q' && <sphereGeometry args={[0.36, 24, 24]} />}
      {geometry === 'k' && <cylinderGeometry args={[0.3, 0.22, 0.85, 24]} />}
      <meshStandardMaterial
        color={pieceColor}
        metalness={theme === 'neon' ? 0.6 : 0.25}
        roughness={theme === 'marble' ? 0.35 : 0.5}
        emissive={palette.emissive}
        emissiveIntensity={theme === 'neon' ? 0.12 : 0.02}
      />
    </mesh>
  );
}
