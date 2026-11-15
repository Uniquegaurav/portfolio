import { useEffect, useState } from "react";
import { onUnlock } from "../lib/achievements";
import { ui } from "../constants";

/** "Achievement unlocked" toast, like a console game. Queues multiple unlocks. */
const AchievementToast = () => {
  const [queue, setQueue] = useState([]);
  const current = queue[0];

  useEffect(() => onUnlock((a) => setQueue((q) => [...q, a])), []);

  useEffect(() => {
    if (!current) return undefined;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 4200);
    return () => clearTimeout(t);
  }, [current]);

  if (!current) return null;

  return (
    <div className='pointer-events-none fixed inset-x-0 top-[84px] z-[10000] flex justify-center px-4' role='status' aria-live='polite'>
      <div key={current.id} className='achievement-toast frost-glass flex items-center gap-4 !rounded-full py-2.5 pl-2.5 pr-6'>
        <span className='achievement-badge grid h-12 w-12 shrink-0 place-items-center rounded-full text-2xl'>{current.icon}</span>
        <div className='min-w-0'>
          <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-teal-300'>
            {ui.achievementLabel} · {current.count}/{current.total}
          </p>
          <p className='font-cinzel text-base font-bold text-frost'>{current.title}</p>
          <p className='text-xs text-mist'>{current.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
