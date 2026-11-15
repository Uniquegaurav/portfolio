/**
 * Adapter between src/data/portfolio.json (the single place to edit content)
 * and the components. Do not put content here — edit portfolio.json instead.
 */
// `content` = bundled portfolio.json, or the remote JSON if VITE_CONTENT_URL is set (see src/data/content.js)
import { content as data } from "../data/content";
import {
  SiKotlin, SiJetpackcompose, SiAndroid, SiOpenjdk, SiFlutter, SiDart, SiReact,
  SiFirebase, SiAndroidstudio, SiGradle, SiJunit5, SiGit, SiGithubactions, SiJenkins,
  SiDocker, SiKubernetes, SiFigma, SiJavascript, SiNodedotjs, SiPython, SiMysql, SiMongodb,
  SiCplusplus, SiMicrosoftazure, SiSqlite,
} from "react-icons/si";
import { FiZap, FiLayers, FiGrid, FiBox, FiCheckCircle, FiActivity, FiCpu, FiBarChart2 } from "react-icons/fi";

const reactIcons = {
  SiKotlin, SiJetpackcompose, SiAndroid, SiOpenjdk, SiFlutter, SiDart, SiReact,
  SiFirebase, SiAndroidstudio, SiGradle, SiJunit5, SiGit, SiGithubactions, SiJenkins,
  SiDocker, SiKubernetes, SiFigma, SiJavascript, SiNodedotjs, SiPython, SiMysql, SiMongodb,
  SiCplusplus, SiMicrosoftazure, SiSqlite,
  FiZap, FiLayers, FiGrid, FiBox, FiCheckCircle, FiActivity, FiCpu, FiBarChart2,
};

// Image files referenced by name in the JSON (e.g. "nuclei.png").
const files = import.meta.glob("../assets/{icons,images}/*.{png,svg,jpg,jpeg}", {
  eager: true,
  import: "default",
});
const fileUrl = (name) => {
  if (!name) return null;
  if (/^(https?:)?\/\//.test(name) || name.startsWith("/")) return name; // hosted image URL
  const hit = Object.keys(files).find((k) => k.endsWith(`/${name}`));
  return hit ? files[hit] : null;
};

const tagColors = ["teal-text-gradient", "frost-text-gradient", "ember-text-gradient"];

export const profile = data.profile;
export const popup = data.popup;
export const about = data.about;
export const education = data.education;
export const projectsPage = data.projectsPage;
export const cta = data.cta;
export const contact = data.contact;
export const world = data.world;
export const achievements = data.achievements;
export const ui = data.ui;
export const personal = data.personal;
export const seo = data.seo;

const resolveSkill = (s) => ({
  ...s,
  Icon: reactIcons[s.icon] || (fileUrl(s.icon) ? null : FiBox),
  imageUrl: reactIcons[s.icon] ? null : fileUrl(s.icon),
});

// Skills are grouped by category: [{ group, description, items: [{ name, icon, color }] }]
export const skillGroups = data.skills.map((g) => ({ ...g, items: g.items.map(resolveSkill) }));
export const skills = skillGroups.flatMap((g) => g.items);

export const experiences = data.experiences.map((e) => ({
  ...e,
  icon: fileUrl(e.icon),
}));

export const projects = data.projects.map((p) => ({
  ...p,
  image: fileUrl(p.image),
  tags: p.tags.map((name, i) => ({ name, color: tagColors[i % tagColors.length] })),
}));

export const socialLinks = data.profile.socials
  .filter((s) => s.link)
  .map((s) => ({ ...s, iconUrl: fileUrl(s.icon) }));

export const homeStagesInfo = data.homeStages;

// Backwards-compatible names used by the pages
export const ABOUT_TITLE = data.about.intro;
export const WORK_EXP_TITLE = data.about.experienceIntro;
export const PROJECT_DESCRIPTION = data.projectsPage.description;
