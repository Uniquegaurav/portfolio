import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiArrowUpRight, FiFileText, FiGithub, FiLinkedin } from "react-icons/fi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import EarthCanvas from "../components/EarthCanvas";
import { contact, profile, ui } from "../constants";

const f = ui.contactForm;
import { unlock } from "../lib/achievements";
import { sfx } from "../lib/sfx";

const TYPING_IDLE_MS = 1500;

const linkFor = (name) => profile.socials.find((s) => s.name === name)?.link;

// Action cards under the form — empty links are skipped
const actions = () =>
  [
    { key: "linkedin", Icon: FiLinkedin, title: "LinkedIn", description: contact.linkedinDescription, href: linkFor("LinkedIn"), external: true },
    { key: "github", Icon: FiGithub, title: "GitHub", description: contact.githubDescription, href: linkFor("GitHub"), external: true },
    // Opens the resume on Google Drive, where visitors can request access
    { key: "resume", Icon: FiFileText, title: contact.resume.label, description: contact.resume.description, href: contact.resume.link, external: true },
  ].filter((a) => a.href);

const ActionCard = ({ action, index }) => (
  <motion.a
    href={action.href}
    target={action.external ? "_blank" : undefined}
    rel={action.external ? "noreferrer" : undefined}
    onMouseEnter={sfx.hover}
    onClick={sfx.click}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
    whileHover={{ y: -6 }}
    className='action-card frost-glass group flex items-center gap-4 p-5'
  >
    <span className='grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-400/10 text-2xl text-teal-300 ring-1 ring-teal-300/30 transition group-hover:bg-teal-400/20 group-hover:shadow-teal'>
      <action.Icon />
    </span>
    <span className='min-w-0 flex-1'>
      <span className='block font-cinzel text-lg font-bold text-frost'>{action.title}</span>
      <span className='block text-sm text-mist'>{action.description}</span>
    </span>
    <FiArrowUpRight className='shrink-0 text-xl text-mist transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-300' />
  </motion.a>
);

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "sent" | "error" | null
  // The globe pauses while the visitor types and resumes once they're idle
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef(null);
  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const handleChange = (e) => {
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), TYPING_IDLE_MS);
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        contact.emailjs.serviceId,
        contact.emailjs.templateId,
        {
          from_name: form.name,
          to_name: profile.name,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        contact.emailjs.publicKey
      )
      .then(
        () => {
          setLoading(false);
          setStatus("sent");
          sfx.success();
          unlock("raven-sent");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setStatus("error");
        }
      );
  };

  return (
    <div className="mt-12">
    <div
      className={`xl:mt-8 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] frost-glass p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>{contact.eyebrow}</p>
        <h3 className={styles.sectionHeadTextAbout}>{contact.heading}</h3>
        <p className='mt-3 text-sm text-mist'>
          {f.directEmailPrefix}{" "}
          <a href={`mailto:${profile.email}`} className='font-semibold text-teal-300 hover:underline'>
            {profile.email}
          </a>
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-6 flex flex-col gap-6'
        >
          <label className='flex flex-col'>
            <span className='text-frost font-medium mb-3'>{f.nameLabel}</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder={f.namePlaceholder}
              required
              className='bg-night-800/70 py-4 px-6 placeholder:text-mist/60 text-frost rounded-lg outline-none border border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-frost font-medium mb-3'>{f.emailLabel}</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder={f.emailPlaceholder}
              required
              className='bg-night-800/70 py-4 px-6 placeholder:text-mist/60 text-frost rounded-lg outline-none border border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-frost font-medium mb-3'>{f.messageLabel}</span>
            <textarea
              rows={4}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder={f.messagePlaceholder}
              required
              className='bg-night-800/70 py-4 px-6 placeholder:text-mist/60 text-frost rounded-lg outline-none border border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition font-medium'
            />
          </label>

          <div className='flex flex-wrap items-center gap-4'>
            <button type='submit' disabled={loading} onClick={sfx.click} onMouseEnter={sfx.hover} className='btn w-fit disabled:opacity-60'>
              {loading ? f.sending : f.send}
            </button>
          </div>
          {status && (
            <p
              role='status'
              className={`rounded-lg border px-4 py-3 text-sm ${
                status === "sent"
                  ? "border-teal-400/40 bg-teal-400/10 text-teal-200"
                  : "border-ember/50 bg-ember/10 text-ember-light"
              }`}
            >
              {status === "sent" ? contact.successMessage : contact.errorMessage}
            </p>
          )}
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas autoRotate={!typing} />
      </motion.div>
    </div>

      <div className='mt-14'>
        <h3 className='subhead-text'>{contact.ctaHeading}</h3>
        <div className='mt-6 grid gap-4 md:grid-cols-3'>
          {actions().map((a, i) => (
            <ActionCard key={a.key} action={a} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
