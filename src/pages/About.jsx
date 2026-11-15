import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { Link } from "react-router-dom";
import EarthCanvas from "../components/EarthCanvas";
import { about, education, experiences, skillGroups, ui } from "../constants";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { textVariant } from "../utils/motion";
import { styles } from "../styles";
import { unlock } from "../lib/achievements";
import { sfx } from "../lib/sfx";

import "react-vertical-timeline-component/style.min.css";
import { SectionWrapper } from "../hoc";
import { ABOUT_TITLE, WORK_EXP_TITLE } from "../constants";

// Skills pop in one after another (cheap: opacity/transform only — the old version
// flew 24 blurred tiles in from random screen positions, which stuttered)
const skillGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};
const skillItem = {
  hidden: { opacity: 0, y: 24, scale: 0.8 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const GlobeBadge = ({ badge, className = "", delay = 0 }) => (
  <div className={`frost-glass globe-badge flex items-center gap-3 px-3.5 py-2.5 ${className}`} style={{ animationDelay: `${delay}s` }}>
    <span className='text-xl'>{badge.icon}</span>
    <div className='min-w-0'>
      <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300'>{badge.label}</p>
      <p className='text-sm font-semibold leading-tight text-frost'>{badge.value}</p>
    </div>
  </div>
);

// Desktop: badges float around the globe. Mobile/tablet: they sit in a grid below it.
const badgeSpots = ["left-0 top-6", "right-0 top-16", "left-4 bottom-10", "right-2 bottom-2"];

const About = () => {
  useEffect(() => {
    unlock("scholar");
  }, []);

  return (
    <div className="mt-12">
      <div className='grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]'>
        <div>
          <motion.div variants={textVariant()}>
            <p className={`${styles.sectionSubText} `}>{about.eyebrow}</p>
            <h2 className={`${styles.sectionHeadTextAbout}`}>{about.heading}</h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className='mt-5 max-w-2xl text-[17px] leading-[30px] text-mist'
          >
            {ABOUT_TITLE}
          </motion.p>
        </div>

        {/* Globe with home-base info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <div className='relative h-[300px] sm:h-[360px] lg:h-[420px]'>
            <div className='absolute inset-0 rounded-full bg-teal-400/10 blur-3xl' aria-hidden='true' />
            <EarthCanvas speed={1.2} fov={30} />
            {about.globe.badges.map((b, i) => (
              <GlobeBadge key={b.label} badge={b} delay={i * 0.6} className={`absolute hidden max-w-[250px] lg:flex ${badgeSpots[i % badgeSpots.length]}`} />
            ))}
          </div>
          <div className='mt-4 grid grid-cols-1 gap-3 xs:grid-cols-2 lg:hidden'>
            {about.globe.badges.map((b, i) => (
              <GlobeBadge key={b.label} badge={b} delay={i * 0.6} />
            ))}
          </div>
        </motion.div>
      </div>

      <h3 className='subhead-text mt-20'>{about.skillsHeading}</h3>
      {about.skillsIntro && <p className='mt-3 max-w-3xl text-[17px] leading-[30px] text-mist'>{about.skillsIntro}</p>}

      <div className='mt-10 space-y-6'>
        {skillGroups.map((group, gi) => (
          <motion.section
            key={group.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='frost-glass grid gap-6 p-5 sm:p-7 lg:grid-cols-[260px_1fr] lg:gap-10'
          >
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.25em] text-teal-300'>
                {String(gi + 1).padStart(2, "0")} · {group.items.length} skills
              </p>
              <h4 className='mt-1 font-cinzel text-xl font-bold text-frost'>{group.group}</h4>
              <p className='mt-2 text-sm leading-relaxed text-mist'>{group.description}</p>
            </div>

            <motion.ul
              variants={skillGrid}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true, amount: 0.2 }}
              className='grid grid-cols-3 gap-x-3 gap-y-6 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6'
            >
              {group.items.map((skill, index) => (
                <motion.li key={skill.name} variants={skillItem} className='flex flex-col items-center gap-3'>
                  <motion.div
                    drag
                    dragSnapToOrigin
                    dragElastic={0.6}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.92 }}
                    onHoverStart={sfx.hover}
                    className='block-container h-14 w-14 cursor-grab active:cursor-grabbing sm:h-16 sm:w-16'
                  >
                    <div className={`btn-back rounded-xl ${(index + gi) % 3 === 2 ? "btn-back-ember" : "btn-back-teal"}`} />
                    <div className='btn-front rounded-xl flex justify-center items-center'>
                      {skill.Icon ? (
                        <skill.Icon className='w-1/2 h-1/2' style={{ color: skill.color }} aria-hidden='true' />
                      ) : (
                        <img src={skill.imageUrl} alt='' className='w-1/2 h-1/2 object-contain' />
                      )}
                    </div>
                  </motion.div>
                  <span className='text-center text-xs font-semibold leading-tight text-frost/85'>{skill.name}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        ))}
      </div>

      <div className='py-16'>
        <h3 className='subhead-text'>{about.experienceHeading}</h3>
        <div className='mt-5 flex max-w-4xl flex-col gap-3 text-[17px] leading-[30px] text-mist'>
          <p>
          {WORK_EXP_TITLE}
          </p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experiences.map((experience, index) => (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                iconStyle={{ background: "#0f1d20" }}
                icon={
                  <div className='flex justify-center items-center w-full h-full overflow-hidden rounded-full'>
                    {experience.icon ? (
                      <img
                        src={experience.icon}
                        alt={experience.company_name}
                        className='w-[60%] h-[60%] object-contain'
                      />
                    ) : (
                      <span className='font-cinzel text-xl font-bold text-teal-300'>
                        {experience.company_name.charAt(0)}
                      </span>
                    )}
                  </div>
                }
              >
                <div>
                  <h3 className='text-frost text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p
                    className='text-teal-300 font-semibold text-base'
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2 marker:text-ember-light'>
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className={`font-normal pl-1 text-sm leading-relaxed ${
                        point.startsWith("Tools:") ? "text-teal-200/80 italic" : "text-frost/80"
                      }`}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
            <VerticalTimelineElement
              date={education.date}
              iconStyle={{ background: "#0f1d20" }}
              icon={
                <div className='flex justify-center items-center w-full h-full font-cinzel text-xl font-bold text-ember-light'>
                  🎓
                </div>
              }
            >
              <h3 className='text-frost text-xl font-poppins font-semibold'>{education.degree}</h3>
              <p className='text-teal-300 font-semibold text-base' style={{ margin: 0 }}>
                {education.school}
              </p>
              <p className='mt-2 text-sm text-mist'>{education.location}</p>
            </VerticalTimelineElement>
          </VerticalTimeline>
        </div>
      </div>

      {/* Side quest → personal page */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to='/personal'
          onMouseEnter={sfx.hover}
          onClick={sfx.click}
          className='quest-card group relative flex flex-col items-start gap-5 overflow-hidden p-6 transition hover:-translate-y-1 sm:flex-row sm:items-center sm:p-8'
        >
          <span className='quest-corner left-0 top-0 border-l-2 border-t-2' />
          <span className='quest-corner right-0 top-0 border-r-2 border-t-2' />
          <span className='quest-corner bottom-0 left-0 border-b-2 border-l-2' />
          <span className='quest-corner bottom-0 right-0 border-b-2 border-r-2' />
          <span className='quest-glint opacity-0 group-hover:opacity-100' aria-hidden='true' />
          <span className='quest-medallion grid h-16 w-16 shrink-0 place-items-center rounded-full text-3xl'>✨</span>
          <span className='flex-1'>
            <span className='block text-[11px] font-bold uppercase tracking-[0.3em] text-teal-300'>{ui.personalCta.kicker}</span>
            <span className='mt-1 block font-cinzel text-2xl font-bold text-frost sm:text-3xl'>{ui.personalCta.title}</span>
            <span className='mt-2 block text-mist'>{ui.personalCta.text}</span>
          </span>
          <span className='btn shrink-0'>{ui.personalCta.button} →</span>
        </Link>
      </motion.div>
    </div>
  );
};


export default SectionWrapper(About,"");
