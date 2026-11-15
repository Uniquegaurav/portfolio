import { popup } from "../constants";
import { sfx } from "../lib/sfx";

const Popup = ({ onClose, onSeeHome, onJumpToAbout }) => {
  const handleSeeHome = () => {
    sfx.portal();
    onClose();
    onSeeHome();
  };

  const handleJumpToAbout = () => {
    sfx.click();
    onClose();
    onJumpToAbout();
  };

  return (
    <div className='popup-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='popup-title'
        className='popup-panel relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/20 px-6 pb-7 pt-8 text-center sm:px-9'
        style={{ backgroundColor: "rgba(173, 216, 230, 0.22)" }}
      >
        <span className='quest-glint' aria-hidden='true' />
        <div className='popup-emblem mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl'>🐉</div>

        <p className='mt-4 text-[11px] font-bold uppercase tracking-[0.35em] text-teal-200'>{popup.kicker}</p>
        <h1 id='popup-title' className='mt-2 font-cinzel text-2xl font-bold uppercase leading-tight tracking-wider text-white drop-shadow-[0_2px_18px_rgba(45,212,191,0.45)] sm:text-3xl'>
          {popup.title}
        </h1>
        <div className='mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-teal-300/70 to-transparent' />
        <p className='mx-auto max-w-sm text-sm leading-relaxed text-gray-100 sm:text-[15px]'>{popup.subtitle}</p>

        <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
          <button onClick={handleSeeHome} onMouseEnter={sfx.hover} type='button' className='btn popup-cta'>
            {popup.exploreCta}
          </button>
          <button onClick={handleJumpToAbout} onMouseEnter={sfx.hover} type='button' className='btn-outline text-white'>
            {popup.skipCta}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
