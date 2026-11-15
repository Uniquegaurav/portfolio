import {Tilt} from "react-tilt";
import { styles } from "../styles";
import { FiArrowUpRight } from "react-icons/fi";
import { useEffect } from "react";
import { unlock } from "../lib/achievements";
import { sfx } from "../lib/sfx";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { motion } from "framer-motion";
import { CTA } from "../components";
import { PROJECT_DESCRIPTION, projectsPage } from "../constants";


const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='frost-glass p-5 rounded-2xl sm:w-[360px] w-full h-full'
      >
        <div className='relative w-full h-[230px]'>
          {image ? (
            <img
              src={image}
              alt={`${name} preview`}
              loading='lazy'
              decoding='async'
              className='w-full h-full object-cover object-top rounded-2xl'
            />
          ) : (
            // No screenshot yet — themed cover so every card looks consistent
            <div className='storm-bg !min-h-0 w-full h-full rounded-2xl overflow-hidden flex items-center justify-center border border-white/10'>
              <span className='absolute h-28 w-28 rounded-full bg-teal-400/20 blur-2xl' />
              <span className='relative font-cinzel text-3xl font-bold text-frost drop-shadow-[0_2px_16px_rgba(45,212,191,0.5)]'>
                {name}
              </span>
            </div>
          )}

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => {
                sfx.click();
                window.open(source_code_link, "_blank", "noopener");
              }}
              onMouseEnter={sfx.hover}
              role='link'
              aria-label={`Open ${name}`}
              className='bg-night/80 border border-teal-400/50 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer transition hover:scale-110 hover:shadow-teal'
            >
              <FiArrowUpRight className='h-5 w-5 text-teal-300' />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-frost font-cinzel font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-mist text-[14px] leading-relaxed'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Projects = () => {
  useEffect(() => {
    unlock("treasure-hunter");
  }, []);

  return (
    <div className="mt-12">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>{projectsPage.eyebrow}</p>
        <h2 className={`${styles.sectionHeadTextAbout}`}>{projectsPage.heading}</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-mist text-[17px] max-w-3xl leading-[30px]'
        >
          {PROJECT_DESCRIPTION}
        </motion.p>
      </div>

      <div className='mt-20 mb-16 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
      <hr className='border-white/10' />
      <CTA />
    </div>
  );
};

export default SectionWrapper(Projects, "");
