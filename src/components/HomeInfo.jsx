import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homeStagesInfo, ui } from "../constants";
import { sfx } from "../lib/sfx";

const useIsMobile = () => {
  const query = "(max-width: 639px)";
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Types text out like game dialogue. */
const useTypewriter = (text, speed = 16) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { shown: text.slice(0, count), done: count >= text.length };
};

const Corners = () => (
  <>
    <span className='quest-corner left-0 top-0 border-l-2 border-t-2' />
    <span className='quest-corner right-0 top-0 border-r-2 border-t-2' />
    <span className='quest-corner bottom-0 left-0 border-b-2 border-l-2' />
    <span className='quest-corner bottom-0 right-0 border-b-2 border-r-2' />
  </>
);

const Pips = ({ current, visited }) => (
  <div className='flex items-center gap-1.5' aria-label={`Chapter ${current} of ${homeStagesInfo.length}`}>
    {homeStagesInfo.map((_, i) => {
      const n = i + 1;
      return (
        <span
          key={n}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            n === current ? "w-6 bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.9)]" : visited.has(n) ? "w-1.5 bg-teal-500/70" : "w-1.5 bg-white/20"
          }`}
        />
      );
    })}
  </div>
);

const QuestCard = ({ stageNumber, visited, mobile }) => {
  const stage = homeStagesInfo[stageNumber - 1];
  const text = mobile ? stage.textMobile || stage.text : stage.text;
  const { shown, done } = useTypewriter(text, mobile ? 14 : 16);

  return (
    <div className={`quest-card relative overflow-hidden ${mobile ? "p-4" : "p-6"}`}>
      <Corners />
      <span className='quest-glint' aria-hidden='true' />

      <div className='flex items-center gap-3'>
        <span className={`quest-medallion grid shrink-0 place-items-center rounded-full ${mobile ? "h-10 w-10 text-lg" : "h-12 w-12 text-2xl"}`}>
          {stage.icon}
        </span>
        <div className='min-w-0 flex-1'>
          <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-teal-300'>
            {stage.chapter} {ui.questTag && <span className='quest-new ml-1 rounded bg-ember px-1.5 py-0.5 text-[9px] tracking-widest text-white'>{ui.questTag}</span>}
          </p>
          <h2 className={`font-cinzel font-bold leading-tight text-frost ${mobile ? "text-lg" : "text-2xl"}`}>{stage.title}</h2>
        </div>
      </div>

      <p className={`mt-3 text-frost/90 ${mobile ? "min-h-[2lh] text-[13px] leading-snug" : "min-h-[3lh] text-[15px] leading-relaxed"}`}>
        {shown}
        {!done && <span className='quest-caret'>▍</span>}
      </p>

      {stage.chips?.length > 0 && (
        <div className={`mt-3 flex flex-wrap gap-1.5 ${done ? "" : "invisible"}`}>
          {stage.chips.map((c, i) => (
            <span key={c} className='quest-chip rounded-full border border-teal-300/30 bg-teal-300/10 px-2.5 py-1 text-[11px] font-semibold text-teal-100' style={{ animationDelay: `${i * 80}ms` }}>
              {c}
            </span>
          ))}
        </div>
      )}

      <div className={`mt-4 flex items-center justify-between gap-3 ${mobile ? "mt-3" : ""}`}>
        <Pips current={stageNumber} visited={visited} />
        {stage.ctaText && (
          <Link to={stage.link} onClick={sfx.click} onMouseEnter={sfx.hover} className={`btn !w-auto shrink-0 ${mobile ? "!px-4 !py-2 !text-xs" : ""}`}>
            {stage.ctaText} →
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * Chapter card for the island. Desktop: top-left panel. Mobile: compact banner under the nav.
 * Keeps the last chapter on screen briefly while it animates out.
 */
const HomeInfo = ({ currentStage, visited }) => {
  const [shownStage, setShownStage] = useState(currentStage);
  const [leaving, setLeaving] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    if (currentStage) {
      setShownStage(currentStage);
      setLeaving(false);
      sfx.quest();
      return undefined;
    }
    setLeaving(true);
    const t = setTimeout(() => setShownStage(null), 380);
    return () => clearTimeout(t);
  }, [currentStage]);

  if (!shownStage) return null;

  // Bottom placement keeps the dragon (centre of the scene) clear
  const placement = mobile
    ? "inset-x-3 bottom-[68px]" // compact card above the swipe hint
    : "left-6 bottom-8 w-[440px] lg:left-10"; // bottom-left panel

  return (
    <div key={`${mobile ? "m" : "d"}-${shownStage}`} className={`absolute z-10 ${placement} ${leaving ? "quest-exit" : "quest-enter"}`}>
      <QuestCard stageNumber={shownStage} visited={visited} mobile={mobile} />
    </div>
  );
};

export default HomeInfo;
