import { useEffect } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { CTA } from "../components";
import { personal } from "../constants";
import { unlock } from "../lib/achievements";
import { sfx } from "../lib/sfx";

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const pop = {
  hidden: { opacity: 0, y: 28, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 20 } },
};

/** "Beyond the Code" — hobbies & personal bits. All content comes from `personal` in portfolio.json. */
const Personal = () => {
  useEffect(() => {
    unlock("kindred-spirit");
  }, []);

  return (
    <div className='mt-12'>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{personal.eyebrow}</p>
        <h2 className={styles.sectionHeadTextAbout}>{personal.heading}</h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className='mt-5 max-w-3xl text-[17px] leading-[30px] text-mist'
      >
        {personal.intro}
      </motion.p>

      {/* Hobbies */}
      <h3 className='subhead-text mt-16'>{personal.hobbiesHeading}</h3>
      <motion.ul
        variants={grid}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.15 }}
        className='mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'
      >
        {personal.hobbies.map((h) => (
          <motion.li
            key={h.title}
            variants={pop}
            whileHover={{ y: -8, rotate: -1 }}
            onHoverStart={sfx.hover}
            className='frost-glass group relative overflow-hidden p-6'
          >
            <span className='quest-glint opacity-0 group-hover:opacity-100' aria-hidden='true' />
            <span className='quest-medallion grid h-14 w-14 place-items-center rounded-full text-2xl'>{h.icon}</span>
            <h4 className='mt-5 font-cinzel text-xl font-bold text-frost'>{h.title}</h4>
            <p className='mt-2 text-sm leading-relaxed text-mist'>{h.description}</p>
          </motion.li>
        ))}
      </motion.ul>

      <div className='mt-16 grid gap-6 lg:grid-cols-2'>
        {/* Current quest log */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='quest-card relative p-6 sm:p-8'
        >
          <span className='quest-corner left-0 top-0 border-l-2 border-t-2' />
          <span className='quest-corner right-0 top-0 border-r-2 border-t-2' />
          <span className='quest-corner bottom-0 left-0 border-b-2 border-l-2' />
          <span className='quest-corner bottom-0 right-0 border-b-2 border-r-2' />
          <h3 className='subhead-text'>{personal.currentlyHeading}</h3>
          <ul className='mt-6 space-y-4'>
            {personal.currently.map((c) => (
              <li key={c.label} className='flex items-start gap-4'>
                <span className='mt-1 rounded-md bg-teal-400/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300 ring-1 ring-teal-300/30'>
                  {c.label}
                </span>
                <span className='text-frost/90'>{c.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Fun facts */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='frost-glass p-6 sm:p-8'
        >
          <h3 className='subhead-text'>{personal.factsHeading}</h3>
          <ul className='mt-6 space-y-3'>
            {personal.facts.map((fact, i) => (
              <li key={fact} className='flex gap-3 text-frost/90'>
                <span className='font-cinzel font-bold text-ember-light'>{String(i + 1).padStart(2, "0")}</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {personal.quote?.text && (
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className='mt-16 text-center'
        >
          <p className='font-cinzel text-2xl font-bold text-frost sm:text-4xl'>
            “<span className='teal-text-gradient'>{personal.quote.text}</span>”
          </p>
          {personal.quote.by && <footer className='mt-3 text-sm uppercase tracking-[0.25em] text-mist'>— {personal.quote.by}</footer>}
        </motion.blockquote>
      )}

      <CTA />
    </div>
  );
};

export default SectionWrapper(Personal, "");
