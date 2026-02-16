import { useGameStore } from '../../stores/gameStore';

export default function Commentator() {
  const message = useGameStore((state) => state.commentatorMessage);

  return (
    <div className="absolute top-4 right-4 max-w-xs">
      <div className="bg-white rounded-lg shadow-lg p-4 relative">
        <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
        <p className="text-sm text-gray-900">{message}</p>
      </div>
      <div className="mt-2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🤖</div>
    </div>
  );
}
