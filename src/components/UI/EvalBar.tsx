import { useGameStore } from '../../stores/gameStore';

export default function EvalBar() {
  const analysis = useGameStore((state) => state.analysis);

  if (!analysis) {
    return <div className="w-12 h-full bg-gray-800" />;
  }

  const evalClamped = Math.max(-5, Math.min(5, analysis.evaluation));
  const percentage = ((evalClamped + 5) / 10) * 100;

  return (
    <div className="w-12 h-full bg-gray-800 relative">
      <div className="absolute bottom-0 w-full bg-white transition-all duration-300" style={{ height: `${percentage}%` }} />
      <div className="absolute top-0 left-0 right-0 bg-black" style={{ height: `${100 - percentage}%` }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold z-10">
        {analysis.mate ? `M${analysis.mate}` : analysis.evaluation.toFixed(1)}
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-300 z-10 whitespace-nowrap rotate-90 origin-center">
        d{analysis.depth} · {analysis.bestMove}
      </div>
    </div>
  );
}
