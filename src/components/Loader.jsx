import { Html, useProgress } from "@react-three/drei";
import { ui } from "../constants";

// Loader for the 3D world. Rendered inside the fallback <Canvas> (same as the original),
// restyled in the House of the Dragon theme: pulsing ember + real loading progress.
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className='flex w-64 flex-col items-center gap-5 text-center'>
        <div className='relative h-20 w-20'>
          <span className='absolute inset-0 animate-ping rounded-full bg-ember/30' />
          <span className='absolute inset-0 animate-spin rounded-full border-4 border-teal-400/15 border-t-teal-400' />
          <span className='absolute inset-6 rounded-full bg-gradient-to-br from-ember-light to-ember shadow-[0_0_30px_rgba(194,38,63,0.8)]' />
        </div>
        <p className='whitespace-nowrap font-cinzel text-xl font-bold tracking-wide text-frost'>{ui.loader}</p>
        <div className='h-1.5 w-56 overflow-hidden rounded-full bg-white/10'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-xs font-semibold tracking-widest text-mist'>{Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

export default Loader;
