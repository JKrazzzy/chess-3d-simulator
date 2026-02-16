import { OrbitControls } from '@react-three/drei';

export default function BoardControls() {
  return <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={6} maxDistance={16} />;
}
